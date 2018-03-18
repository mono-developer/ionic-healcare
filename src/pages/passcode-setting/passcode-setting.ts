import { Component } from '@angular/core';
import { NavController, ViewController, LoadingController, NavParams, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { IonPasscodeOptions } from '../../components/ion-passcode';
@IonicPage()
@Component({
  templateUrl: 'passcode-setting.html'
})
export class PasscodeSettingPage {
  passcodeOptions: IonPasscodeOptions;

  public passValue:string;
  public isLoading: boolean = false;
  pageValue:any;
  title:string;
  old_passcode:string;
  checkValue:boolean =  false;


  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public params: NavParams,
    public loadingCtrl: LoadingController,
    public storage: Storage,
  ) {
    this.storage.get('passcode').then(val=>{
      this.passValue = val;
    })
    this.pageValue = params.get("val");
    console.log(this.pageValue);
}

  ngOnInit() {

    this.storage.get('passcode').then(val=>{
      this.passValue = val;

      if(this.pageValue == 'set' && this.passValue){
        console.log("removePasscode");
        this.removePasscode('Turn Off Passcode');
      }else if(this.pageValue == 'change' && this.passValue){
        console.log("changePasscode");
        this.changePasscode('Change Passcode');
      }else if(this.pageValue == 'background' && this.passValue){
        console.log("check Passcode");
        this.checkPasscode();
      }else if(!this.passValue){
        console.log("SetPasscode");
        this.setPasscode('Enable Passcode');
      }else{
        console.log("Cancel");
      }
    });
  }

  setPasscode(title){
    this.title = title;
    this.checkValue = true;
    this.isLoading = true;
    let _t = this;
    this.passcodeOptions = {
      title:'<img class="logo" src="./assets/icon/main_logo.png"/><p>Enter your passcode</p>', deleteKeyType: 'icon', deleteKeyValue: 'backspace',
      onComplete: function(passcode: string) {

        return new Promise((resolve, reject) => {
          // the timeout is here to simulate the verifying process
          setTimeout(() => {
            resolve();
            console.log(passcode);
            // _t.storage.set('passcode', passcode);
            _t.ReEnterPasscode('Enable Passcode', passcode);
            // _t.dismiss(true);
          }, 1000);
        });
      }
    }
  }

  ReEnterPasscode(title, value){
    this.title = title;
    this.checkValue = true;
    this.old_passcode = value
    this.isLoading = true;
    let _t = this;
    this.passcodeOptions = {
      title:'<img class="logo" src="./assets/icon/main_logo.png"/><p>Re-enter your passcode</p>', deleteKeyType: 'icon', deleteKeyValue: 'backspace',
      onComplete: function(passcode: string) {

        let loader = _t.loadingCtrl.create();
        loader.present();

        return new Promise((resolve, reject) => {
          // the timeout is here to simulate the verifying process
          setTimeout(() => {
            loader.dismiss();
            if (passcode != _t.old_passcode) {
              reject();
            }
            else {
              resolve();
              _t.storage.set('passcode', passcode);
              // _t.setPasscode('Set Passcode');
              _t.dismiss(true);
            }
          }, 1000);
        });
      }
    }
  }

  removePasscode(title){
    this.title = title;
    this.checkValue = true;
    this.isLoading = true;
    let _t = this; // keeping a reference to `this`
    this.passcodeOptions = {
      title:'<img class="logo" src="./assets/icon/main_logo.png"/><p>Enter your passcode</p>', deleteKeyType: 'icon', deleteKeyValue: 'backspace',
      onComplete: function(passcode: string) {
        // (optional) show a message to your users while you are verifying the passcode
        let loader = _t.loadingCtrl.create();
        loader.present();

        return new Promise((resolve, reject) => {
          // the timeout is here to simulate the verifying process
          setTimeout(() => {
            loader.dismiss();
            if (passcode != _t.passValue) {
              reject();
            }
            else {
              resolve();
              _t.storage.set('passcode', null);
              _t.dismiss(false);
            }
          }, 1000);
        });
      }
    }
  }

changePasscode(title){
  this.title = title;
  this.checkValue = true;
  this.isLoading = true;
  let _t = this;
  this.passcodeOptions = {
    title:'<img class="logo" src="./assets/icon/main_logo.png"/><p>Enter your old passcode</p>', deleteKeyType: 'icon', deleteKeyValue: 'backspace',
    onComplete: function(passcode: string) {

      let loader = _t.loadingCtrl.create();
      loader.present();

      return new Promise((resolve, reject) => {
        // the timeout is here to simulate the verifying process
        setTimeout(() => {
          loader.dismiss();
          if (passcode != _t.passValue) {
            reject();
          }
          else {
            resolve();
            _t.storage.set('passcode', null);
            _t.setPasscode('Enable Passcode');
          }
        }, 1000);
      });
    }
  }
}

checkPasscode(){
  this.checkValue = false;
  this.isLoading = true;
  let _t = this;
  this.passcodeOptions = {
    title:'<img class="logo" src="./assets/icon/main_logo.png"/>', deleteKeyType: 'icon', deleteKeyValue: 'backspace',
    onComplete: function(passcode: string) {

      // let loader = _t.loadingCtrl.create({ content: 'Passcode: ' + passcode, dismissOnPageChange: true });
      // loader.present();
      let loader = _t.loadingCtrl.create();
      loader.present();

      return new Promise((resolve, reject) => {
        // the timeout is here to simulate the verifying process
        setTimeout(() => {
          loader.dismiss();
          if (passcode != _t.passValue) {
            reject();
          }
          else {
            resolve();
            _t.dismiss(false);
          }
        }, 1000);
      });
    }
  }
}

closemodal(){
  this.dismiss(false);
};

dismiss(flag) {
   this.viewCtrl.dismiss({flag: flag});
   }

}
