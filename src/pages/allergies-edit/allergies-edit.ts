
import { Component, ViewChild } from '@angular/core';
import { NavController, ViewController, NavParams, AlertController,  LoadingController, ToastController, IonicPage } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser";

import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";

import * as AWS from "aws-sdk/global";
import S3 from "aws-sdk/clients/s3";
import * as _ from 'lodash';
import { fail } from 'assert';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AutoCompleteComponent } from 'ionic2-auto-complete';
import { CompleteTestService } from '../../providers/CompleteTestService';


@IonicPage()
@Component({
  selector: 'page-allergies-edit',
  templateUrl: 'allergies-edit.html'
})
export class AllergiesEditPage {
  @ViewChild('searchbar')
  searchbar: AutoCompleteComponent;
  allergiesForm: FormGroup;
  save: string;
  edit: string;
  allergiesData: any = {};
  state: any;
  profile_id: any;
  email: string;
  auth_token: string;
  note_template: string;
  selecting: any;
  file:any;
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private inAppBrowser: InAppBrowser,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public userService: UserService,
    public storage: Storage,
    private flagService: Flags,
    public formBuilder: FormBuilder,
    public completeTestService: CompleteTestService
  ) {
    this.save = navParams.get("save");
    this.edit = navParams.get("edit");
    console.log(this.save);
    if (navParams.get("allergiesData") != null){
        this.allergiesData = navParams.get("allergiesData");
        this.allergiesData.visible = !this.allergiesData.is_private;
    }else{
      this.allergiesData.is_private = false;
      this.allergiesData.visible = true;
      this.allergiesData.attach_file_urls = [];
    }
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

    if (this.edit) {
      this.allergiesForm = formBuilder.group({
        name: [this.allergiesData.name],
        is_private: [''],
        note_template: [''],
      });
    } else {
      this.allergiesForm = formBuilder.group({
        name: ['', Validators.required],
        is_private: [''],
        note_template: [''],
      });
    }
  }

  enterNote() {
    this.selecting.notes = !this.selecting.note;
    this.note_template = this.allergiesData.notes;
  }

  noteCancel() {
    this.selecting.notes = false;
  }

  noteSave() {
    if (!this.note_template) {
      this.note_template = '';
    }
    this.selecting.notes = false;
    this.allergiesData.notes = this.note_template;
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
    console.log( 'attach', this.allergiesData.attach_file_urls);
    var files = event.target.files;
    var file = files[0];
    this.file = file;
    let file_name = this.file.name;
    console.log("this.file:" + JSON.stringify(this.allergiesData.file_name));
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
        let newAttach = { "file_name":  file_name, "file_url": file_url};
        that.allergiesData.attach_file_urls.push(newAttach);
    });
  }

   deleteItem(i){
    this.allergiesData.attach_file_urls.splice(i, 1);
    console.log('newVitalAttach', this.allergiesData.attach_file_urls);
  }

  deleteAlert(){

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
            this.deleteAllergiesData();
          }
        }
      ]
    });
    alert.present();
  }

  deleteAllergiesData(){
    let loading = this.loadingCtrl.create({
      content: 'Deleting Allergy'
    });
    var endValue = "/allergies/"+this.allergiesData.id;
    loading.present();

    this.userService.dataDelete(this.email, this.auth_token, this.profile_id, endValue)
      .subscribe(
        (data) => {
          loading.dismiss();
          console.log("allergiesData: ", data);
          if(data.success == false){
            let alert = this.alertCtrl.create({
              title: "Error", subTitle: "Unable to delete record", buttons: ['OK']
            });
            alert.present();
          } else{
            this.flagService.setChangedFlag(true);
            let toast = this.toastCtrl.create({
              message: 'Record Deleted', duration: 2000, position: 'bottom',
            });
            toast.present();
            this.navCtrl.pop();
            console.log(data);
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

  updateAllergiesData() {

    let loading = this.loadingCtrl.create({
      content: 'Updating Allergy'
    });
    this.allergiesData.name = this.searchbar.getValue();
    console.log(this.allergiesData.name);
    let endValue = "/allergies/"+this.allergiesData.id;
    let newBody = _.cloneDeep(this.allergiesData);
    newBody.is_private = (!this.allergiesData.visible).toString();
    let body = { "id": this.allergiesData.id, "allergy": this.getBody(newBody) }
    console.log(body);
    loading.present();

    this.userService.dataUpdate(this.email, this.auth_token, this.profile_id, endValue, body)
      .subscribe(
        (data) => {
          loading.dismiss();
          console.log("Vital Data: ", data);
          if(data.success == false){
            let alert = this.alertCtrl.create({
              title: "Error", subTitle: "Update error", buttons: ['OK']
            });
            alert.present();
          } else{
            this.flagService.setChangedFlag(true);
            let toast = this.toastCtrl.create({
              message: 'Updated Successfully', duration: 2000, position: 'bottom'
            });
            toast.present();
            this.navCtrl.pop();
          }
      });
  }

  createAllergiesData(){
    let loading = this.loadingCtrl.create({
      content: 'Creating Allergy'
    });
    let endValue = "/allergies";
    this.allergiesData.name = this.searchbar.getValue();
    let newBody = _.cloneDeep(this.allergiesData);
    newBody.is_private = (!this.allergiesData.visible).toString();
    let body = this.getBody(newBody);
    loading.present();
    this.userService.dataCreate(this.email, this.auth_token, this.profile_id, endValue, body)
      .subscribe(
        (data) => {
          loading.dismiss();
          console.log("Allergy Data: ", data);
          if(data.success == false){
            let alert = this.alertCtrl.create({
              title: "Error", subTitle: "Create Error", buttons: ['OK']
            });
            alert.present();
          } else{
            let toast = this.toastCtrl.create({ message: 'Created Successfully', duration: 2000, position: 'bottom' });
            toast.present();
            this.viewCtrl.dismiss({data:'success'});
          }
      });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
