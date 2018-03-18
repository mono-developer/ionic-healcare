import { Component } from '@angular/core';
import { NavController, ModalController, IonicPage } from 'ionic-angular';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-inbox',
  templateUrl: 'inbox.html'
})
export class InboxPage {

  items: Array<{date:string, title:string, description:string, show: boolean, value:string}>;
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
  ) {

    this.items = [
                    {date:'Yesterday', title:'Sliding items can be swiped to the left or right to reveal a hidden set of buttons',
                    description:'Below is an example with three lines of text.', show: false, value: 'bb'}
              ];
  }

  doRefresh(refresher) {
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  goInboxDetailsPage(event, items){
    console.log('go AddCategory Page');
    // this.navCtrl.push(InboxDetailsPage, { data: items.value});
    this.navCtrl.push('InboxDetailsPage');
  }

}
