import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

import { Storage } from '@ionic/storage';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
  ) {
 }

  ionViewWillEnter(){
    this.storage.get('data').then(val=>{
      if (val != null && val.success== true){
        console.log("home page");
        this.navCtrl.setRoot('TabsPage');
      }
    });
  }
  goLoginPage(){
    console.log("go LoginPage");
    this.navCtrl.push('LoginPage');
  }
  goSignupPage(){
    console.log("go SignupPage");
    this.navCtrl.push('SignupPage');
  }
}
