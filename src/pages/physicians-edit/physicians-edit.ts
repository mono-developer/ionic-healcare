
import { Component, ViewChild } from '@angular/core';
import { NavController, ViewController, NavParams, AlertController, LoadingController, ToastController, IonicPage } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser";

import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { CountryService } from "../../providers/country-service";
import { Flags } from "../../providers/flag";


import * as AWS from "aws-sdk/global";
import S3 from "aws-sdk/clients/s3";

import * as _ from 'lodash';
import { fail } from 'assert';


import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutoCompleteComponent } from 'ionic2-auto-complete';
import { CompleteTestService } from '../../providers/CompleteTestService';

@IonicPage()
@Component({
  selector: 'page-physicians-edit',
  templateUrl: 'physicians-edit.html'
})
export class PhysiciansEditPage {

  @ViewChild('searchbar')
  searchbar: AutoCompleteComponent;
  physicianForm: FormGroup;
  save: string;
  edit: string;
  physicianData:any = {};
  state: any;
  profile_id: any;
  email: string;
  auth_token: string;
  countries: any;
  file: any;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private inAppBrowser: InAppBrowser,
    public toastCtrl: ToastController,
    public userService: UserService,
    public storage: Storage,
    private flagService: Flags,
    private countryService: CountryService,
    public formBuilder: FormBuilder,
    public completeTestService: CompleteTestService
  ) {
    this.save = navParams.get("save");
    this.edit = navParams.get("edit");

    if (navParams.get("physicianData") != null) {
      this.physicianData = navParams.get("physicianData");
      this.physicianData.visible = !this.physicianData.is_private;
    } else {
      this.physicianData.is_private = false;
      this.physicianData.visible = !this.physicianData.is_private;
    }

    this.profile_id = navParams.get("profile_id");
    this.storage.get('email').then(val => {
      this.email = val;
    });
    this.storage.get('auth_token').then(val => {
      this.auth_token = val;
    });

    this.countries = this.countryService.getCountries();
    if (this.edit) {
      this.physicianForm = formBuilder.group({
        name: [this.physicianData.name, Validators.required],
        business_name: [''],
        title: [this.physicianData.title],
        address: [''],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: [''],
        phone_number: [''],
        zip_code: [''],
        is_private: ['']
      });
    } else {
      this.physicianForm = formBuilder.group({
        name: ['', Validators.required],
        business_name: [''],
        title: [''],
        address: [''],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: [''],
        phone_number: [''],
        zip_code: [''],
        is_private: ['']
      })
    }
  }


  onClickItem(url) {
    const options: InAppBrowserOptions = {
      zoom: 'no',
      location: 'no',
      closebuttoncaption: '< Back',
      toolbarposition: 'bottom',
      toolbar: 'yes'
    }
    const browser = this.inAppBrowser.create(url, '_blank', options);
  }


  fileEvent(event) {
    console.log('attach', this.physicianData.attach_file_urls);
    var files = event.target.files;
    var file = files[0];
    this.file = file;
    let file_name = this.file.name;
    console.log("this.file:" + JSON.stringify(this.physicianData.file_name));
    AWS.config.accessKeyId = 'AKIAIPQAVOWPUIP2ENSA';
    AWS.config.secretAccessKey = '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';
    var s3 = new S3({
      region: 'us-west-2',
      apiVersion: '2006-03-01',
      params: { Bucket: 'myidband-images' }
    });

    var params = { Bucket: 'myidband-images', Key: 'production/tmp_files/' + this.file.name, Body: this.file, ContentType: this.file.type, ACL: 'public-read' };
    let that = this;
    let loading = this.loadingCtrl.create();
    loading.present();
    s3.upload(params, function (err, data) {
      loading.dismiss();
      let file_url = data.Location;
      let newAttach = { "file_name": file_name, "file_url": file_url };
      that.physicianData.attach_file_urls.push(newAttach);
    });
  }

  deleteItem(i) {
    this.physicianData.attach_file_urls.splice(i, 1);
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
            this.deletePhysiciansData();
          }
        }
      ]
    });
    alert.present();
  }

  deletePhysiciansData() {
    let loading = this.loadingCtrl.create({
      content: 'Deleting Physician'
    });
    let endValue = "/physicians/" + this.physicianData.id;
    loading.present();
    this.userService.dataDelete(this.email, this.auth_token, this.profile_id, endValue)
      .subscribe(
      (data) => {
        loading.dismiss();
        console.log("PhysiciansData: ", data);
        if (data.success == false) {
          let alert = this.alertCtrl.create({
            title: "Error", subTitle: "Delete Error", buttons: ['OK']
          });
          alert.present();
        } else {
          this.flagService.setChangedFlag(true);
          let toast = this.toastCtrl.create({
            message: 'Record Deleted', duration: 2000, position: 'bottom',
          });
          toast.present();
          console.log(data);
          this.navCtrl.pop();
        }
      });
  }

  getBody(value) {
    let body = _.pickBy(value, (item) => {
      if (_.isArray(item)) {
        if (item.length) {
          return true;
        }
        return false;
      } else {
        if (_.identity(item)) {
          return true;
        }
        return false;
      }
    });
    return body;
  }

  updatePhysiciansData() {
    let loading = this.loadingCtrl.create({
      content: 'Updating Physician'
    });
    let endValue = "/physicians/" + this.physicianData.id;
    let newBody = _.cloneDeep(this.physicianData);

    newBody.is_private = (!this.physicianData.visible).toString();
    let body = { "id": this.physicianData.id, "physician": this.getBody(newBody) }
    loading.present();

    this.userService.dataUpdate(this.email, this.auth_token, this.profile_id, endValue, body)
      .subscribe(
      (data) => {
        loading.dismiss();
        console.log("Vital Data: ", data);
        if (data.success == false) {
          let alert = this.alertCtrl.create({
            title: "Error", subTitle: "Updated Error", buttons: ['OK']
          });
          alert.present();
        } else {
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

  createPhysiciansData() {
    let loading = this.loadingCtrl.create({
      content: 'Creating Physician'
    });
    var endValue = "/physicians";
    console.log(this.physicianData);
    let newBody = _.cloneDeep(this.physicianData);
    console.log(newBody)
    newBody.is_private = (!this.physicianData.visible).toString();
    let body = this.getBody(newBody);
    loading.present();
    this.userService.dataCreate(this.email, this.auth_token, this.profile_id, endValue, body)
      .subscribe(
      (data) => {
        loading.dismiss();
        console.log("Physicians Data: ", data);
        if (data.success == false) {
          let alert = this.alertCtrl.create({
            title: "Error", subTitle: "Create Error", buttons: ['OK']
          });
          alert.present();
        } else {
          let toast = this.toastCtrl.create({
            message: 'Created Successfully', duration: 2000, position: 'bottom'
          });
          toast.present();
          this.viewCtrl.dismiss({ data: 'success' });
        }
      });

  }


  dismiss() {
    this.viewCtrl.dismiss();
  }

}
