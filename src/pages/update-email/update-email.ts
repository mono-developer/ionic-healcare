import { Component } from '@angular/core';
import { NavController,  AlertController, LoadingController, NavParams, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";
@IonicPage()
@Component({
  selector: 'page-update-email',
  templateUrl: 'update-email.html'
})
export class UpdateEamilPage {

  email:string;
  new_email:string;
  auth_token:string;
  current_pass:string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public userService: UserService,
    public storage: Storage,
    private flagService: Flags
  ) {
    this.storage.get('email').then(val=>{
      this.email = val;
    });
    this.new_email = '';
    this.auth_token = "";
  }

  updateEmail(){

    if(this.current_pass =='' || this.current_pass == null){
      let alert = this.alertCtrl.create({
        title: "Error", subTitle: "Please Enter Current Password", buttons: ['OK']
      });
      alert.present();
    } else{
      let alert = this.alertCtrl.create({
        title: "Success", subTitle: "Success", buttons: ['OK']
      });
      alert.present();

      let loading = this.loadingCtrl.create();
      loading.present();
      let body = {"current_password":this.current_pass, "user":{"email": this.new_email}};

      console.log(body);
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.updateInfo(this.email, this.auth_token, body)
          .subscribe(
            (data) => {
              loading.dismiss();
              console.log("Profile Data: ", data);
              if(data.success == false && data.error_code == "0102" ){
                let alert = this.alertCtrl.create({
                  title: "Error", subTitle: "Email has already been taken", buttons: ['OK']
                });
                alert.present();
              }else if(data.success == false){
                let alert = this.alertCtrl.create({
                  title: "Error", subTitle: "Updated Error ", buttons: ['OK']
                });
                alert.present();
              }else{
                // this.flagService.setChangedFlag(true);
                let alert = this.alertCtrl.create({
                  title: "Updated", subTitle: "Update Success", buttons: ['OK']
                });
                alert.present();
                console.log(data);
                this.storage.set('email', data.user.email);
                this.storage.set('auth_token', data.user.authentication_token);

                this.navCtrl.pop();

              }
            });
        });
    }


  }

  dismiss(){
    this.navCtrl.pop();
  }
}
