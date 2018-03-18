import { Component} from '@angular/core';
import { Nav, Platform, ModalController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';

// import { PasscodeSettingPage } from '../pages/passcode-setting/passcode-setting';

import { Storage } from '@ionic/storage';

// import { ExplainSlidePage } from '../pages/explain-slide/explain-slide';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { TouchID } from '@ionic-native/touch-id';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any = 'MainPage';
  passValue:any;

  constructor(
    platform: Platform,
    public modalCtrl: ModalController,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public storage: Storage,
    private sqlite: SQLite,
    private touchId: TouchID,
    private keyboard: Keyboard
  ) {

    platform.ready().then(() => {


      statusBar.styleDefault();
      setTimeout(() => {
       splashScreen.hide();
     }, 1000)
      // splashScreen.hide();
      this.keyboard.hideKeyboardAccessoryBar(false);

      this.touchId.isAvailable()
        .then(
          res => {
            console.log('TouchID is available!');
            console.log(res);
          },
          err => {
            console.error('TouchID is not available', err)
            console.log(err)
          }
        );

      let profileModal = this.modalCtrl.create('PasscodeSettingPage', {
        val: 'background'
      });
      storage.get('passcode').then(val=>{
        if(val == null){
          console.log("go on");
        } else {
          console.log("run passcode page")
          profileModal.present();
        }
      });

      platform.resume.subscribe(() => {
        storage.get('passcode').then(val=>{
          if(val == null){
            console.log("go on");
          } else {
            console.log("run passcode page")
            profileModal.present();
          }
        });
      });

      // var notificationOpenedCallback = function(jsonData) {
      //  console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      // };
      //
      // window["plugins"].OneSignal
      //  .startInit("e2038888-0f55-4dca-872b-c7ec8d7858eb", "")
      //  .handleNotificationOpened(notificationOpenedCallback)
      //  .endInit();

      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
        db.executeSql("CREATE TABLE IF NOT EXISTS reminders (id INTEGER PRIMARY KEY AUTOINCREMENT, color1_Id INTEGER, color2_Id INTEGER, form_Id INTEGER, dependent_id INTEGER, dose INTEGER, frequency TEXT, name TEXT, note TEXT, reminders TEXT, quantity INTEGER, take_as_needed INTEGER, scheduled INTEGER)", {})
        .then(() => console.log('reminder table was created!'))
        .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
    });
  }
}
