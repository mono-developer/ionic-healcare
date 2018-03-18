import { Component } from '@angular/core';
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

import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-surgeries-edit',
  templateUrl: 'surgeries-edit.html'
})
export class SurgeriesEditPage {

  id: string;
  surgeriesForm: FormGroup;
  save:string;
  edit:string;
  surgeriesData:any = { name:'', surgeon_name:'', operation_date:'', status:'', attach_file_urls: [], is_private: false, visible: true};
  physicianData:any = [];
  status:any;
  type:any;
  profile_id:any;
  email:string;
  auth_token:string;
  file:any;

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
    if (navParams.get("id") != null){
        this.id = navParams.get("id");
      }
    this.storage.get('email').then(val=>{
      this.email = val;
    });

    this.storage.get('auth_token').then(val=>{
      this.auth_token = val;
    });

    this.profile_id = navParams.get("profile_id");

    this.status = [
      { name:'Resolved',value_string: 'true'},
      { name:'Ongoing', value_string: 'false'}
    ];
    this.type = [
      { name:'Torn ACL',value: 0},
      { name:'Appendectomy', value: 1},
      { name:'Other', value: 2}
    ];
    this.physicianData = [];
    this.surgeriesForm = formBuilder.group({
      name: ['', Validators.required],
      surgeon_name: ['', Validators.required],
      surgeon_phone: ['', Validators.required],
      operation_date: [''],
      status: ['', Validators.required],
      is_private:['']
    });
  }
  ionViewDidEnter(){
    this.getPhysicianData();
  }

  getSurgeyData(){
    var endValue = "/surgeries/" + this.id
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
            this.surgeriesData = data.surgery;
            this.surgeriesData.visible = !this.surgeriesData.is_private;
          }
      });
    }

  getPhysicianData(){
    let loading = this.loadingCtrl.create({
      content: 'Loading Physician'
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
            this.navCtrl.pop();
          } else{
            this.physicianData = data.physicians;
            let newPhysician = { name: "Add New Physician"};
            this.physicianData.push(newPhysician);
            if(this.edit){
              this.getSurgeyData();
            }
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
              this.surgeriesData.surgeon_name = '';
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
            let alert = this.alertCtrl.create({
              title: "Error", subTitle: "Create Error", buttons: ['OK']
            });
            alert.present();
          } else{
            let toast = this.toastCtrl.create({
              message: 'Created Successfully', duration: 2000, position: 'bottom'
            });
            toast.present();
            this.physicianData.push(data.physician);
            this.surgeriesData.physician = value;
          }
      });
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
      console.log( 'attach', this.surgeriesData.attach_file_urls);
      var files = event.target.files;
      var file = files[0];
      this.file = file;
      let file_name = this.file.name;
      console.log("this.file:" + JSON.stringify(this.surgeriesData.file_name));
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
          that.surgeriesData.attach_file_urls.push(newAttach);
          console.log(that.surgeriesData.attach_file_urls);
      });
  }

  deleteItem(i){
    this.surgeriesData.attach_file_urls.splice(i, 1);
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
            this.deleteSurgeriesData();
            }
          }
        ]
      });
      alert.present();
  }

  deleteSurgeriesData(){
    let loading = this.loadingCtrl.create({
      content: 'Deleting Surgery'
    });
    let endValue = "/surgeries/" + this.id;
    loading.present();
    this.userService.dataDelete(this.email, this.auth_token, this.profile_id, endValue)
      .subscribe(
        (data) => {
          loading.dismiss();
          console.log("Surgery Data: ", data);
          if(data.success == false){
            let alert = this.alertCtrl.create({
              title: "Error", subTitle: "Delete Error", buttons: ['OK']
            });
            alert.present();
          } else{
            this.flagService.setChangedFlag(true);
            let toast = this.toastCtrl.create({
              message: 'Record Deleted', duration: 2000, position: 'bottom'
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

  updateSurgeriesData(){
    let loading = this.loadingCtrl.create({
      content: 'Updating Surgery'
    });
    var endValue = "/surgeries/" + this.id;
    let newBody = _.cloneDeep(this.surgeriesData);
    newBody.is_private = (!this.surgeriesData.visible).toString();
    let body = { "id": this.id, "surgery": this.getBody(newBody) }
    loading.present();
    this.userService.dataUpdate(this.email, this.auth_token, this.profile_id, endValue, body)
      .subscribe(
        (data) => {
          loading.dismiss();
          console.log("Surgery Data: ", data);
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

  createSurgeriesData(){
    let loading = this.loadingCtrl.create({
      content: 'Creating New Surgery'
    });
    let endValue = "/surgeries";
    let newBody = _.cloneDeep(this.surgeriesData);
    newBody.is_private = (!this.surgeriesData.visible).toString();
    let body = this.getBody(newBody);
    loading.present();
    this.userService.dataCreate(this.email, this.auth_token, this.profile_id, endValue, body)
      .subscribe(
        (data) => {
          loading.dismiss();
          console.log("Surgeries Data: ", data);
          if(data.success == false){
            let alert = this.alertCtrl.create({
              title: "Error", subTitle: "Create Error", buttons: ['OK']
            });
            alert.present();
          } else{
            this.flagService.setChangedFlag(true);
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
