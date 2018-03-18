import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, AlertController, LoadingController, ToastController, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";
import { log } from 'util';
import { parse } from 'querystring';

import * as AWS from "aws-sdk/global";
import S3 from "aws-sdk/clients/s3";

import * as _ from 'lodash';
import { fail } from 'assert';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-immunizations-edit',
  templateUrl: 'immunizations-edit.html'
})
export class ImmunizationsEditPage {
  immunizationForm: FormGroup;
  physicianData: any;
  profile_id: string;
  save: string;
  edit: string;
  id: string;
  immunizationsData: any = { name: '', physician: '', attach_file_urls: [], is_private: false, visible: true, notes: '' };
  imzDateDose: any;

  vaccineList: any;
  email: string;
  auth_token: string;
  note_template: string;
  selecting: any;
  other: string;

  doseData: any;
  addInputBox: boolean;
  file: any;


  constructor(public navCtrl: NavController,
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
    console.log('save', this.save);
    this.addInputBox = false;
    this.profile_id = navParams.get("profile_id");
    if (this.edit) {
      this.id = navParams.get("id");
    }
    this.storage.get('email').then(val => {
      this.email = val;
    });
    this.storage.get('auth_token').then(val => {
      this.auth_token = val;
    });
    this.other = '';
    this.vaccineList = [
      { name: 'Hepatitis B1 (HepB)', value: 0 },
      { name: 'Rotavirus (RV1)', value: 1 },
      { name: 'Rotavirus (RV5)', value: 2 },
      { name: 'Diphtheria, tetanus, & acellular pertussis (DTaP)', value: 3 },
      { name: 'Haemophilus influenzae type b (Hib)', value: 4 },
      { name: 'Pneumococcal conjugate (PCV13)', value: 5 },
      { name: 'Inactivated poliovirus', value: 6 },
      { name: 'Influenza (IIV)', value: 7 },
      { name: 'Measles, mumps, rubella8 (MMR)', value: 8 },
      { name: 'Varicella (VAR)', value: 9 },
      { name: 'Hepatitis A (HepA)', value: 10 },
      { name: 'Meningococcal', value: 11 },
      { name: 'Tetanus, diphtheria, & acellular pertussis', value: 12 },
      { name: 'Human papillomavirus (HPV)', value: 13 },
      { name: 'Meningococcal B', value: 13 },
      { name: 'Pneumococcal polysaccharide (PPSV23)', value: 14 },
      { name: 'Other', value: 15 },
    ]
    this.selecting = {
      notes: false
    };
    this.physicianData = [];

    this.immunizationForm = formBuilder.group({
      name: ['', Validators.required],
      other: [''],
      physician: [''],
      note_template: [''],
      imzDateDose: [''],
      is_private: ['']
      // zip: ['']
    });

  }


  ionViewDidEnter() {
    if(this.edit){
      this.getImmuniczationData();
    }else{
      this.getPhysicianData();
    }

  }

  getImmuniczationData() {
    var endValue = "/immunizations/" + this.id;
    this.userService.dataGet(this.email, this.auth_token, this.profile_id, endValue)
      .subscribe(
      (data) => {
        if (data.success == false) {
          let alert = this.alertCtrl.create({
            title: "Error", subTitle: "Get Data Error", buttons: ['OK']
          });
          alert.present();
        } else {
          this.immunizationsData = data.immunization;
          this.immunizationsData.visible = !this.immunizationsData.is_private;
          if (this.immunizationsData.notes == undefined) {
            this.immunizationsData.notes = '';
          }
          this.getPhysicianData();
          console.log('immunizationData', this.immunizationsData);
          this.getImName(data.immunization.name);
          this.getDoseData();
        }
      });
  }

  getImName(value) {
    let name = value.split('Other ');
    if (name[0] == '') {
      this.immunizationsData.name = 'Other';
      this.other = name[1];
      console.log('other', this.other);
    }else{
      this.immunizationsData.name = value;
    }
  }
  // ngOnInit() {
  //   if (this.edit) {
  //     let name = this.immunizationsData.name.split('Other ');
  //     if (name[0] == '') {
  //       this.immunizationsData.name = 'Other';
  //       this.other = name[1];
  //     }
  //   }
  // }


  addInput() {
    this.addInputBox = true;
  }

  isReadonly() {
    return this.isReadonly;
  }

  getDoseData() {
    let loading = this.loadingCtrl.create();
    var endValue = "/immunization_doses";
    loading.present();
    this.storage.get('email').then(val => {
      this.email = val;
      this.storage.get('auth_token').then(val => {
        this.auth_token = val;
        this.userService.dataGet(this.email, this.auth_token, this.profile_id, endValue)
          .subscribe(
          (data) => {
            loading.dismiss();
            if (data.success == false) {
              let alert = this.alertCtrl.create({
                title: "Error", subTitle: "Get Data Error", buttons: ['OK']
              });
              alert.present();
            } else {
              let conditions = data.immunization_doses;
              this.doseData = conditions.filter(res => res.immunization_id === this.immunizationsData.id);
            }
          });
      });
    });
  }

  deleteDose(id) {
    let loading = this.loadingCtrl.create();
    let endValue = "/immunization_doses/" + id;
    loading.present();
    this.storage.get('email').then(val => {
      this.email = val;
      this.storage.get('auth_token').then(val => {
        this.auth_token = val;
        this.userService.dataDelete(this.email, this.auth_token, this.profile_id, endValue)
          .subscribe(
          (data) => {
            loading.dismiss();
            if (data.success == false) {
              let alert = this.alertCtrl.create({
                title: "Error", subTitle: "Delete Error", buttons: ['OK']
              });
              alert.present();
            } else {
              this.getDoseData();
            }
          });
      });
    });
  }

  onSelectChange(value: any) {
    console.log('Selected', value);
    if (value == "Add New Physician") {
      let alert = this.alertCtrl.create({
        title: 'Add New Physician',
        inputs: [
          {
            name: 'name',
            placeholder: 'name'
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
              this.immunizationsData.physician = '';
              this.createPhysicianData(data.name);
            }
          }
        ]
      });
      alert.present();
    }
  }


  getPhysicianData() {
    let loading = this.loadingCtrl.create();
    var endValue = "/physicians"
    loading.present();
    this.storage.get('email').then(val => {
      this.email = val;
      this.storage.get('auth_token').then(val => {
        this.auth_token = val;
        this.userService.dataGet(this.email, this.auth_token, this.profile_id, endValue)
          .subscribe(
          (data) => {
            loading.dismiss();
            if (data.success == false) {
              let alert = this.alertCtrl.create({
                title: "Error", subTitle: "Get Data Error", buttons: ['OK']
              });
              alert.present();
              this.navCtrl.pop();
            } else {
              this.physicianData = data.physicians;
              let newPhysician = { name: "Add New Physician" };
              this.physicianData.push(newPhysician);
              if (!this.edit) {
                this.immunizationsData = { physician: '', is_private: false, visible: true }
              }
            }
          });
      });
    });
  }

  createPhysicianData(value) {
    let loading = this.loadingCtrl.create({
      content: 'Creating Physician'
    });
    var endValue = "/physicians";
    var body = {
      "physician": {
        "name": value, "is_private": 'false'
      }
    }
    console.log(body);
    loading.present();
    this.storage.get('email').then(val => {
      this.email = val;
      this.storage.get('auth_token').then(val => {
        this.auth_token = val;
        this.userService.dataCreate(this.email, this.auth_token, this.profile_id, endValue, body)
          .subscribe(
          (data) => {
            loading.dismiss();
            console.log("Physicians Data: ", data);
            if (data.success == false) {
              let toast = this.toastCtrl.create({
                message: 'Created Error', duration: 2000, position: 'center'
              });
              toast.present();
            } else {
              let toast = this.toastCtrl.create({
                message: 'Created Successfully', duration: 2000, position: 'center'
              });
              toast.present();
              this.physicianData.push(data.physician);
              this.immunizationsData.physician = value;
            }
          });
      });
    });
  }

  saveDoseData(id) {

    let body = {
      "immunization_dose":
        { immunization_id: id.toString(), dose: 'Dose', does_date: this.imzDateDose }
    }
    let endValue = "/immunization_doses";
    this.storage.get('email').then(val => {
      this.email = val;
      this.storage.get('auth_token').then(val => {
        this.auth_token = val;
        this.userService.dataCreate(this.email, this.auth_token, this.profile_id, endValue, body)
          .subscribe(
          (data) => {
            if (data.success == false) {
              let alert = this.alertCtrl.create({
                title: "Error", subTitle: "Create Immunization Dose Error", buttons: ['OK']
              });
              alert.present();
            } else {
              this.imzDateDose = '';
              this.addInputBox = false;
              this.getDoseData();
            }
          });
      });
    })
  }

  updateDoseData(item, newDate) {
    let body = {
      "immunization_dose":
        { immunization_id: item.immunization_id.toString(), dose: 'Dose', does_date: newDate }
    }
    let endValue = "/immunization_doses/" + item.id;
    this.storage.get('email').then(val => {
      this.email = val;
      this.storage.get('auth_token').then(val => {
        this.auth_token = val;
        this.userService.dataUpdate(this.email, this.auth_token, this.profile_id, endValue, body)
          .subscribe(
          (data) => {
            if (data.success == false) {
              let alert = this.alertCtrl.create({
                title: "Error", subTitle: "Create Immunization Dose Error", buttons: ['OK']
              });
              alert.present();
            } else {
              this.imzDateDose = '';
              this.addInputBox = false;
              this.getDoseData();
            }
          });
      });
    })
  }

  editDose(item) {

    let alert = this.alertCtrl.create({
      title: 'Update Dose Date',
      inputs: [
        {
          type: 'date',
          name: 'date',
          placeholder: 'New Dose Date'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            this.getDoseData();
          }
        },
        {
          text: 'Update',
          handler: data => {
            this.updateDoseData(item, data.date);
          }
        }
      ]
    });
    alert.present();
  }



  enterNote() {
    this.selecting.notes = !this.selecting.notes;
    this.note_template = this.immunizationsData.notes;
  }

  noteCancel() {
    this.selecting.notes = false;
  }

  noteSave() {
    if (!this.note_template) {
      this.note_template = '';
    }
    this.selecting.notes = false;
    this.immunizationsData.notes = this.note_template;
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
            this.deleteImmunizationsData();
          }
        }
      ]
    });
    alert.present();
  }

  deleteImmunizationsData() {
    let loading = this.loadingCtrl.create();
    let endValue = "/immunizations/" + this.id;
    loading.present();
    this.storage.get('email').then(val => {
      this.email = val;
      this.storage.get('auth_token').then(val => {
        this.auth_token = val;
        this.userService.dataDelete(this.email, this.auth_token, this.profile_id, endValue)
          .subscribe(
          (data) => {
            loading.dismiss();
            if (data.success == false) {
              let alert = this.alertCtrl.create({
                title: "Error", subTitle: "Delete Error", buttons: ['OK']
              });
              alert.present();
              this.navCtrl.pop();
            } else {
              this.flagService.setChangedFlag(true);
              let alert = this.alertCtrl.create({
                title: "Deleted", subTitle: "Delete Success", buttons: ['OK']
              });
              alert.present();
              this.navCtrl.pop();
            }
          });
      });
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

  updateImmunizationsData() {
    let loading = this.loadingCtrl.create();
    var endValue = "/immunizations/" + this.immunizationsData.id;
    let name;
    if (this.immunizationsData.name == 'Other') {
      name = this.immunizationsData.name + ' ' + this.other;
    } else {
      name = this.immunizationsData.name;
    }
    var body = {
      "id": this.immunizationsData.id, "immunization": {
        "name": name, "notes": this.immunizationsData.notes,
        "physician": this.immunizationsData.physician, "is_private": (!this.immunizationsData.visible).toString()
      }
    }
    loading.present();
    this.storage.get('email').then(val => {
      this.email = val;
      this.storage.get('auth_token').then(val => {
        this.auth_token = val;
        this.userService.dataUpdate(this.email, this.auth_token, this.profile_id, endValue, body)
          .subscribe(
          (data) => {
            loading.dismiss();
            if (data.success == false) {
              let alert = this.alertCtrl.create({
                title: "Error", subTitle: "Updated Error", buttons: ['OK']
              });
              alert.present();
              this.navCtrl.pop();
            } else {
              this.flagService.setChangedFlag(true);
              let alert = this.alertCtrl.create({
                title: "Updated", subTitle: "Updated Success", buttons: ['OK']
              });
              alert.present();
              this.navCtrl.pop();
            }
          });
      });
    });
  }

  createImmunizationsData() {
    let loading = this.loadingCtrl.create();
    var endValue = "/immunizations";
    let name;
    if (this.immunizationsData.name == 'Other') {
      name = this.immunizationsData.name + ' ' + this.other;
    } else {
      name = this.immunizationsData.name;
    }
    var body = {
      "immunization": {
        "name": name, "notes": this.immunizationsData.notes,
        "physician": this.immunizationsData.physician, "is_private": (!this.immunizationsData.visible).toString()
      }
    }
    loading.present();
    this.storage.get('email').then(val => {
      this.email = val;
      this.storage.get('auth_token').then(val => {
        this.auth_token = val;
        this.userService.dataCreate(this.email, this.auth_token, this.profile_id, endValue, body)
          .subscribe(
          (data) => {
            loading.dismiss();
            if (data.success == false) {
              let alert = this.alertCtrl.create({
                title: "Error", subTitle: "Create Error", buttons: ['OK']
              });
              alert.present();
            } else {
              if (this.imzDateDose) {
                this.saveDoseData(data.immunization.id);
              }
              let alert = this.alertCtrl.create({
                title: "Created", subTitle: "Created Success", buttons: ['OK']
              });
              alert.present();
              this.viewCtrl.dismiss({ data: 'success' });
            }
          });
      });
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
