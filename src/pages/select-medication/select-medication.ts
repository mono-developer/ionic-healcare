import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';


import { DependentService } from "../../providers/dependent-service";
import { RemindersService } from '../../providers/reminders-service';
import { BaseMedicineService } from "../../providers/base-medicine-service";
import { UserService } from "../../providers/user-service";
@IonicPage()
@Component({
  selector: 'select-medication',
  templateUrl: 'select-medication.html'
})
export class SelectMedicationPage {

  persons: any = [];

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public dependentService: DependentService,
    public baseMedicineService: BaseMedicineService,
    public remindersService: RemindersService,
    public userService: UserService,
    public storage: Storage,
    public loadingCtrl: LoadingController
  ) {
  }

  ionViewWillEnter() {
    console.log('* Here is Select Medication Page *');
    // this.persons = this.dependentService.getAll();
    this.getDatas();

  }

  getDatas() {
    let loading = this.loadingCtrl.create();
    loading.present();

    this.storage.get('email').then(val=>{
      let email = val;
      this.storage.get('auth_token').then(val=>{
        let auth_token = val;
        this.userService.getProfiles(email, auth_token)
          .subscribe(
            (data) => {
              if(data.success == false){
                loading.dismiss();
              }else{
                this.persons = data.profiles;
                console.log(this.persons);
                loading.dismiss();
                this.persons.forEach(person => {
                  this.remindersService.getForDependent(person.id)
                  .then((res) => {
                    let items = res;
                    person.reminders = items;
                    person.reminders.forEach(reminder => {
                      this.baseMedicineService.getForm(reminder.form_Id)
                      .then((res) => {
                        reminder.form = res;
                      }, (err) => {
                        console.log(err);
                        loading.dismiss();
                      });

                      this.baseMedicineService.getColor(reminder.color1_Id)
                      .then((res) => {
                        reminder.color1 = res;
                      }, (err) => {
                        console.log(err);
                        loading.dismiss();
                      });

                      this.baseMedicineService.getColor(reminder.color2_Id)
                      .then((res) => {
                        reminder.color2 = res;
                      }, (err) => {
                        console.log(err);
                        loading.dismiss();
                      });
                    });
                  }, (err) => {
                    console.log(err);
                    loading.dismiss();
                  })
                });
             }
            },
            (data) => {
              loading.dismiss();
            });
        });
    });
  }

  addMedication (id) {
    this.navCtrl.push('AddMedicationPage' ,{id: id});
  }

  newReminder (id) {
    this.navCtrl.push('NewReminderPage' ,{id: id});
  }
}
