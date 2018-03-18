import { Component } from '@angular/core';
import { NavController,IonicPage } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html'
})
export class SchedulePage {

  items: Array<{ date:string, value: string }>;
  constructor(public navCtrl: NavController) {
    this.items = [ {date:'Today', value: '5'},
                    {date:'Augest 4, 2017', value: '1'},
                    {date:'Augest 5, 2017', value: '2'},
                    {date:'Augest 6, 2017', value: '5'},
                    {date:'Augest 7, 2017', value: '3'},
                    {date:'Augest 8, 2017', value: '4'},
                    {date:'Augest 9, 2017', value: '5'},
                    {date:'Augest 10, 2017', value: '6'}
                  ];
  }

  dismiss(){
    this.navCtrl.pop();
  }
}
