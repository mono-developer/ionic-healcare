
import { Component, ViewChild } from '@angular/core';
import { NavController, ViewController, NavParams, AlertController,  LoadingController, ToastController, IonicPage } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";

import * as AWS from "aws-sdk/global";
import S3 from "aws-sdk/clients/s3";

import * as _ from 'lodash';
import { fail } from 'assert';

@IonicPage()
@Component({
  selector: 'page-pregnancy-edit',
  templateUrl: 'pregnancy-edit.html'
})
export class PregnancyEditPage {
  id:string;
  physicianForm: FormGroup;
  save:string;
  edit:string;
  pregnancyData:any = { due_date: '', physician: '', attach_file_urls: [], is_private: false, visible: true };
  physicianData:any = [];
  profile_id:any;
  email:string;
  auth_token:string;
  note_template:string;
  selecting: any;
  file: any;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private inAppBrowser: InAppBrowser,
    public userService: UserService,
    public storage: Storage,
    public toastCtrl: ToastController,
    private flagService: Flags,
    public formBuilder: FormBuilder


  ) {
    this.save = navParams.get("save");
    this.edit = navParams.get("edit");
    if(this.edit){
      this.id = navParams.get("id");
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
    this.physicianData = [];

    this.physicianForm = formBuilder.group({
      due_date: ['', Validators.required],
      delivery_date: [''],
      physician: [''],
      physician_phone: [''],
      hospital: ['', Validators.required],
      hospital_phone: [''],
      note_template: [''],
      // zip: ['']
    });
  }
  ionViewDidEnter(){
    this.getPhysicianData();
  }

  getPhysicianData(){
    let loading = this.loadingCtrl.create({
      content: 'Loading Physician',
      showBackdrop: false
    });
    var endValue = "/physicians"
    loading.present();

    this.userService.dataGet(this.email, this.auth_token, this.profile_id, endValue)
      .subscribe(
        (data) => {
          loading.dismiss();
          if(data.success == false){
            let alert = this.alertCtrl.create({
              title: "Error", subTitle: "Get Data Error", buttons: ['OK']
            });
            alert.present();
          } else{
            this.physicianData = data.physicians;
            let newPhysician = { name: "Add New Physician"};
            this.physicianData.push(newPhysician);
            if(this.edit){
              this.getPregancyData();
            }
          }
      });

    }

  getPregancyData(){
    var endValue = "/pregnancies/" + this.id
    this.userService.dataGet(this.email, this.auth_token, this.profile_id, endValue)
      .subscribe(
        (data) => {
          if(data.success == false){
            let alert = this.alertCtrl.create({
              title: "Error", subTitle: "Get Data Error", buttons: ['OK']
            });
            alert.present();
            this.navCtrl.pop();
          } else{
            this.pregnancyData = data.pregnancy;
            this.pregnancyData.visible = !this.pregnancyData.is_private;
          }
      });
  }

  onSelectChange(value: any){
    console.log('Selected', value);
    if(value == "Add New Physician"){
      let alert = this.alertCtrl.create({
        title: 'Add New Physician',
        inputs: [
          {
            name: 'name',
            placeholder: '–'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Add',
            handler: data => {
              this.pregnancyData.physician = '';
              this.createPhysicianData(data.name);
            }
          }
        ]
      });
      alert.present();
    }
  }

  createPhysicianData(value){
    let loading = this.loadingCtrl.create({
      content: 'Creating Physician'
    });
    var endValue = "/physicians";
    var body = { "physician":{
      "name": value, "is_private":'false'}
    }
    loading.present();

    this.userService.dataCreate(this.email, this.auth_token, this.profile_id, endValue, body)
      .subscribe(
        (data) => {
          loading.dismiss();
          if(data.success == false){
            let toast = this.toastCtrl.create({
              message: 'Created Error', duration: 2000, position: 'center'
            });
            toast.present();
          } else{
            let toast = this.toastCtrl.create({
              message: 'Created Successfully', duration: 2000, position: 'center'
            });
            toast.present();
            this.physicianData.push(data.physician);
            this.pregnancyData.physician = value;
          }
      });

  }

  enterNote () {
    this.selecting.notes = !this.selecting.notes;
    this.note_template = this.pregnancyData.notes;
  }

  noteCancel () {
    this.selecting.notes = false;
  }

  noteSave () {
    if (!this.note_template) {
      this.note_template = '';
    }
    this.selecting.notes = false;
    this.pregnancyData.notes = this.note_template;
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
      var files = event.target.files;
      var file = files[0];
      this.file = file;
      let file_name = this.file.name;
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
          that.pregnancyData.attach_file_urls.push(newAttach);
      });
  }

  deleteItem(i){
    this.pregnancyData.attach_file_urls.splice(i, 1);
  }

  deleteAlert(){

    let confirm = this.alertCtrl.create({
      title: 'Delete Pregnancy',
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
          text: 'Delete',
          handler: () => {
            console.log('Delete Clicked');
            this.deletePregnancyData();
            }
          }
        ]
      });
      confirm.present();
  }

  deletePregnancyData(){
    console.log('deleteVitalData');
    let loading = this.loadingCtrl.create({
      content: 'Deleting Pregnancy'
    });    let endValue = "/pregnancies/" + this.id;
    loading.present();
    this.userService.dataDelete(this.email, this.auth_token, this.profile_id, endValue)
      .subscribe(
        (data) => {
          loading.dismiss();
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

  updatePregnancyData(){
    let loading = this.loadingCtrl.create({
      content: 'Updating Pregnancy'
    });
    var endValue = "/pregnancies/" + this.id;
    let newBody = _.cloneDeep(this.pregnancyData);
    newBody.is_private = (!this.pregnancyData.visible).toString();
    let body = { "id": this.id, "pregnancy": this.getBody(newBody) }
    loading.present();
    this.userService.dataUpdate(this.email, this.auth_token, this.profile_id, endValue, body)
      .subscribe(
        (data) => {
          loading.dismiss();
          if(data.success == false){
            let alert = this.alertCtrl.create({
              title: "Error", subTitle: "Unable to update record", buttons: ['OK']
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

  createPregnancyData(){
    let loading = this.loadingCtrl.create({
      content: 'Creating New Pregnancy'
    });
    var endValue = "/pregnancies";
    let newBody = _.cloneDeep(this.pregnancyData);
    newBody.is_private = (!this.pregnancyData.visible).toString();
    let body = this.getBody(newBody);
    loading.present();
    this.userService.dataCreate(this.email, this.auth_token, this.profile_id, endValue, body)
      .subscribe(
        (data) => {
          loading.dismiss();
          if(data.success == false){
            let alert = this.alertCtrl.create({
              title: "Error", subTitle: "Unable to create record", buttons: ['OK']
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
