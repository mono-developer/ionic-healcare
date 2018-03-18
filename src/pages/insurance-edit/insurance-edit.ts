
import { Component, ViewChild } from '@angular/core';
import { NavController, ViewController, NavParams, AlertController,  LoadingController, ToastController,IonicPage } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser";

import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";

import * as AWS from "aws-sdk/global";
import S3 from "aws-sdk/clients/s3";

import * as _ from 'lodash';
import { fail } from 'assert';

import { AutoCompleteComponent } from 'ionic2-auto-complete';
import { CompleteTestService } from '../../providers/CompleteTestService';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-insurance-edit',
  templateUrl: 'insurance-edit.html'
})
export class InsuranceEditPage {
  @ViewChild('searchbar') searchbar: AutoCompleteComponent;
  insuranceForm: FormGroup;
  save: string;
  edit: string;
  insuranceData: any;
  state: any;
  profile_id: any;
  email: string;
  auth_token: string;
  note_template: string;
  selecting: any;
  file: any;
  constructor(
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private inAppBrowser: InAppBrowser,
    public userService: UserService,
    public storage: Storage,
    private flagService: Flags,
    public completeTestService: CompleteTestService

  ) {
    this.save = navParams.get("save");
    this.edit = navParams.get("edit");
    console.log(this.save);
    if (navParams.get("insuranceData") != null) {
      this.insuranceData = navParams.get("insuranceData");
      this.insuranceData.visible = !this.insuranceData.is_private;
    }else{
      this.insuranceData = { insurance_provider:'', id_number:'', bin_number:'', deductible: '', customer_service_phone_number:'', notes:'', attach_file_urls:[], is_private: false, visible: true };
    }
    console.log(this.insuranceData);
    this.profile_id = navParams.get("profile_id");
    this.storage.get('email').then(val=>{
      this.email = val;
    });
    this.storage.get('auth_token').then(val=>{
      this.auth_token = val;
    });

    this.selecting = {
      notes: false
    };

  if( this.edit){
    this.insuranceForm = formBuilder.group({
      insurance_provider: [this.insuranceData.insurance_provider],
      id: [''],
      group: [''],
      bin: [''],
      // name: new FormControl('', [
      //   Validators.required
      // ]),
      deductible: [''],
      customer_service_phone_number: [''],
      note_template: [''],
      is_private: ['']
    });
  }else{
      this.insuranceForm = formBuilder.group({
        insurance_provider: ['', Validators.required],
        id: [''],
        group: [''],
        bin: [''],
        // name: new FormControl('', [
        //   Validators.required
        // ]),
        deductible: [''],
        customer_service_phone_number: [''],
        note_template: [''],
        is_private: ['']
      });
    }
  }

  enterNote() {
    this.selecting.notes = !this.selecting.notes;
    this.note_template = this.insuranceData.notes;
  }

  noteCancel() {
    this.selecting.notes = false;
  }

  noteSave() {
    if (!this.note_template) {
      this.note_template = '';
    }
    this.selecting.notes = false;
    this.insuranceData.notes = this.note_template;
  }

  onClickItem(url) {
    const options: InAppBrowserOptions = {
      zoom: 'no',
      location:'no',
      closebuttoncaption:'< Back',
      toolbarposition: 'bottom',
      toolbar:'yes'
    }
      const browser = this.inAppBrowser.create(url, '_blank', options);
  }

  fileEvent(event){
      console.log( 'attach', this.insuranceData.attach_file_urls);
      var files = event.target.files;
      var file = files[0];
      this.file = file;
      let file_name = this.file.name;
      console.log("this.file:" + JSON.stringify(this.insuranceData.file_name));
      AWS.config.accessKeyId = 'AKIAIPQAVOWPUIP2ENSA';
      AWS.config.secretAccessKey = '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';
      var s3 = new S3({
            region: 'us-west-2',
            apiVersion: '2006-03-01',
            params: {Bucket: 'myidband-images'}
        });

      var params = {Bucket: 'myidband-images', Key: 'production/tmp_files/'+ this.file.name, Body: this.file, ContentType: this.file.type, ACL: 'public-read'};
      let that = this;
      let loading = this.loadingCtrl.create();
      loading.present();
      s3.upload(params, function (err, data) {
          loading.dismiss();
          let file_url = data.Location;
          // console.log(that.vitalData.file_name, that.vitalData.attach_file_urls);
          let newAttach = { "file_name":  file_name, "file_url": file_url};
          console.log('newAttach', newAttach);
          that.insuranceData.attach_file_urls.push(newAttach);
          console.log(that.insuranceData.attach_file_urls);
      });
  }

  deleteItem(i){
    this.insuranceData.attach_file_urls.splice(i, 1);
  }

  deleteAlert() {

    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      subTitle: 'Do you really want to delete this item?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            console.log('Buy clicked');
            this.deleteInsuranceData();
          }
        }
      ]
    });
    alert.present();
  }

  deleteInsuranceData() {
    let loading = this.loadingCtrl.create();
    var endValue = "/insurance_informations/" + this.insuranceData.id;
    loading.present();
    this.userService.dataDelete(this.email, this.auth_token, this.profile_id, endValue)
      .subscribe(
        (data) => {
          loading.dismiss();
          console.log("insuranceinfoData: ", data);
          if(data.success == false){
            let alert = this.alertCtrl.create({
              title: "Error", subTitle: "Delete Error", buttons: ['OK']
            });
            alert.present();
          } else{
            let toast = this.toastCtrl.create({
              message: 'Record Deleted', duration: 2000, position: 'bottom',
            });
            toast.present();
            this.viewCtrl.dismiss({data:'success'});
          }
      });
  }

  getBody(value){
    let body = _.pickBy(value,  (item)=>{
      if(_.isArray(item)){
        if(item.length) {
          return true;
        }
        return false;
      } else {
        if(_.identity(item)) {
          return true;
        }
        return false;
      }
    });
    return body;
  }

  updateInsuranceData() {
    let loading = this.loadingCtrl.create({
      content: 'Updating Insurance'
    });
    this.insuranceData.insurance_provider = this.searchbar.getValue();
    let endValue = "/insurance_informations/"+this.insuranceData.id;
    let newBody = _.cloneDeep(this.insuranceData);
    newBody.is_private = (!this.insuranceData.visible).toString();
    let body = { "id": this.insuranceData.id, "insurance_information": this.getBody(newBody) }
    loading.present();
    this.userService.dataUpdate(this.email, this.auth_token, this.profile_id, endValue, body)
      .subscribe(
        (data) => {
          loading.dismiss();
          console.log("Insurance Data: ", data);
          if(data.success == false){
            let alert = this.alertCtrl.create({
              title: "Error", subTitle: "Updated Error", buttons: ['OK']
            });
            alert.present();
          } else{
            this.flagService.setChangedFlag(true);
            let toast = this.toastCtrl.create({
              message: 'Updated Successfully', duration: 2000, position: 'bottom'
            });
            toast.present();
            this.navCtrl.pop();
            console.log(data);
          }
      });
  }

  createInsuranceData() {

    let loading = this.loadingCtrl.create({
      content: 'Creating Insurance'
    });
    this.insuranceData.insurance_provider = this.searchbar.getValue();
    var endValue = "/insurance_informations";let newBody = _.cloneDeep(this.insuranceData);
    newBody.is_private = (!this.insuranceData.visible).toString();
    let body = this.getBody(newBody);
    loading.present();

    this.userService.dataCreate(this.email, this.auth_token, this.profile_id, endValue, body)
      .subscribe(
        (data) => {
          loading.dismiss();
          console.log("Insurance Data: ", data);
          if(data.success == false){
            let alert = this.alertCtrl.create({
              title: "Error", subTitle: "Create Error", buttons: ['OK']
            });
            alert.present();
          } else{
            let toast = this.toastCtrl.create({
              message: 'Created Successfully', duration: 2000, position: 'bottom'
            });
            toast.present();
            this.viewCtrl.dismiss({data:'success'});
          }
      });
    }

  dismiss() {
    this.viewCtrl.dismiss();
  }


}
