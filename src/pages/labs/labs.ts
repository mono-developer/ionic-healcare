import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, LoadingController, NavParams, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";
@IonicPage()
@Component({
  selector: 'page-labs',
  templateUrl: 'labs.html'
})
export class LabsPage {
  labsData: any;
  personData:any;
  profile_id:any;
  imagePath:any;
  personName:any;
  email:string;
  auth_token:string;
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public userService: UserService,
    public storage: Storage,
    private flagService: Flags
  ) {
    this.profile_id = navParams.get("profile_id");
    this.personData = navParams.get("personData");
    this.imagePath =  this.personData.image_url.thumb;
    this.personName = this.personData.last_name;
    console.log('personData', this.personData);
    this.email = "";
    this.auth_token = "";
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.gettingdata();
      refresher.complete();
    }, 1000);
  }

  ngOnInit(){
      this.flagService.setChangedFlag(false);
      this.gettingdata();
    }

  ionViewDidEnter(){
    if(this.flagService.getChangedFlag()){
      this.gettingdata();
    }
  }
  gettingdata(){
    let loading = this.loadingCtrl.create();
    var endValue = "/labs"
    loading.present();
    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.dataGet(this.email, this.auth_token, this.profile_id, endValue)
          .subscribe(
            (data) => {
              loading.dismiss();
              console.log("Labs Data: ", data);
              if(data.success == false){
                let alert = this.alertCtrl.create({
                  title: "Error", subTitle: "Get Data Error", buttons: ['OK']
                });
                alert.present();
                this.navCtrl.pop();
              } else{
                this.labsData = data.labs;
              }
            });
        });
      });
    }

    createLabsData(){
      console.log('go LabsCreatePage');
      let profileModal = this.modalCtrl.create('LabsEditPage', { save: 'save', profile_id: this.profile_id });
      profileModal.onDidDismiss(data =>{
        if(data){
          this.gettingdata();
        }
      })
      profileModal.present();
    }

    editLabsData(event, id){
      console.log('go LabsEditPage');
      this.navCtrl.push('LabsEditPage',{ edit:'edit', id: id, profile_id: this.profile_id});
    }
    closePage(){
      this.navCtrl.pop();
    }
}
