import { Component } from '@angular/core';
import { NavController,  AlertController, LoadingController, NavParams, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";
@IonicPage()
@Component({
  selector: 'page-share-document',
  templateUrl: 'share-document.html'
})
export class ShareDocumentPage {

  shareData:any = {};
  email:string;
  auth_token:string;
  profile_id:any;
  item:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public userService: UserService,
    public storage: Storage,
    private flagService: Flags
  ) {
    this.item = navParams.get("item");
    this.profile_id = navParams.get("profile_id");
    console.log(this.item);
  }



  share(){
    console.log(this.shareData);

    console.log('shareData', this.share);
      this.shareData.in_timezone = 'America/New_York';
      let share_date = new Date(this.shareData.expired_at);
      let expired_at = share_date.getTime().toString();
      console.log(expired_at);

      let body = {
        "profile_id":this.profile_id.toString(),
        "identity":{
        "item_id": this.item.id.toString(),
        "item_type": this.item.item_type
      },
        "share": {
            "expired_at": expired_at,
            "in_timezone":"America/New_York",
            "message": this.shareData.message,
            "password": this.shareData.password,
            "shared_email": [this.shareData.shared_email]}
          }
      console.log(body);
      let loading = this.loadingCtrl.create();
      console.log(body);
      loading.present();
      this.storage.get('email').then(val=>{
        this.email = val;
        this.storage.get('auth_token').then(val=>{
          this.auth_token = val;
          this.userService.ShareProfile(this.email, this.auth_token, body)
            .subscribe(
              (data) => {
                loading.dismiss();
                console.log("share Data: ", data);
                if(data.success == false){
                  let alert = this.alertCtrl.create({
                    title: "Error", subTitle: "Create Error", buttons: ['OK']
                  });
                  alert.present();
                } else{
                  let alert = this.alertCtrl.create({
                    title: "Shared", subTitle: "Shared with " + this.shareData.shared_email, buttons: ['OK']
                  });
                  alert.present();
                  console.log(data);
                  this.dismiss()
                }
            });
        });
      });
  }
  dismiss(){
    this.navCtrl.pop();
  }
}
