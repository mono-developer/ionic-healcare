import { Component, ViewChild } from '@angular/core';
import { NavController, ViewController, NavParams, AlertController, LoadingController, ToastController, IonicPage } from 'ionic-angular';
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
import { CompleteTestService } from '../../providers/CompleteTestService';
import { AutoCompleteComponent } from 'ionic2-auto-complete';

@IonicPage()
@Component({
  selector: 'page-vital-edit',
  templateUrl: 'vital-edit.html'
})
export class VitalEditPage {
  @ViewChild('searchbar')
  searchbar: AutoCompleteComponent;

  vitalForm: FormGroup;
  save: string;
  edit: string;
  vitalData: any = {};
  physicianData: any = [];
  profile_id: any;
  email: string;
  auth_token: string;
  note_template: string;
  selecting: any;
  file:any;
  constructor(
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public inAppBrowser: InAppBrowser,
    public userService: UserService,
    public storage: Storage,
    private flagService: Flags,
    public completeTestService: CompleteTestService
  ) {
    this.save = navParams.get("save");
    this.edit = navParams.get("edit");
    console.log(this.save);
    if (navParams.get("vitalData") != null) {
      this.vitalData = navParams.get("vitalData");
      this.vitalData.visible = !this.vitalData.is_private;
    } else {
      this.vitalData.is_private = 'true';
    }
    console.log(this.vitalData);
    this.profile_id = navParams.get("profile_id");
    this.storage.get('email').then(val => {
      this.email = val;
    });
    this.storage.get('auth_token').then(val => {
      this.auth_token = val;
    });
    this.selecting = {
      notes: false
    };
    this.physicianData = [];
    if (this.edit) {
      this.vitalForm = formBuilder.group({
        name: this.vitalData.name,
        // name: new FormControl('', [
        //   Validators.required
        // ]),
        physician: [''],
        note_template: [''],
        is_private: ['']
      });
    } else {
      this.vitalForm = formBuilder.group({
        name: ['', Validators.required],
        // name: new FormControl('', [
        //   Validators.required
        // ]),
        physician: [''],
        note_template: [''],
        is_private: ['']
      });
    }
  }

  ionViewDidEnter() {
    this.getPhysicianData();
  }

  getPhysicianData() {
    let loading = this.loadingCtrl.create();
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
            this.navCtrl.pop();
          } else{
            this.physicianData = data.physicians;
            let newPhysician = { name: "Add New Physician"};
            this.physicianData.push(newPhysician);
            if(this.save){
            this.vitalData = { name:'', physician: '', attach_file_urls:[], is_private: false, visible: true}
            }
          }
        }
      );
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
              this.vitalData.physician = '';
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
    console.log(body);
    loading.present();

    this.userService.dataCreate(this.email, this.auth_token, this.profile_id, endValue, body)
      .subscribe(
        (data) => {
          loading.dismiss();
          console.log("Physicians Data: ", data);
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
            this.vitalData.physician = value;
          }
      });

  }

  enterNote() {
    this.selecting.notes = !this.selecting.notes;
    this.note_template = this.vitalData.notes;
  }

  noteCancel() {
    this.selecting.notes = false;
  }

  noteSave() {
    if (!this.note_template) {
      this.note_template = '';
    }
    this.selecting.notes = false;
    this.vitalData.notes = this.note_template;
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
          that.vitalData.attach_file_urls.push(newAttach);
      });
  }

  deleteItem(i){
    this.vitalData.attach_file_urls.splice(i, 1);
    console.log('vital attach', this.vitalData.attach_file_urls);
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
            this.deleteVitalData();
          }
        }
      ]
    });
    alert.present();
  }

  deleteVitalData() {
    console.log('deleteVitalData');
    let loading = this.loadingCtrl.create({
      content: 'Deleting Condition'
    });
    let endValue = "/vital_medical_conditions/"+this.vitalData.id;
    loading.present();
    this.userService.dataDelete(this.email, this.auth_token, this.profile_id, endValue)
      .subscribe(
        (data) => {
          loading.dismiss();
          console.log("Vital Data: ", data);
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

  updateVitalData(){
    let loading = this.loadingCtrl.create({
      content: 'Updating Condition'
    });
    this.vitalData.name = this.searchbar.getValue();
    let endValue = "/vital_medical_conditions/" + this.vitalData.id;
    let newBody = _.cloneDeep(this.vitalData);
    newBody.is_private = (!this.vitalData.visible).toString();
    let body = { "id": this.vitalData.id, "vital_medical_condition": this.getBody(newBody) }
    console.log('body', body);
    loading.present();

    this.userService.dataUpdate(this.email, this.auth_token, this.profile_id, endValue, body)
      .subscribe(
        (data) => {
          loading.dismiss();
          console.log("Vital Data: ", data);
          if(data.success == false){
            let alert = this.alertCtrl.create({
              title: "Error", subTitle: "Updated Error", buttons: ['OK']
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

  createVitalData() {
    console.log("this.searchbar.getValue(): ", this.searchbar.getValue())
    this.vitalData.name = this.searchbar.getValue();
    let loading = this.loadingCtrl.create();
    var endValue = "/vital_medical_conditions";

    let newBody = _.cloneDeep(this.vitalData);
    newBody.is_private = (!this.vitalData.visible).toString();
    let body = this.getBody(newBody);
    loading.present();

    this.userService.dataCreate(this.email, this.auth_token, this.profile_id, endValue, body)
      .subscribe(
        (data) => {
          loading.dismiss();
          console.log("Vital Data: ", data);
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
