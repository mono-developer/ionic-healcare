import { Component } from '@angular/core';
import { NavController, ViewController, LoadingController,IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserService } from "../../providers/user-service";
@IonicPage()
@Component({
  selector: 'page-preview-profile',
  templateUrl: 'preview-profile.html'
})
export class PreviewProfilePage {

  public profileData:any;
  categories: Array<{id:string, name:string}>;
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public userService: UserService,
  ) {
    this.categories = [
      { id: '1', name: 'Mickael' },
      { id: '2', name: 'Johnny' },
    ];

    this.storage.get('profileData').then(val=>{
      this.profileData = val;
      console.log(this.profileData);
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }



}
