import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, AlertController, ToastController, LoadingController, IonicPage } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser";
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";


import * as AWS from "aws-sdk/global";
import S3 from "aws-sdk/clients/s3";

import * as _ from 'lodash';
import { fail } from 'assert';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-labs-edit',
  templateUrl: 'labs-edit.html'
})
export class LabsEditPage {
  id: string;
  labsForm: FormGroup;
  save:string;
  edit:string;
  labsData:any = {  lab_date: '',  is_private:false, visible: true, attach_file_urls:[]};
  type:any;
  email:any;
  auth_token:any;
  profile_id:any;

  note_template:string;
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
    private flagService: Flags
  ) {
    this.save = navParams.get("save");
    this.edit = navParams.get("edit");
    this.profile_id = navParams.get("profile_id");
    if(this.edit){
      this.id = navParams.get("id");
    }

    this.storage.get('email').then(val=>{
      this.email = val;
    });

    this.storage.get('auth_token').then(val=>{
      this.auth_token = val;
    });
    // this.type = [
    //   { name:'CBC',value: 0},
    //   { name:'BMP', value: 1},
    //   { name:'CMP', value: 2},
    //   { name:'Other', value: 3}
    // ];
    this.selecting = {
      result: false
    };
    this.labsForm = formBuilder.group({
      name: ['', Validators.required],
      lab_date: ['', Validators.required],
      note_template: ['', Validators.required],
      is_private:['']
    });
  }

  ionViewDidEnter(){
    if(this.edit){
      this.getLabData();
    }
  }

  getLabData(){
    let loading = this.loadingCtrl.create();
    var endValue = "/labs/" + this.id;
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
            this.navCtrl.pop();
          } else{
            this.labsData = data.lab;
            this.labsData.visible = !this.labsData.is_private;
            this.note_template = this.labsData.result;
          }
        });
    }

  enterNote () {
    this.selecting.result = !this.selecting.result;
    this.note_template = this.labsData.result;
  }

  noteCancel () {
    this.selecting.result = false;
  }

  noteSave () {
    if (!this.note_template) {
      this.note_template = '';
    }
    this.selecting.result = false;
    this.labsData.result = this.note_template;
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
          that.labsData.attach_file_urls.push(newAttach);
      });
  }

  deleteItem(i){
    this.labsData.attach_file_urls.splice(i, 1);
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
            this.deleteLabsData();
            }
          }
        ]
      });
      alert.present();
  }

  deleteLabsData(){
    console.log('deleteLabsData');
    let loading = this.loadingCtrl.create();
    let endValue = "/labs/" + this.id;
    loading.present();

    this.userService.dataDelete(this.email, this.auth_token, this.profile_id, endValue)
      .subscribe(
        (data) => {
          loading.dismiss();
          if(data.success == false){
            let alert = this.alertCtrl.create({
              title: "Error", subTitle: "Delete Error", buttons: ['OK']
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

  updateLabsData(){
    let loading = this.loadingCtrl.create();
    let endValue = "/labs/" + this.id;
    let newBody = _.cloneDeep(this.labsData);
    newBody.is_private = (!this.labsData.visible).toString();
    let body = { "id": this.id, "lab": this.getBody(newBody) }
    loading.present();
    this.userService.dataUpdate(this.email, this.auth_token, this.profile_id, endValue, body)
      .subscribe(
        (data) => {
          loading.dismiss();
          if(data.success == false){
            let alert = this.alertCtrl.create({
              title: "Error", subTitle: "Update Error", buttons: ['OK']
            });
            alert.present();
          } else{
            this.flagService.setChangedFlag(true);
            let toast = this.toastCtrl.create({
              message: 'Updated Successfully', duration: 2000, position: 'bottom',
            });
            toast.present();
            this.navCtrl.pop();
          }
      });
  }

  createLabsData(){
    let loading = this.loadingCtrl.create();
    let endValue = "/labs";
    let newBody = _.cloneDeep(this.labsData);
    newBody.is_private = (!this.labsData.visible).toString();
    let body = this.getBody(newBody);
    loading.present();
    this.userService.dataCreate(this.email, this.auth_token, this.profile_id, endValue, body)
      .subscribe(
        (data) => {
          loading.dismiss();
          if(data.success == false){
            let alert = this.alertCtrl.create({
              title: "Error", subTitle: "Create Error", buttons: ['OK']
            });
            alert.present();
          } else{
            let toast = this.toastCtrl.create({
              message: 'Created Successfuly', duration: 2000,  position: 'bottom',
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
