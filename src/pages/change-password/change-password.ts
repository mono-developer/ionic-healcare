import { Component } from '@angular/core';
import { NavController,  AlertController, LoadingController, NavParams, ToastController, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";
@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html'
})
export class ChangePasswordPage {

  current_pass:string;
  new_pass:string;
  confirm_pass:string;
  auth_token:string;
  email:string;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public userService: UserService,
    public storage: Storage,
    private flagService: Flags
  ) {
  }
  updatePassword(){

    if(this.current_pass =='' || this.current_pass == null){
      let alert = this.alertCtrl.create({
        title: "Error", subTitle: "Please Enter Current Password", buttons: ['OK']
      });
      alert.present();
    }else if(this.new_pass =='' || this.new_pass == null )  {
      let alert = this.alertCtrl.create({
        title: "Error", subTitle: "Please Enter New Password", buttons: ['OK']
      });
      alert.present();
    }else if(this.confirm_pass =='' || this.confirm_pass == null )  {
      let alert = this.alertCtrl.create({
        title: "Error", subTitle: "Please Enter Confirm Password", buttons: ['OK']
      });
      alert.present();
    }else if(this.new_pass != this.confirm_pass )  {
      let alert = this.alertCtrl.create({
        title: "Error", subTitle: "Please change confirm password", buttons: ['OK']
      });
      alert.present();
    } else{
      let alert = this.alertCtrl.create({
        title: "Success", subTitle: "Success", buttons: ['OK']
      });
      alert.present();

      let loading = this.loadingCtrl.create();
      loading.present();
      let body = {"current_password":this.current_pass, "user":{"password":this.new_pass, "password_confirmation":this.confirm_pass}};

      console.log(body);
      this.storage.get('email').then(val=>{
        this.email = val;
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
                    let toast = this.toastCtrl.create({ message: 'Update Successfully', duration: 2000, position: 'bottom' });
                    toast.present();
                    console.log(data);
                    this.storage.set('email', data.user.email);
                    this.storage.set('auth_token', data.user.authentication_token);
                    this.navCtrl.pop();

                  }
                });
              });
      });
    }


  }



  dismiss(){
    this.navCtrl.pop();
  }

}
