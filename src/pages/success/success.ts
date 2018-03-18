import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, IonicPage} from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-success',
  templateUrl: 'success.html'
})
export class SuccessPage {

  public value:string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    this.value = navParams.get("value");
    console.log(this.value);
    }

  done(){
      this.navCtrl.setRoot('TabsPage');
  }
  goReminder(){
      this.navCtrl.setRoot('TabsPage');
  }


}
