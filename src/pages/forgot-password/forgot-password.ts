import { Component } from '@angular/core';
import { NavController, ViewController, AlertController, LoadingController, IonicPage } from 'ionic-angular';
import { UserService } from "../../providers/user-service";

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html'
})
export class ForgotpasswordPage {

  public email:string;
  public validEmail:boolean;
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public userService: UserService,

  ) {

  }

  presentAlert(title, subTitle) {
    let alert = this.alertCtrl.create({
     title: title, subTitle: subTitle, buttons: ['OK'] });
     alert.present();
   }

  validEmailAddress(){
    this.validEmail = this.ValidationEmail(this.email);
  }

  ValidationEmail (email){
      let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
  }

  doSubmit(){
    let loading = this.loadingCtrl.create();
    let val_email = this.ValidationEmail(this.email);
    let title:string = "Email Validation Failed";

    let title0 = "Sent Email Successfully"
    let subtitile0 = "Please check your email for reset password instructions"
    let subtitle1:string = "Email can't be blank";
    let subtitle2:string = "Email doesn't exist in system";

    if(this.email =='' || !this.email){
      this.presentAlert(title, subtitle1);
    }else if(val_email == false){
      this.presentAlert(title, subtitle2);
    }
    else{
      loading.present();
      this.userService.forgot(this.email)
        .subscribe(
          (data) => {
            loading.dismiss();
            console.log("Send request:", data);
            if(data.success == false)
            {
              this.presentAlert(title, subtitle2);
            } else{
              this.presentAlert(title0, subtitile0);
              this.navCtrl.pop();
            }
          },
          (data) => {
            loading.dismiss();
            console.log("Request error");
            this.presentAlert(title, subtitle2);
            this.navCtrl.pop();
          });
      }
  }

  dismiss(){
    this.navCtrl.pop();
  }

}
