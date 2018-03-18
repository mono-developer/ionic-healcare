import { Component } from '@angular/core';
import { NavController,IonicPage } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-dnr',
  templateUrl: 'dnr.html'
})
export class DNRPage {

  constructor(public navCtrl: NavController) {

  }
  closePage(){
    this.navCtrl.pop();
  }
}
