import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage';
import { MultiPickerModule } from 'ion-multi-picker';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import { Crop } from '@ionic-native/crop';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { TouchID } from '@ionic-native/touch-id';
import { IonAlphaScrollModule } from '../components/ionic2-alpha-scroll';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { Geolocation } from '@ionic-native/geolocation';
import { MyApp } from './app.component';
import { SwiperModule } from 'angular2-useful-swiper';
import { AutoCompleteModule } from 'ionic2-auto-complete';
// Services
import { Flags } from "../providers/flag";
import { UserService } from '../providers/user-service';
import { CountryService } from '../providers/country-service';
import { BaseMedicineService } from '../providers/base-medicine-service';
import { BaseService } from "../providers/base-service";
import { DependentService } from '../providers/dependent-service';
import { RemindersService } from '../providers/reminders-service';
import { LocalNotificationService } from '../providers/local-notification-service';
import { CompleteTestService } from '../providers/CompleteTestService';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    SwiperModule,
    IonAlphaScrollModule,
    IonicModule.forRoot(MyApp, {
      preloadModules: true,
      backButtonText: 'Back',
      iconMode: 'ios',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
      tabsPlacement: 'bottom',
      pageTransition: 'ios-transition'
    }),
    IonicStorageModule.forRoot(),
    MultiPickerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    LocalNotifications,
    SQLite,
    BarcodeScanner,
    Camera,
    ActionSheet,
    Crop,
    FileTransfer,
    TouchID,
    InAppBrowser,
    UserService,
    BaseMedicineService,
    BaseService,
    CountryService,
    Flags,
    DependentService,
    RemindersService,
    LocalNotificationService,
    Geolocation,
    CompleteTestService,
    NativeGeocoder,
    File,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
