import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Storage } from '@ionic/storage';
import { UserService } from "./user-service";

@Injectable()
export class LocalNotificationService {
  notifications: any[] = [];
  constructor(
    public localNotifications: LocalNotifications,
    public storage: Storage,
    public userService: UserService,
  ) {

  }

  addNotification(data) {
    let profile: any;
    let notifications = [];
    let addnotifications = () => {
      console.log("data=>", data);
      console.log(profile.profile.person.first_name, profile.profile.person.last_name);
      if (data.take_as_needed) {
        let id = (data.dependent_id * 1000 + data.id) * 200;
        let template = {
          id: id,
          title: 'Pill Reminder time',
          text: 'Reminder for ' + profile.profile.person.first_name + ' ' + profile.profile.person.last_name + ' to take ' + data.name + ' as needed now',
          every: "day",
          firstAt: new Date(new Date().getTime() + 100),
        };
        this.localNotifications.schedule(template);

      } else if (data.scheduled) {
        let stringToSpilt = data.frequency;
        let x = stringToSpilt.split(" ");
        let times = +x[0];
        let schedule = +x[2];

        if (schedule == 1) {
          for(let i = 0; i < data.reminders.length; i++) {
            console.log(i, data.reminders[i]);
            let id = (data.dependent_id * 1000 + data.id) * 100 + i;
            let t = data.reminders[i].value.split(" ");
            let dateTmp = new Date();
            dateTmp.setHours(+t[0] + 12 * (+t[2] - 1));
            dateTmp.setMinutes(+t[1]);
            console.log(t);
            console.log(dateTmp);
            let template = {
              id: id,
              title: 'Pill Reminder time',
              text: 'Reminder for ' + profile.profile.person.first_name + ' ' + profile.profile.person.last_name + ' to take ' + data.name + ' now',
              every: "day",
              at: dateTmp,
            };
            notifications.push(template);
          }
        } else if (schedule == 2) {
          for(let i = 0; i < data.reminders.length; i++) {
            console.log(i, data.reminders[i]);
            let id = (data.dependent_id * 1000 + data.id) * 100 + i;
            let t = data.reminders[i].value.split(" ");
            let dateTmp = new Date();
            let currentDay = dateTmp.getDay();
            let dayDifference = t[0] - currentDay;
            if(dayDifference < 0){
                dayDifference = dayDifference + 7; // for cases where the day is in the following week
            }
            dateTmp.setDate(dateTmp.getDate() + dayDifference);
            dateTmp.setHours(+t[1] + 12 * (+t[3] - 1));
            dateTmp.setMinutes(+t[2]);
            let template = {
              id: id,
              title: 'Pill Reminder time',
              text: 'Reminder for ' + profile.profile.person.first_name + ' ' + profile.profile.person.last_name + ' to take ' + data.name + ' now',
              every: "week",
              at: dateTmp,
            };
            notifications.push(template);
          }
        }
        this.localNotifications.schedule(notifications);
      }
    }

    this.storage.get('email').then(val=>{
      let email = val;
      this.storage.get('auth_token').then(val=>{
        let auth_token = val;
        console.log('dependent_id', data.dependent_id);
        this.userService.getPersonalProfiles(auth_token, email, data.dependent_id)
          .subscribe(
            (res) => {
              if(data.success == false){

              } else{
                profile = res;
                console.log("profile=>", profile);
                addnotifications();
              }
            },
            (error) => {
              console.log('internet Fails');
            });
        });
    });

  }

  cancelAll(){
    this.localNotifications.cancelAll();
  }
}
