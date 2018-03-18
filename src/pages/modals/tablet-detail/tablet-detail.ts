import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, IonicPage } from 'ionic-angular';
// @IonicPage()
@Component({
  selector: 'tablet-detail',
  templateUrl: 'tablet-detail.html'
})
export class TabletDetailModal {

categories: Array<{id:number, name:string, icon:string, show:boolean }>;
  public tabletData: any;

  constructor(
    public viewCtrl: ViewController,
    params: NavParams
  ) {
    this.tabletData = params.get('tabletData');
    console.log(this.tabletData);
  }

  onSkip() {
    let reply = false;
    this.viewCtrl.dismiss(reply);
  }

  onEdit() {
    let reply = true;
    this.viewCtrl.dismiss(reply);
  }
}
