import { Component } from '@angular/core';
import { NavController, ViewController, ModalController, NavParams, IonicPage} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
// import { InAppPurchase2, IAPProductOptions } from '@ionic-native/in-app-purchase-2';

@IonicPage()
@Component({
  selector: 'page-explain-slide',
  templateUrl: 'explain-slide.html'
})
export class ExplainSlidePage {

  sliders: Array<{image:string, title:string, description:string }>;
  public profile_img:string;
  public name:string;
  public options:any;
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    private iab: InAppBrowser,
    // private store: InAppPurchase2
  ) {

    this.options  = {
    location : 'no',//Or 'no'
    hidden : 'no', //Or  'yes'
    clearcache : 'yes',
    clearsessioncache : 'yes',
    zoom : 'yes',//Android only ,shows browser zoom controls
    hardwareback : 'yes',
    mediaPlaybackRequiresUserAction : 'no',
    shouldPauseOnSuspend : 'no', //Android only
    closebuttoncaption : 'Close', //iOS only
    disallowoverscroll : 'no', //iOS only
    toolbar : 'yes', //iOS only
    enableViewportScale : 'no', //iOS only
    allowInlineMediaPlayback : 'no',//iOS only
    presentationstyle : 'pagesheet',//iOS only
    fullscreen : 'yes',//Windows only
    };
    this.sliders = [{ image: 'image1', title:'Pill Reminders', description:'Receive pill reminders to make sure you stay on top of your health.' },
                    { image: 'image2', title:'Document Storage', description: 'Attach important documents to your profile for quick access any time, anywhere.'},
                    { image: 'image3', title:'Sharing', description: 'Share your health imformant with your Doctor or caregiver safely and securely.'},
                    { image: 'image4', title:'Quick notify emergency Contacts', description: 'Display a red button on your profile to automatically send a text & email to your emergency contacts.'},
                  ];
  let personData =  navParams.get("personData");
  console.log('profile_img',personData);
  this.profile_img = personData.image_url.thumb;
  this.name = personData.first_name + ' ' + personData.last_name;

  }

  // monthlyStore(){
  //   console.log('monthlyStore');
  //   this.store.register({
  //     id: "com.myid.reminder.monthly499",
  //     alias: 'Monthly Subscription',
  //     type: this.store.PAID_SUBSCRIPTION
  //  });
  //  let proplan: IAPProductOptions = {id:'com.myid.reminder.monthly499', alias:'Monthly Subscription', type:this.store.PAID_SUBSCRIPTION};
  //
  //  let orderOne = this.store.order('com.myid.reminder.monthly499');
  //
  //  this.store.when('com.myid.reminder.monthly499').approved(function() {
  //
  //     this.productSuccess();
  //   });
  // }

  // yearlyStore(){
  //   console.log('monthlyYear');
  //   this.store.register({
  //     id: "com.myid.reminder.year4999",
  //     alias: 'Year Subscription',
  //     type: this.store.PAID_SUBSCRIPTION
  //   });
  //   let proplan: IAPProductOptions = {id:'com.myid.reminder.year4999', alias:'Year Subscription', type:this.store.PAID_SUBSCRIPTION};
  //
  //   let orderOne = this.store.order('com.myid.reminder.year4999');
  //
  //   this.store.when('com.myid.reminder.year4999').approved(function() {
  //
  //     this.productSuccess();
  //   });
  // }

  productSuccess(){
    console.log('go ProductSuccess Page');
    let profileModal = this.modalCtrl.create('ProductSuccessPage', { page: 'document'});
    profileModal.present();
  }

  termsPage(){
    const browser = this.iab.create('https://getmyid.com/terms','_blank', this.options);
  }

  privacyPage(){
    const browser = this.iab.create('https://getmyid.com/privacy','_blank', this.options);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
