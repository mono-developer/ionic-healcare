import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, AlertController, LoadingController, ToastController, IonicPage } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser";
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";
import { log } from 'util';

import * as AWS from "aws-sdk/global";
import S3 from "aws-sdk/clients/s3";

import * as _ from 'lodash';
import { fail } from 'assert';

@IonicPage()
@Component({
  selector: 'page-family-history-edit',
  templateUrl: 'family-history-edit.html'
})
export class FamilyHistoryEditPage {

  id: string;
  save:string;
  edit:string;
  familyHistoryData:any = { name: '', relationship: '' ,birthdate:'', deceased:'', deceased_year: '', notes:'', attach_file_urls: [], is_private: false, visible: true };
  fhConName:string;
  deceased:any;
  relationships:any;
  profile_id:any;
  email:string;
  auth_token:string;
  note_template:string;

  selecting: any;
  fhConditionData:any;
  addInputBox:boolean;
  other:string;
  file:any;

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

  ) {

    this.save = navParams.get("save");
    this.edit = navParams.get("edit");
    this.addInputBox = false;
    this.profile_id = navParams.get("profile_id");
    if (this.edit) {
      this.id = navParams.get("id");
    }
    this.storage.get('email').then(val=>{
      this.email = val;
    });
    this.storage.get('auth_token').then(val=>{
      this.auth_token = val;
    });

    this.fhConName = '';
    this.other = '';
    this.deceased = [
      { name: 'Deceased', value_string: true },
      { name: 'Living', value_string: false }];
    this.relationships = [
      { name: 'Brother', value: 0 },
      { name: 'Sister', value: 1 },
      { name: 'Mother', value: 2 },
      { name: 'Father', value: 3 },
      { name: 'Aunt', value: 4 },
      { name: 'Uncle', value: 5 },
      { name: 'Grandfather', value: 6 },
      { name: 'Grandmother', value: 7 },
      { name: 'Other', value: 8 }
    ]
    this.selecting = {
      notes: false
    };

  }

    ngOnInit(){
      let relationship = this.familyHistoryData.relationship.split(' ');
      if(relationship[0] == 'Other'){
        this.familyHistoryData.relationship = 'Other';
        this.other = relationship[1];
      }
    }

    isReadonly() {
      return this.isReadonly;   //return true/false
    }

    enterNote() {
      this.selecting.notes = !this.selecting.notes;
      this.note_template = this.familyHistoryData.notes;
    }

    noteCancel() {
      this.selecting.notes = false;
    }

    noteSave() {
      if (!this.note_template) {
        this.note_template = '';
      }
      this.selecting.notes = false;
      this.familyHistoryData.notes = this.note_template;
    }

    addInput(){
      this.addInputBox = true;
    }

    ionViewDidEnter(){
      if(this.edit){
        this.getFamHisData();
      }
    }

    getFamHisData(){
      let loading = this.loadingCtrl.create();
      var endValue = "/family_histories/" + this.id;
      loading.present();

      this.userService.dataGet(this.email, this.auth_token, this.profile_id, endValue)
        .subscribe(
          (data) => {
            loading.dismiss();
            console.log("Family Data: ", data);
            if(data.success == false){
              let alert = this.alertCtrl.create({
                title: "Error", subTitle: "Get Data Error", buttons: ['OK']
              });
              alert.present();
              this.navCtrl.pop();
            } else{
              this.familyHistoryData = data.family_history;
              this.familyHistoryData.visible = !this.familyHistoryData.is_private;
              this.getFHConditionData();
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
            that.familyHistoryData.attach_file_urls.push(newAttach);
        });
    }

    deleteItem(i){
      this.familyHistoryData.attach_file_urls.splice(i, 1);
    }

    deleteCondition(value){
      let loading = this.loadingCtrl.create();
      let endValue = "/family_history_conditions/" + value;

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
              this.deleteFamilyHistoryData();
            }
          }
        ]
      });
      alert.present();
  }

    getFHConditionData(){
      let loading = this.loadingCtrl.create();
      var endValue = "/family_history_conditions";
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
              let conditions = data.family_history_conditions;
              this.fhConditionData = conditions.filter(res => res.family_history_id === this.id);
            }
          });
      }

    updateCondition(item){
      let alert = this.alertCtrl.create({
        title: 'Update Medical Condition',
        inputs: [
          {
            name: 'condition',
            placeholder: item.name
          }
        ],
        buttons: [
          { text: 'Cancel',
            role: 'cancel',
            handler: data => {
              this.getFHConditionData();
            }
          },
          { text: 'Update',
            handler: data => {
              this.updateFHConData(item, data.condition);
            }
          }
        ]
      });
      alert.present();
    }

    updateFHConData(item, condition){
      let body = { "family_history_condition": {
          family_history_id: item.family_history_id, name: condition
        }
      }
      let endValue = "/family_history_conditions/" + item.id;
      this.storage.get('auth_token').then(val => {
        this.auth_token = val;
        this.userService.dataUpdate(this.email, this.auth_token, this.profile_id, endValue, body)
          .subscribe(
            (data) => {
              if(data.success == false){
                let alert = this.alertCtrl.create({
                  title: "Error", subTitle: "Update Family History Condition Error", buttons: ['OK']
                });
                alert.present();
              } else{
                this.fhConName = '';
                this.addInputBox = false;
                this.getFHConditionData();
              }
            });
        });
    }

    saveFHConData(id){

      let body = { "family_history_condition": {
          family_history_id: id , name: this.fhConName
        }
      }
      let endValue = "/family_history_conditions";
      this.userService.dataCreate(this.email, this.auth_token, this.profile_id, endValue, body)
        .subscribe(
          (data) => {
            if(data.success == false){
              let alert = this.alertCtrl.create({
                title: "Error", subTitle: "Create Family History Condition Error", buttons: ['OK']
              });
              alert.present();
            } else{
              this.fhConName = '';
              this.addInputBox = false;
              this.getFHConditionData();
            }
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
          },{
            text: 'Ok',
            handler: () => {
              this.deleteFamilyHistoryData();
              }
            }
          ]
        });
        alert.present();
    }

    deleteFamilyHistoryData(){
      let loading = this.loadingCtrl.create();
      let endValue = "/family_histories/"+this.id;
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
              this.navCtrl.pop();
            } else{
              this.flagService.setChangedFlag(true);
              let toast = this.toastCtrl.create({
                message: 'Record Deleted', duration: 2000, position: 'bottom'
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

    updateFamilyHistoryData(){

      let loading = this.loadingCtrl.create();
      let endValue = "/family_histories/" + this.id;
      let newBody = _.cloneDeep(this.familyHistoryData);
      newBody.is_private = (!this.familyHistoryData.visible).toString();
      if(newBody.deceased)
        newBody.deceased = newBody.deceased.toString();
      if(newBody.relationship == 'Other'){
      newBody.relationship = this.familyHistoryData.relationship + ' ' + this.other;
      }
      let body = {"id": this.id, "family_history": this.getBody(newBody) };

      loading.present();

      this.userService.dataUpdate(this.email, this.auth_token, this.profile_id, endValue, body)
        .subscribe(
          (data) => {
            loading.dismiss();
            if(data.success == false){
              let alert = this.alertCtrl.create({
                title: "Error", subTitle: "Create Error", buttons: ['OK']
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



    createFamilyHistoryData(){
      let loading = this.loadingCtrl.create();
      var endValue = "/family_histories";
      let newBody = _.cloneDeep(this.familyHistoryData);
      newBody.is_private = (!this.familyHistoryData.visible).toString();
      newBody.deceased = newBody.deceased.toString();
      if(newBody.relationship == 'Other'){
        newBody.relationship = this.familyHistoryData.relationship + ' ' + this.other;
      }
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
                message: 'Created Successfully', duration: 2000, position: 'bottom'
              });
              toast.present();
              if(this.fhConName){
                this.saveFHConData(data.family_history.id);
              }
              this.viewCtrl.dismiss({data:'success'});
            }
        });

      }

    dismiss() {
      this.viewCtrl.dismiss();
    }

}
