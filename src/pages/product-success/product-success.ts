import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, LoadingController,IonicPage } from 'ionic-angular';

import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";
import { Storage } from '@ionic/storage';
@IonicPage()
@Component({
  selector: 'page-product-success',
  templateUrl: 'product-success.html'
})
export class ProductSuccessPage {

  public email:string;
  public auth_token:string;
  public page:any;
  public data:any;
  public link:any = {};
  public profile_id:string;
  // tab:Tabs;
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public userService: UserService,
    public storage: Storage
  ) {
    this.page = navParams.get("page");
    console.log(this.page);
    this.data = navParams.get("data");
    if(this.data){
      this.link = this.data.id_band;
    }

    this.profile_id = navParams.get("profile_id");

    console.log('page', this.page + this.link + this.profile_id)
  }

  ngOnInit(){
    this.storage.get('email').then(val=>{
      this.email = val;
    });

    this.storage.get('auth_token').then(val=>{
      this.auth_token = val;
    });
  }

  done(){
    if(this.page == 'likeEdit'){
      this.updateLabel();
    }else{
      this.navCtrl.setRoot('TabsPage');
    }
  }

  updateLabel(){
    let loading = this.loadingCtrl.create();
    loading.present();

    this.userService.updateIdBands(this.email, this.auth_token, this.profile_id, this.link.name, this.link.id)
      .subscribe(
        (data) => {
          loading.dismiss();
          if(data.success == false){
              this.navCtrl.pop();
           }else{
             console.log("Link To Profile:" + JSON.stringify(data));
             this.navCtrl.setRoot('TabsPage');
           }

        },
        (data) => {
          console.log("Link To Profile:" + JSON.stringify(data));
          loading.dismiss();
          this.navCtrl.setRoot('TabsPage');
        });
  }
}
