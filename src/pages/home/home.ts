import { Component } from '@angular/core';
import { NavController, LoadingController, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserService } from "../../providers/user-service";
import { RemindersService } from "../../providers/reminders-service";

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tab4Root = 'InboxPage';

  public profiles: any;
  public id:number;
  public email: string;
  public auth_token: string;
  public reminders: any;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public userService: UserService,
    public remindersService: RemindersService,
  ) {
  }

  ionViewWillEnter() {
    // this.getData();
  }

  getData(){
    let loading = this.loadingCtrl.create();
    loading.present();

    this.remindersService.getForToday()
    .then((res) => {
      this.reminders = res;
      loading.dismiss();
    }, (err) => {
      loading.dismiss();
    })
  }

  goInboxPage(){
    this.navCtrl.parent.select(3);
  }
  goSchedulePage(){

    // this.navCtrl.push(SchedulePage);

    console.log('go Schedule Page');
    this.navCtrl.push('SchedulePage');
  }

}
