import { Component } from '@angular/core';
import { NavController, ModalController, IonicPage } from 'ionic-angular';
@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-more',
  templateUrl: 'more.html'
})
export class MorePage {

  constructor(
  public navCtrl: NavController,
  public modalCtrl: ModalController) {
  }


  goAddDependentPage(){
    console.log('go AddDependent Page');
    let profileModal = this.modalCtrl.create('AddDependentPage');
    profileModal.present();
  }

  goManageSharingPage(){
    console.log('go ManageSharing Page');
    this.navCtrl.push('ManageSharingPage');
  }

  goLinkNewPage(){
    console.log('go LinkNew Page');
    let profileModal = this.modalCtrl.create('LinkNewPage');
    profileModal.present();
  }


  goSettingsPage(){
    console.log('go SettingsPage');
    this.navCtrl.push('SettingsPage');
  }

}
