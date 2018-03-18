import { Component } from '@angular/core';
import { NavController, ViewController, NavParams,IonicPage } from 'ionic-angular';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RemindersService } from '../../../providers/reminders-service';
// @IonicPage()
@Component({
  selector: 'edit-reminder',
  templateUrl: 'edit-reminder.html'
})
export class EditReminderModal {
  public dailyReminderColumns: any;
  public weeklyReminderColumns: any;
  public frequencyColumns: any;
  public tablet: any;
  public schedule: number;
  public reminderData: any = {};

  constructor(
    public viewCtrl: ViewController,
    public remindersService: RemindersService,
    params: NavParams
  ) {
    this.reminderData = params.get('reminder');
    let stringToSpilt = this.reminderData.frequency;
    let x = stringToSpilt.split(" ");
    let times = +x[0];
    this.schedule = +x[2];
    console.log(this.reminderData, this.schedule);
    this.tablet = { name: "Advil", type: "pill", color1: "#ff0000", color2: "#00ff00" };

    let value = new Date();
    let datePipe = new DatePipe("en-US");
    let currentDateStr = datePipe.transform(value, 'yyyy-MM-dd');

    this.reminderData.refil_date = currentDateStr;
    this.reminderData.start_date = currentDateStr;

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
        { text: 'once', value: '1', parentVal: '1' },
        { text: 'twice', value: '2', parentVal: '1' },
        { text: '3 times', value: '3', parentVal: '1' },
        { text: '4 times', value: '4', parentVal: '1' },
        { text: '5 times', value: '5', parentVal: '1' },
        { text: '6 times', value: '6', parentVal: '1' },
        { text: 'once', value: '1', parentVal: '2' },
        { text: 'twice', value: '2', parentVal: '2' },
        { text: '3 times', value: '3', parentVal: '2' },
        { text: '4 times', value: '4', parentVal: '2' },
        { text: '5 times', value: '5', parentVal: '2' },
        { text: '6 times', value: '6', parentVal: '2' },
        { text: '7 times', value: '7', parentVal: '2' },
        { text: '8 times', value: '8', parentVal: '2' },
        { text: '9 times', value: '9', parentVal: '2' },
        { text: '10 times', value: '10', parentVal: '2' },
        { text: '11 times', value: '11', parentVal: '2' },
        { text: '12 times', value: '12', parentVal: '2' },
        { text: '13 times', value: '13', parentVal: '2' },
        { text: '14 times', value: '14', parentVal: '2' }
      ]
    },{
      name: 'schedule',
      options: [
        { text: 'Daily', value: '1' },
        { text: 'Weekly', value: '2' },
      ]
    }];
  }

  ionViewDidEnter() {
    // this.initReminders();
  }

  initReminders() {
    let stringToSpilt = this.reminderData.frequency;
    let x = stringToSpilt.split(" ");
    let times = +x[0];
    this.schedule = +x[1];

    console.log(this.schedule, times);
    this.reminderData.reminders = [];
    let weeknum = 1;
    switch(this.schedule)
    {
      case 1: // case of Daily
        console.warn('initate reminder columns for Daily schedule');
        for(let i = 1; i <= times; i++) {
            this.reminderData.reminders.push({value: i + " 1"});
        }
        break;
      case 2: // case of Weekly
        console.warn('initate reminder columns for Weekly schedule');
        for(let i = 1; i <= times; i++) {
          if(weeknum > 7)
            weeknum = 1;
          this.reminderData.reminders.push({value: weeknum + " 8 1"});
          weeknum++;
        }
        break;
      default:
        break;
    }
  }

  take() {
    if (this.reminderData.quantity) {
      this.reminderData.quantity--;
    }
  }

  remove() {
    console.log(this.reminderData.id);
    this.remindersService.delete(this.reminderData.id)
    .then((res) => {
      console.log(res);
      this.viewCtrl.dismiss();
    }, (err) => {
      console.log(err);
    });
  }

  onChangeTake(e) {
    this.reminderData.scheduled = !this.reminderData.scheduled;
  }

  onChangeSchedule(e) {
    this.reminderData.take_as_needed = !this.reminderData.take_as_needed;
  }

  onDoesChange(e) {

  }

  onFrequencyChange(e) {
    // this.initReminders();
  }

  onCancel() {
    this.viewCtrl.dismiss();
  }

  onSave() {
    console.log(this.reminderData);
    this.remindersService.update(this.reminderData)
    .then((res) => {
      console.log(res);
      this.viewCtrl.dismiss();
    }, (err) => {
      console.log(err);
    });
  }
}
