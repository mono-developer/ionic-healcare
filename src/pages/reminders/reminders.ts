import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController , IonicPage} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserService } from "../../providers/user-service";
import { DependentService } from "../../providers/dependent-service";
import { RemindersService } from '../../providers/reminders-service';
import { LocalNotificationService } from '../../providers/local-notification-service';
import { BaseMedicineService } from "../../providers/base-medicine-service";
@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-reminders',
  templateUrl: 'reminders.html'
})
export class RemindersPage {

  public segmentValue: string;

  items:any;
  histories: Array<{id:number, date:string, used: number, needed:number}>;

  public taken: any = {
    used: 0,
    needed: 0
  };

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public dependentService: DependentService,
    public remindersService: RemindersService,
    public localNotificationService: LocalNotificationService,
    public storage: Storage,
    public userService: UserService,
    public loadingCtrl: LoadingController,
    public baseMedicineService: BaseMedicineService,
  ) {
    this.segmentValue = "reminders";

    this.histories = [
      {id: 1, date: 'July 10, 2017', used: 3, needed: 5},
      {id: 2, date: 'July 9, 2017', used: 3, needed: 5},
      {id: 3, date: 'July 8, 2017', used: 3, needed: 5},
      {id: 4, date: 'July 7, 2017', used: 3, needed: 5},
      {id: 5, date: 'July 6, 2017', used: 3, needed: 3},
      {id: 6, date: 'July 5, 2017', used: 1, needed: 3},
      {id: 7, date: 'July 4, 2017', used: 5, needed: 5}
    ];

    this.taken.needed = 90;
    this.taken.used = 24;
  }

  ionViewWillEnter() {
    this.getDatas();
  }

  getDatas() {
    this.remindersService.getAll()
    .then((res) => {
      this.items = res;
      this.items.forEach((item) => {
        this.storage.get('email').then(val=>{
          let email = val;
          this.storage.get('auth_token').then(val=>{
            let auth_token = val;
            console.log('dependent_id', item.dependent_id);
            this.userService.getPersonalProfiles(auth_token, email, item.dependent_id)
              .subscribe(
                (data) => {
                  if(data.success == false){
                    this.navCtrl.pop();
                  } else{
                    item.profile = data;
                    console.log('item', item);
                  }
                },
                (data) => {
                  console.log('internet Fails');
                });
            });
        });
        this.baseMedicineService.getForm(item.form_Id)
        .then((res) => {
          item.form = res;
        }, (err) => {
          console.log(err);
        });

        this.baseMedicineService.getColor(item.color1_Id)
        .then((res) => {
          item.color1 = res;
        }, (err) => {
          console.log(err);
        });

        this.baseMedicineService.getColor(item.color2_Id)
        .then((res) => {
          item.color2 = res;
        }, (err) => {
          console.log(err);
        });
      })
    }, (err) => {
      console.log(err);
    });
  }

  addReminder () {
    this.navCtrl.push('SelectMedicationPage');
  }

  showDetail (item) {
    let editReminderModal = this.modalCtrl.create('EditReminderModal', {reminder: item});
    editReminderModal.onDidDismiss(() => {
      this.getDatas();
    });
    editReminderModal.present();
  }

}
