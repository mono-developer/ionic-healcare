import { Component } from '@angular/core';
import { NavController, ModalController, App, IonicPage } from 'ionic-angular';
// import { TouchID } from '@ionic-native/touch-id';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  public touch:boolean;
  public passValue:string;
  public passTrue: boolean;
  settings: Array<{id:number, name:string, page:any, icon:string }>;
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    // private touchId: TouchID,
    public storage: Storage,
    private app: App
  ) {
    this.touch = true;
    this.settings = [{ id: 0, name: 'Change Password', page: 'ChangePasswordPage' , icon:'ios-key-outline' },
                  { id: 1, name: 'Update Email Address', page: 'UpdateEamilPage', icon: 'ios-at-outline'},
                  { id: 2, name: 'Notifications', page: 'NotificationsPage', icon:'ios-notifications-outline' },
                  { id: 3, name: 'Group Code', page: 'GroupCodePage', icon:'ios-grid-outline' },
                  ];
    this.storage.get('passcode').then(val=>{
       this.passValue = val;
     });
    this.passTrue = false;
  }

  ionViewDidEnter(){
    this.storage.get('passcode').then(val=>{
      this.passValue = val;
      if(this.passValue ){
        this.passTrue = true;
      } else{
        this.passTrue = false;
      }
      console.log('passValue',this.passValue);
    });

  }

  onCategoryClick(event, page) {
    console.log(page);
    this.navCtrl.push(page);
  }

  touchChange(){

      console.log('true');
      this.goPasscodePage();

  }

  goPasscodePage(){

    console.log(this.passValue);

   this.storage.get('passcode').then(val=>{
     console.log("ResumeSubscription");
     let profileModal = this.modalCtrl.create('PasscodeSettingPage', {
       val: 'background'
     });
     this.storage.get('passcode').then(val=>{
       if(val == null){
         console.log("go Passcode");
         this.navCtrl.push('PasscodePage');
       } else {
         console.log("run passcode page")
         profileModal.present();
         this.navCtrl.push('PasscodePage');
       }
     });
   })
 }

  logOut(){
      this.storage.set('data', null);
      this.storage.set('email', "");
      this.storage.set('auth_token', "");
      this.app.getRootNav().setRoot('MainPage');
      // this.navCtrl.setRoot(MainPage);
    }
}
