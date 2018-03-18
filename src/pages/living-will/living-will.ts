import { Component } from '@angular/core';
import { NavController,IonicPage } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-living-will',
  templateUrl: 'living-will.html'
})
export class LivingWillPage {

  constructor(public navCtrl: NavController) {

  }

  closePage(){
    this.navCtrl.pop();
  }

}
