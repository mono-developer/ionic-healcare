import { Component} from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, AlertController, IonicPage } from 'ionic-angular';
import { RemindersService } from '../../providers/reminders-service';
import { BaseMedicineService } from "../../providers/base-medicine-service";
@IonicPage()
@Component({
  selector: 'new-reminder',
  templateUrl: 'new-reminder.html'
})
export class NewReminderPage {
  public frequencyColumns: any;
  public dailyReminderColumns: any;
  public weeklyReminderColumns: any;
  public tablet_image: string;
  public loading: any;
  public loaded: boolean = false;
  public schedule: number;

  public reminderData: any = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public remindersService: RemindersService,
    public baseMedicineService: BaseMedicineService,
    public alertController: AlertController
  ) {
      this.tablet_image = "assets/icon/clock.png";
      this.reminderData.id = this.navParams.get("id");
      this.reminderData.take_as_needed = true;

      this.loading = this.loadingCtrl.create();
      this.dailyReminderColumns = [
        {
          name: 'time',
          options: [
            { text: '01:', value: '1'},
            { text: '02:', value: '2'},
            { text: '03:', value: '3'},
            { text: '04:', value: '4'},
            { text: '05:', value: '5'},
            { text: '06:', value: '6'},
            { text: '07:', value: '7'},
            { text: '08:', value: '8'},
            { text: '09:', value: '9'},
            { text: '10:', value: '10'},
            { text: '11:', value: '11'},
            { text: '12:', value: '12'}
          ]
        }, {
          name: 'minute',
          options: [
            { text: '00', value: '0'},
            { text: '05', value: '5'},
            { text: '10', value: '10'},
            { text: '15', value: '15'},
            { text: '20', value: '20'},
            { text: '25', value: '25'},
            { text: '30', value: '30'},
            { text: '35', value: '35'},
            { text: '40', value: '40'},
            { text: '45', value: '45'},
            { text: '50', value: '50'},
            { text: '55', value: '55'}
          ]
        }, {
          name: 'ap',
          options: [
            { text: 'AM', value: '1'},
            { text: 'PM', value: '2'}
          ]
        }
      ];
      this.weeklyReminderColumns = [
        {
          name: 'day',
          options: [
            { text: 'Sun', value: '1'},
            { text: 'Mon', value: '2'},
            { text: 'Tue', value: '3'},
            { text: 'Wed', value: '4'},
            { text: 'Thu', value: '5'},
            { text: 'Fri', value: '6'},
            { text: 'Sat', value: '7'}
          ]
        }, {
          name: 'time',
          options: [
            { text: '01:', value: '1'},
            { text: '02:', value: '2'},
            { text: '03:', value: '3'},
            { text: '04:', value: '4'},
            { text: '05:', value: '5'},
            { text: '06:', value: '6'},
            { text: '07:', value: '7'},
            { text: '08:', value: '8'},
            { text: '09:', value: '9'},
            { text: '10:', value: '10'},
            { text: '11:', value: '11'},
            { text: '12:', value: '12'}
          ]
        }, {
          name: 'minute',
          options: [
            { text: '00', value: '0'},
            { text: '05', value: '5'},
            { text: '10', value: '10'},
            { text: '15', value: '15'},
            { text: '20', value: '20'},
            { text: '25', value: '25'},
            { text: '30', value: '30'},
            { text: '35', value: '35'},
            { text: '40', value: '40'},
            { text: '45', value: '45'},
            { text: '50', value: '50'},
            { text: '55', value: '55'}
          ]
        }, {
          name: 'ap',
          options: [
            { text: 'AM', value: '1'},
            { text: 'PM', value: '2'}
          ]
        }
      ];
      this.frequencyColumns = [
      {
        name: 'times',
        parentCol: 'schedule',
        options: [
          { text: '1', value: '1', parentVal: '1' },
          { text: '2', value: '2', parentVal: '1' },
          { text: '3', value: '3', parentVal: '1' },
          { text: '4', value: '4', parentVal: '1' },
          { text: '5', value: '5', parentVal: '1' },
          { text: '6', value: '6', parentVal: '1' },
          { text: '1', value: '1', parentVal: '2' },
          { text: '2', value: '2', parentVal: '2' },
          { text: '3', value: '3', parentVal: '2' },
          { text: '4', value: '4', parentVal: '2' },
          { text: '5', value: '5', parentVal: '2' },
          { text: '6', value: '6', parentVal: '2' },
          { text: '7', value: '7', parentVal: '2' },
          { text: '8', value: '8', parentVal: '2' },
          { text: '9', value: '9', parentVal: '2' },
          { text: '10', value: '10', parentVal: '2' },
          { text: '11', value: '11', parentVal: '2' },
          { text: '12', value: '12', parentVal: '2' },
          { text: '13', value: '13', parentVal: '2' },
          { text: '14', value: '14', parentVal: '2' }
        ]
      },{
        name: 'schedule',
        options: [
          { text: 'Daily', value: '1' },
          { text: 'Weekly', value: '2' },
        ]
      }];
  }

  ionViewWillEnter() {
    this.viewCtrl.showBackButton(false);

    this.loading.present();
    this.remindersService.get(this.reminderData.id)
    .then((res) => {
      this.reminderData = res;
      console.log(this.reminderData);
      this.initReminders();

      let stringToSpilt = this.reminderData.frequency;
      let x = stringToSpilt.split(" ");
      let times = +x[0];
      this.schedule = +x[2];

      this.baseMedicineService.getForm(this.reminderData.form_Id)
      .then((res) => {
        this.reminderData.form = res;
      }, (err) => {
        console.log(err);
        this.loading.dismiss();
      });

      this.baseMedicineService.getColor(this.reminderData.color1_Id)
      .then((res) => {
        this.reminderData.color1 = res;
      }, (err) => {
        console.log(err);
        this.loading.dismiss();
      });

      this.baseMedicineService.getColor(this.reminderData.color2_Id)
      .then((res) => {
        this.reminderData.color2 = res;
      }, (err) => {
        console.log(err);
        this.loading.dismiss();
      });
      this.loaded = true;
      this.loading.dismiss();
    }, (err) => {
      this.loading.dismiss();
      console.log(err);
    });
  }

  initReminders() {
    let stringToSpilt = this.reminderData.frequency;
    let x = stringToSpilt.split(" ");
    let times = +x[0];
    this.schedule = +x[2];
    console.log(this.reminderData.reminders.length);
    if (!this.reminderData.reminders.length) {
      this.reminderData.reminders = [];
      let weeknum = 1;
      switch(this.schedule)
      {
        case 1: // case of Daily
          console.warn('initate reminder columns for Daily schedule');
          for(let i = 1; i <= times; i++) {
              this.reminderData.reminders.push({value: i + " 0 1"});
          }
          break;
        case 2: // case of Weekly
          console.warn('initate reminder columns for Weekly schedule');
          for(let i = 1; i <= times; i++) {
            if(weeknum > 7)
              weeknum = 1;
            this.reminderData.reminders.push({value: weeknum + " 8 0 1"});
            weeknum++;
          }
          break;
        default:
          break;
      }
    }
  }

  onChangeFrequency(e) {
    this.initReminders();
  }

  onChangeTake(e) {
    this.reminderData.scheduled = !this.reminderData.take_as_needed;
  }

  onChangeSchedule(e) {
    this.reminderData.take_as_needed = !this.reminderData.scheduled;
  }

  checkValidate() {
    let retVal = true;
    if(!this.reminderData.quantity) {
      return false;
    }
    return retVal;
  }

  onCancel () {
    this.navCtrl.pop();
  }

  onSave () {
    if(this.checkValidate()) {
      this.remindersService.update(this.reminderData)
      .then((res) => {
        console.log(res);
        this.navCtrl.pop();
      }, (err) => {
        console.log(err);
      });
    } else {
      let alert = this.alertController.create({
        title: 'Warning',
        subTitle: 'Please fill in the fields required in red.',
        buttons: ['OK']
      });
      alert.present();
    }
  }
}
