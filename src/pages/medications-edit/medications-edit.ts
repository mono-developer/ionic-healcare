import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, ModalController, AlertController,  LoadingController, ToastController, IonicPage } from 'ionic-angular';
import { EditReminderModal } from '../modals/edit-reminder/edit-reminder';
import { Storage } from '@ionic/storage';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";
import { Toast } from 'ionic-angular/components/toast/toast';

@IonicPage()
@Component({
  selector: 'page-medications-edit',
  templateUrl: 'medications-edit.html'
})
export class MedicationsEditPage {

  public save:string;
  public edit:string;
  profile_id:any;
  reminderData:any = {};
  email:string;
  auth_token:string;
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public userService: UserService,
    public storage: Storage,
    public toastCtrl: ToastController,
    private flagService: Flags
  ) {
    this.save = navParams.get("save");
    this.edit = navParams.get("edit");
    console.log(this.save);
    if (navParams.get("reminderData") != null){
        this.reminderData = navParams.get("reminderData");
        console.log(this.reminderData);
      }
    this.profile_id = navParams.get("profile_id");
    this.email = "";
    this.auth_token = "";
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
            this.deleteEmergencyData();
            }
          }
        ]
      });
      alert.present();
  }

  deleteEmergencyData(){

  }

  goEditReminderPage(){
    console.log('go EditReminderPage');
    let editReminderModal = this.modalCtrl.create('EditReminderModal');
    editReminderModal.present();
  }

  dismiss() {
     this.viewCtrl.dismiss();
   }
}
