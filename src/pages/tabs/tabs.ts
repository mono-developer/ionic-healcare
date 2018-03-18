import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = 'HomePage';
  tab2Root = 'ProfilePage';
  tab3Root = 'RemindersPage';
  tab4Root = 'InboxPage';
  tab5Root = 'MorePage';

  constructor() {

  }
}
