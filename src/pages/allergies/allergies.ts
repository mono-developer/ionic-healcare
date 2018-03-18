import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, LoadingController, NavParams,IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";

@IonicPage()
@Component({
  selector: 'page-allergies',
  templateUrl: 'allergies.html'
})
export class AllergiesPage {

  profile_id:any;
  allergiesData: any;
  personData:any;
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
    private flagService: Flags) {

      this.profile_id = navParams.get("profile_id");
      this.personData = navParams.get("personData");
      this.imagePath =  this.personData.image_url.thumb;
      this.personName = this.personData.last_name;
      console.log('personData', this.personData);
      this.email = "";
      this.auth_token = "";
      this.storage.set("active_page", "AllergiesPage");
      // console.log("gghghghg",this.storage.get("ActivePage").then(val=>{}))
      // this.storage.get("active_page").then(val=>{
      //   console.log("gghghghg", val )
      // })
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
    let loading = this.loadingCtrl.create({
      content: 'Loading Allergies'
    });    
    var endValue = "/allergies"
    loading.present();
    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.dataGet(this.email, this.auth_token, this.profile_id, endValue)
          .subscribe(
            (data) => {
              loading.dismiss();
              console.log("Alergies Data: ", data);
              if(data.success == false){
                let alert = this.alertCtrl.create({
                  title: "Error", subTitle: "Get Data Error", buttons: ['OK']
                });
                alert.present();
                this.navCtrl.pop();
              } else{
                this.allergiesData = data.allergies;
              }
          });
      });
    });
  }
  createAllergiesData(){
    console.log('go AllergiesCreatePage');
    let profileModal = this.modalCtrl.create('AllergiesEditPage', { save: 'save', profile_id:this.profile_id});
    profileModal.onDidDismiss(data =>{
      if(data){
        this.gettingdata();
      }
    })
    profileModal.present();
  }

  editAllergiesData(event, allergiesData){
    console.log('go AllergiesEditPage');
    this.navCtrl.push('AllergiesEditPage',{ edit:'edit', allergiesData: allergiesData, profile_id:this.profile_id });
  }

  closePage(){
    this.navCtrl.pop();
  }
}
