import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, LoadingController, AlertController, ToastController, IonicPage } from 'ionic-angular';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";
import { Storage } from '@ionic/storage';
@IonicPage()
@Component({
  selector: 'page-linked-product-edit',
  templateUrl: 'linked-product-edit.html'
})
export class LinkedProductEditPage {

  public linkedData:any;
  public profile_id:any;
  public email:any;
  public auth_token:any;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public userService: UserService,
    public storage: Storage,
    public flagService:Flags,
    public alertCtrl:AlertController) {

      this.linkedData = navParams.get('LinkedData');
      this.profile_id = navParams.get('profile_id');
      console.log(JSON.stringify(this.linkedData));
  }

  isReadonly() {
    return this.isReadonly;   //return true/false 
  }

  ngOnInit(){
    this.storage.get('email').then(val=>{
      this.email = val;
    });

    this.storage.get('auth_token').then(val=>{
      this.auth_token = val;
    });
  }

  updateLikedData(){
    let loading = this.loadingCtrl.create();
    loading.present();

    this.userService.updateIdBands(this.email, this.auth_token, this.profile_id, this.linkedData.name, this.linkedData.id)
      .subscribe(
        (data) => {
          loading.dismiss();
          if(data.success == false){
              let alert = this.alertCtrl.create({
                title: "Error", subTitle: "Updated Error", buttons: ['OK']
              });
              alert.present();
           }else{
             this.flagService.setChangedFlag(true);
             let toast = this.toastCtrl.create({
              message: 'Updated Successfully', duration: 2000, position: 'bottom',
            });
            toast.present();
             this.navCtrl.pop();
           }
        },
        (data) => {
          console.log("Link To Profile:" + JSON.stringify(data));
          loading.dismiss();
          this.navCtrl.pop();
        });
    }

  deleteAlert(){
    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      subTitle: 'Do you really want to delete this item?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            console.log('Buy clicked');
            this.deleteLinkedData();
            }
          }
        ]
      });
      alert.present();
  }

  deleteLinkedData(){
    let loading = this.loadingCtrl.create();
    loading.present();

    this.userService.deleteIdBands(this.email, this.auth_token, this.profile_id, this.linkedData.id)
      .subscribe(
        (data) => {
          loading.dismiss();
          if(data.success == false){
            let alert = this.alertCtrl.create({
              title: "Error", subTitle: "Unable to delete record", buttons: ['OK']
            });
            alert.present();
           }else{
              let toast = this.toastCtrl.create({
                message: 'Record Deleted', duration: 2000, position: 'bottom',
              });
              toast.present();
              this.flagService.setChangedFlag(true);
              this.navCtrl.pop();
           }
        },
        (data) => {
          console.log("Link To Profile:" + JSON.stringify(data));
          loading.dismiss();
          this.navCtrl.pop();
        });
  }


  dismiss() {
     this.viewCtrl.dismiss();
   }

}
