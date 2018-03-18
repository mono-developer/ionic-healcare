import { Component } from '@angular/core';
import { NavController, ViewController, NavParams,IonicPage, LoadingController, ActionSheetController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserService } from "../../providers/user-service";
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
@IonicPage()
@Component({
  selector: 'page-manage-sharing',
  templateUrl: 'manage-sharing.html'
})
export class ManageSharingPage {

  public share:string;
  public email: any;
  public auth_token: any;
  public data: any;
  public others_profiles:any;
  public others_documents:any;
  public me_data:any;
  public others_profiles_count:any;
  public others_documents_count:any;
  public me_count:any;
  public todayTime:string;

  public searchQuery: string = '';
  public items: string[];
  public filter_list: Array<any>;
  public filter_flag: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public userService: UserService,
    public actionSheet: ActionSheet,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
  ) {
    this.share = 'other';
    this.todayTime = new Date().getTime().toString();

    this.filter_list = [ {id: 0, title: 'Tennis', checked: false}, {id: 1, title: 'M Basketball', checked: false},
                        {id: 3, title: 'Softball', checked: false}, {id: 4, title: 'Football', checked: false},
                        {id: 5, title: 'W Basketball', checked: false}, {id: 6, title: 'Baseball', checked: false},
                      ]
    this.filter_flag = false;
    this.initializeItems();
  }

  initializeItems() {
    this.items = [
      // 'Amsterdam', 'Bogota', 'American', 'Japan', 'Netherland',
      // 'Canada', 'Australia', 'United State', 'United Kingdom',
      // 'Nigeria', 'Taiwan'
    ];
  }

  onButtonClick(selectedItem) {
    if(!selectedItem.checked) {
      this.filter_list.map((item)=> {
        if(item.id == selectedItem.id){
          item.checked = true;
        } else {
          item.checked = false;
        }
      })
    }
  }

  getItems(ev: any) {
   // Reset items back to all of the items
   this.initializeItems();

   // set val to the value of the searchbar
   let val = ev.target.value;

   // if the value is an empty string don't filter the items
   if (val && val.trim() != '') {
     this.items = this.items.filter((item) => {
       return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
     })
   }
 }

  doRefresh(refresher) {
    setTimeout(() => {
      this.gettingData();
      refresher.complete();
    }, 1000);
  }

  ngOnInit(){
      this.gettingData();
  }

  gettingData(){
    let loading = this.loadingCtrl.create();
    loading.present();
    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.getShares(this.email, this.auth_token)
          .subscribe(
            (data) => {
              loading.dismiss();
              if(data.success == false){
              }else{
                this.data=data;
                console.log(data);
                this.others_profiles = data.sharing.shared_with_others.profiles;
                this.others_profiles_count = this.others_profiles.length;
                this.others_documents = data.sharing.shared_with_others.documents;
                this.others_documents_count = this.others_documents.length;
                this.me_data = data.sharing.shared_with_me.profiles;
                this.me_count = this.me_data.length;
              }
            },
            (data) => {
              loading.dismiss();
            });
        });
    });
  }

  segmentChanged(event){
    this.share = event.value;
  }

  changeFlag(){
    this.filter_flag = !this.filter_flag;
  }

  showOptionProfile(event, profile ){
    let actionSheet = this.actionSheetCtrl.create({

        title: profile.shareable.person.first_name + " " + profile.shareable.person.last_name + "'s Profile",
        subTitle: "Shared " + profile.updated_at.substr(0, 10) + " with\n" + profile.shared_email,
        cssClass: 'title-img',
        buttons: [
          {
            text: 'Set Password Protection',
            handler: () => {
              this.setPasswordBox(profile.id);
            }
          },{
            text: 'Set Sharing Expiration ',
            handler: () => {
              this.setExpireBox(profile.id);
            }
          },{
            text: 'Delete Shared Link',
            role: 'destructive',
            handler: () => {
              this.deleteAlert(profile.id);
            }
          },{
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
    actionSheet.present();
  }

  showOptionDocument(event, document ){
    let actionSheet = this.actionSheetCtrl.create({
        title: document.shareable.name,
        subTitle: "Shared " + document.updated_at.substr(0, 10) + " with\n" + document.shared_email,
        cssClass: 'title-img',
        buttons: [
          {
            text: 'Set Password Protection',
            handler: () => {
              this.setPasswordBox(document.id);
            }
          },{
            text: 'Set Sharing Expiration ',
            handler: () => {
              this.setExpireBox(document.id);
            }
          },{
            text: 'Delete Shared Link',
            role: 'destructive',
            handler: () => {
              this.deleteAlert(document.id);
            }
          },{
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
    actionSheet.present();
  }

  setPasswordBox(id){
    let prompt = this.alertCtrl.create({
        title: 'Set Password',
        cssClass:'alert-position',
        inputs: [
          {
            type: 'password',
            name: 'value'
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
            text: 'Save',
            handler: data => {
              console.log(id + " " + data.value);
              this.setPassword(id, data.value);
            }
          }
        ]
      });
      prompt.present();
  }

  setPassword(id, value){
    let loading = this.loadingCtrl.create();
    loading.present();
    var body =  {"id":id, "share":{"password": value}}
    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.ShareSetPass(this.email, this.auth_token, id, body)
          .subscribe(
            (data) => {
              loading.dismiss();
              console.log(JSON.stringify(data));
              if(data.success == false){
              }else{
                  this.gettingData();
              }
            },
            (data) => {
              loading.dismiss();
            });
      });
    });
  }

  setExpireBox(id) {
        let today = new Date();
        let prompt = this.alertCtrl.create({
          title: 'Set Expiration',
          cssClass:'alert-position',
          inputs: [
            {
              type: 'date',
              name: 'date',
              placeholder:'Select Date'
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
              text: 'Save',
              handler: data => {
                console.log('Saved clicked');
                console.log(id + " " + data.date);
                let newDate = new Date(data.date);
                let getDate = newDate.getTime().toString();
                console.log(getDate);
                console.log(this.todayTime);
                var dateNumber = this.todayTime;
                if( getDate.localeCompare(this.todayTime) <0){
                  let alert = this.alertCtrl.create({
                      title: 'Error!',
                      subTitle: "Expiration date must be greater than today's date",
                      buttons: ['OK']
                    });
                    alert.present();
                } else{
                  this.setExpiration(id, getDate);
                }
            }
          }
        ]
      });
      prompt.present();
  }

  setExpiration(id, value){
     let loading = this.loadingCtrl.create();
     loading.present();
     var body =  {"id":id, "share":{"expired_at": value}}
     this.storage.get('email').then(val=>{
       this.email = val;
       this.storage.get('auth_token').then(val=>{
         this.auth_token = val;
         this.userService.ShareSetPass(this.email, this.auth_token, id, body)
           .subscribe(
             (data) => {
               loading.dismiss();
               console.log(JSON.stringify(data));
               if(data.success == false){
               }else{
                  this.gettingData();
               }
             },
             (data) => {
               loading.dismiss();
             });
       });
     });
   }

   deleteAlert(id){
     let alert = this.alertCtrl.create({
    title: 'Warning',
    message: 'Do you want to delete this item?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Ok',
        handler: () => {
          this.deleteItem(id);
        }
      }
    ]
  });
  alert.present();
   }

   deleteItem(id){
    let loading = this.loadingCtrl.create();
    loading.present();

    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.deleteShares(this.email, this.auth_token, id)
          .subscribe(
            (data) => {
              loading.dismiss();
              console.log(JSON.stringify(data));
              if(data.success == false){
              }else{
                  this.gettingData();
              }
            },
            (data) => {
              loading.dismiss();
            });
      });
    });
  }

  gotoMeData(event, profile){
    console.log('gotoMeData');
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

}
