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

@IonicPage()
@Component({
  selector: 'page-medical-edit',
  templateUrl: 'medical-edit.html'
})
export class MedicalEditPage {
  id:any;
  save:string;
  edit:string;
  medicalData:any = { type:'Other', region:'Head', date_of_procedure:'2001-01-01', is_private: false};
  type:any;
  region:any;
  note_template:string;
  selecting: any;
  email:string;
  auth_token:string;
  profile_id:string;
  other:string;
  file:any;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private inAppBrowser: InAppBrowser,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public userService: UserService,
    public storage: Storage,
    private flagService: Flags
  ) {
      this.save = navParams.get("save");
      this.edit = navParams.get("edit");

      if (navParams.get("id") != null){
        this.id = navParams.get("id");
        console.log(this.id);
      }else{
        this.medicalData = { type: '', region: '', is_private: false, visible: true};
      }
      this.profile_id = navParams.get("profile_id");
      this.storage.get('email').then(val=>{
        this.email = val;
      });
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
      });
      this.region = ['Head', 'Neck', 'Back', 'Chest', 'Abdoman', 'Heart', 'Pelvis', 'Right Arm', 'Left Arm', 'Right Leg', 'Left Leg'];
      this.type = ['Xray' , 'DEXA', 'CT', 'MRI', 'Ultrasound', 'Cardiac Nuclear Study', 'Other'];
      this.selecting = {
        others: false
      };

  }

  ionViewDidEnter(){
    if(this.edit){
      this.getMedicalData();
    }

  }

  ngOnInit(){
    this.defineType(this.medicalData.type);
  }

  defineType (value){
    let type = value.split(' ');
    if(type[0] == 'Other'){
      this.medicalData.type = 'Other';
      this.other = type[1];
    }else{
      this.medicalData.type = value;
    }
  }

  getMedicalData(){
    var endValue = "/medical_imagings/" + this.id
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
            this.medicalData = data.medical_imaging;
            this.medicalData.visible = !this.medicalData.is_private;
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
      var files = event.target.files;
      var file = files[0];
      this.file = file;
      this.medicalData.file_name = this.file.name;
      console.log("this.file:" + JSON.stringify(this.medicalData.file_name));
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
          that.medicalData.attach_file_report_url = data.Location;
          console.log(that.medicalData.file_name, that.medicalData.attach_file_report_url);
      });
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
            this.deleteMedicalData();
            }
          }
        ]
      });
      alert.present();
  }

  deleteMedicalData(){
    console.log('deleteMedicalData');
    let loading = this.loadingCtrl.create();
    let endValue = "/medical_imagings/"+this.medicalData.id;
    loading.present();

    this.userService.dataDelete(this.email, this.auth_token, this.profile_id, endValue)
      .subscribe(
        (data) => {
          loading.dismiss();
          console.log("Medical Data: ", data);
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

  updateMedicalData(){
    let loading = this.loadingCtrl.create();
    var endValue = "/medical_imagings/"+this.medicalData.id;
    let newBody = _.cloneDeep(this.medicalData);
    newBody.is_private = (!this.medicalData.visible).toString();
    if(newBody.type == 'Other'){
      newBody.type = newBody.type + ' ' + this.other;
    }
    let body = { "id": this.id, "medical_imaging": this.getBody(newBody) }
    loading.present();

    loading.present();

    this.userService.dataUpdate(this.email, this.auth_token, this.profile_id, endValue, body)
      .subscribe(
        (data) => {
          loading.dismiss();
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
            console.log(data);
          }
      });
  }

  createMedicalData(){

    let loading = this.loadingCtrl.create();
    var endValue = "/medical_imagings";

    let newBody = _.cloneDeep(this.medicalData);
    newBody.is_private = (!this.medicalData.visible).toString();
    if(newBody.type == 'Other'){
      newBody.type = newBody.type + ' ' + this.other;
    }
    let body = this.getBody(newBody);
    loading.present();
    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
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
      });
    });
  }

  dismiss() {
   this.viewCtrl.dismiss();
 }

}
