import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-manage',
  templateUrl: 'manage.html'
})
export class ManagePage {

  constructor(public navCtrl: NavController) {

  }
  closePage(){
    this.navCtrl.pop();
  }
}
