import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, LoadingController, NavParams, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";
@IonicPage()
@Component({
  selector: 'page-linked-product',
  templateUrl: 'linked-product.html'
})
export class LinkedProductPage {

  profile_id:any;
  LinkedData: any;
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
      console.log('personData', this.personData);
      this.imagePath =  this.personData.image_url.thumb;
      this.personName = this.personData.last_name;

      this.email = "";
      this.auth_token = "";
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.gettingData();
      refresher.complete();
    }, 1000);
  }

  ngOnInit(){
      this.flagService.setChangedFlag(false);
      this.gettingData();
    }

    ionViewDidEnter(){
      if(this.flagService.getChangedFlag()){
        this.gettingData();
      }
    }

    gettingData(){
      let loading = this.loadingCtrl.create();
      var endValue = "/id_bands"
      loading.present();
      this.storage.get('email').then(val=>{
        this.email = val;
        this.storage.get('auth_token').then(val=>{
          this.auth_token = val;
          this.userService.dataGet(this.email, this.auth_token, this.profile_id, endValue)
            .subscribe(
              (data) => {
                loading.dismiss();
                console.log("Vital Data: ", data);
                if(data.success == false){
                  let alert = this.alertCtrl.create({
                    title: "Error", subTitle: "Get Data Error", buttons: ['OK']
                  });
                  alert.present();
                  this.navCtrl.pop();
                } else{
                  this.LinkedData = data.id_bands;
                  console.log(data);
                }
            });
        });
      });
    }

    createLinkedData(){
      console.log('go AddCategory Page');
      let profileModal = this.modalCtrl.create('LinkEditPage', { profile_id: this.profile_id});
      profileModal.present();
    }
    editLinkedData(event, LinkedData){
      console.log('go editLiked Page');
      this.navCtrl.push('LinkedProductEditPage', { profile_id: this.profile_id, LinkedData: LinkedData});

    }


    closePage(){
      this.navCtrl.pop();
    }

}
