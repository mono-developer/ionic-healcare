import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, AlertController, LoadingController, ToastController, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";
import * as _ from "lodash";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-other-edit',
  templateUrl: 'other-edit.html'
})
export class OtherInfoEditPage {
  otherInfoForm: FormGroup;

  save: string;
  edit: string;
  otherInfoData: any = {};
  state: any;
  profile_id: any;
  email: string;
  auth_token: string;
  note_template: string;
  selecting: any;
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public userService: UserService,
    public storage: Storage,
    private flagService: Flags,
    public formBuilder: FormBuilder

  ) {
    this.save = navParams.get("save");
    this.edit = navParams.get("edit");

    if (navParams.get("otherInfoData") != null) {
      this.otherInfoData = navParams.get("otherInfoData");
    } else {
      this.otherInfoData.is_private = false;
    }
    this.otherInfoData.visible = !this.otherInfoData.is_private;
    this.note_template = this.otherInfoData.notes;

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
    this.otherInfoForm = formBuilder.group({
      name: ['', Validators.required],
      note_template: ['', Validators.required],
      is_private: ['']
    });
  }
  enterNote() {
    this.selecting.notes = !this.selecting.notes;
    this.note_template = this.otherInfoData.notes;
  }

  noteCancel() {
    this.selecting.notes = false;
  }

  noteSave() {
    if (!this.note_template) {
      this.note_template = '';
    }
    this.selecting.notes = false;
    this.otherInfoData.notes = this.note_template;
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
            this.deleteOtherInfoData();
          }
        }
      ]
    });
    alert.present();
  }

  deleteOtherInfoData() {
    let loading = this.loadingCtrl.create();
    var endValue = "/other_informations/" + this.otherInfoData.id;
    loading.present();

    this.userService.dataDelete(this.email, this.auth_token, this.profile_id, endValue)
      .subscribe(
        (data) => {
          loading.dismiss();
          console.log("otherInfoData Data: ", data);
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

    updateOtherInfoData() {

      let loading = this.loadingCtrl.create();
      var endValue = "/other_informations/" + this.otherInfoData.id;

      let newBody = _.cloneDeep(this.otherInfoData);
      newBody.is_private = (!this.otherInfoData.visible).toString();
      let body = { "id": this.otherInfoData.id, "other_information": this.getBody(newBody) }
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
            }
        });
    }

  createOtherInfoData() {
    let loading = this.loadingCtrl.create();
    var endValue = "/other_informations";

    let newBody = _.cloneDeep(this.otherInfoData);
    newBody.is_private = (!this.otherInfoData.visible).toString();
    let body = this.getBody(newBody);
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
