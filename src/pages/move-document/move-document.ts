import { Component } from '@angular/core';
import { NavController, ViewController, AlertController, LoadingController, NavParams,IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";
@IonicPage()
@Component({
  selector: 'page-move-document',
  templateUrl: 'move-document.html'
})
export class MoveDocumentPage {

  email:string;
  auth_token:string;
  documents:any = [];
  profile_id:any;
  folder_name:any;
  parent_id:any;
  slug:any;
  oldItem:any;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public userService: UserService,
    public storage: Storage,
    private flagService: Flags
  ) {
    this.profile_id = navParams.get("profile_id");
    let item = navParams.get("item");
    if(item == undefined){
      this.slug = '';
      this.parent_id = ''
    }else{
      this.slug = item.slug;
      this.parent_id = item.id
    }

    console.log('dtttt', this.profile_id , item, this.parent_id, this.slug);
    this.oldItem = navParams.get("oldItem");
    console.log('oldItem', this.oldItem);

  }

  ionViewWillEnter(){
    this.getDocumentData()
  }

  getDocumentData(){

    let loading = this.loadingCtrl.create();
    loading.present();

    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;

        this.userService.getDocuments(this.email, this.auth_token, this.profile_id, this.slug)
          .subscribe(
            (data) => {
              loading.dismiss();
              if(data.success == false){
                console.log("get Documents:" + JSON.stringify(data));
             }else{
               this.documents = data.items;
               console.log(this.documents);
              }
            },
            (data) => {
              loading.dismiss();
            });
        });
    });
  }

  createFolderName(){
    let prompt = this.alertCtrl.create({
      title: 'Create Folder',
      message: "",
      inputs: [
        {
          name: 'folder_name',
          placeholder: '–'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            console.log('Saved clicked');
            this.folder_name = data.folder_name;
            this.createFolder();
          }
        }
      ]
    });
    prompt.present();
  }

  createFolder(){
      console.log('parent_id:' + this.parent_id + " name:" + this.folder_name);

      let loading = this.loadingCtrl.create();
      loading.present();

      this.storage.get('email').then(val=>{
        this.email = val;
        this.storage.get('auth_token').then(val=>{
          this.auth_token = val;
          this.userService.createFolder(this.email, this.auth_token, this.profile_id, this.folder_name, this.parent_id)
            .subscribe(
              (data) => {
                loading.dismiss();
                if(data.success == false){
                  console.log("get Documents:" + JSON.stringify(data));
                  this.getDocumentData();
                 }else{
                  console.log("get Documents:" + JSON.stringify(data));
                  this.getDocumentData();
               }
              },
              (data) => {
                loading.dismiss();
            });
        });
      });
  }

  moveDocument(){
    console.log('moveDocument');
    console.log('parent_id:' + this.parent_id + " name:" + this.folder_name);

    let id = this.oldItem.id;
    let type = this.oldItem.item_type;
    let name = this.oldItem.name;
    let parent_id;
    if(this.parent_id == null){
      parent_id = 0
    }else{
      parent_id = this.parent_id
    }
    let loading = this.loadingCtrl.create();
    loading.present();

    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;

        if(type == 'folder'){
          this.userService.moveFolder(this.email, this.auth_token, this.profile_id, parent_id, id, name)
            .subscribe(
              (data) => {
                loading.dismiss();
                if(data.success == false){
                  console.log("get Documents:" + JSON.stringify(data));
                 }else{
                  console.log("get Documents:" + JSON.stringify(data));
                  this.dismiss()
               }
              },
              (data) => {
                loading.dismiss();
            });
        }else{
          this.userService.moveDocument(this.email, this.auth_token, this.profile_id, parent_id, id)
            .subscribe(
              (data) => {
                loading.dismiss();
                if(data.success == false){
                  console.log("get Documents:" + JSON.stringify(data));
                 }else{
                  console.log("get Documents:" + JSON.stringify(data));
                  this.dismiss()
               }
              },
              (data) => {
                loading.dismiss();
            });
          }
      });
    });
  }

  goNextPage(event, data){
    console.log(data);
    this.navCtrl.push(MoveDocumentPage, { item: data, profile_id: this.profile_id, oldItem: this.oldItem});
  }

  dismiss(){
    let firstViewCtrl = this.navCtrl.first();
    this.navCtrl.popToRoot({animate: false}).then(() => firstViewCtrl.dismiss());
  }
}
