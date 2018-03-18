import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams, IonicPage } from 'ionic-angular';
import { UserService } from "../../providers/user-service";
import { Storage } from '@ionic/storage';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  // public user: any = {email:'dev1plus@fliptechdev.com', password: 'Fl1pT3chD3v'};
  public user: any = {email:'oyamamadam@gmail.com', password: 'Oyamamadam'};
  // public user: any = {email:'', password: ''};
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public userService: UserService,
    public storage: Storage
  ) {
  }

  presentAlert(title, subTitle) {
     let alert = this.alertCtrl.create({
      title: title, subTitle: subTitle, buttons: ['OK'] });
      alert.present();
    }

  showConfirm(title, subtilte) {
    let confirm = this.alertCtrl.create({
      title: title,
      message: subtilte,
      buttons: [
        {
          text: 'Forgot?',
          handler: () => {
            console.log('Disagree clicked');
            this.navCtrl.push('ForgotpasswordPage');
          }
        },
        {
          text: 'Try Again',
          handler: () => {
            console.log('Try Again');
          }
        }
      ]
    });
    confirm.present();
  }

  doLogin(){
    let loading = this.loadingCtrl.create();
    var title =  "Error";
    var title1 = "Email Validation Failed"
    var subtitle0 = "Email is invalid";
    var subtitle1:string = "Please fill out all information and then contune";
    var subtitle2:string = "Incorrect Username or Password"

    if(this.user.email == '' || this.user.password == '' || !this.user.email || !this.user.password)
    {
      this.presentAlert( title, subtitle1);
    }else
    {
      loading.present();
      this.userService.login(this.user.email, this.user.password)
        .subscribe(
          (data) => {
            loading.dismiss();
            if(data.success == false){
              this.showConfirm(title, subtitle2)
           }else{
             this.storage.set('data', data);
             this.storage.set('email', data.user.email);
             this.storage.set('auth_token', data.user.authentication_token);
             this.navCtrl.setRoot('TabsPage');
           }
          },
          (data) => {
            loading.dismiss();
            this.showConfirm( title, subtitle2);
          });
      }
    }

  goForgotPage(){
    this.navCtrl.push('ForgotpasswordPage');
  }

  dismiss(){
    this.navCtrl.pop();
  }

}
