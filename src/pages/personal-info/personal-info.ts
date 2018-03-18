import { Component, ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';
import { NavController, NavParams, AlertController, IonicPage, LoadingController, ToastController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import { Crop } from '@ionic-native/crop';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { UserService } from "../../providers/user-service";
import { BaseService } from "../../providers/base-service";
import { CountryService } from '../../providers/country-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as _ from 'lodash';
@IonicPage()
@Component({
  selector: 'page-personal-info',
  templateUrl: 'personal-info.html'
})
export class PersonalInfoPage {
  @ViewChild(Content) content: Content;
  persnolInfoForm: FormGroup;
  profile_id: any;
  person: any = {};
  address: any = {};
  imagePath: any = '';
  email: string;
  auth_token: string;
  genders: any;
  hairs: any;
  eyes: any;
  bloods: any;
  donors: any;
  countries: any;
  scrollTop: any;
  buttonFlag: boolean = false;
  lastTime: any = new Date();
  heightColumns: any;
  height: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private actionSheet: ActionSheet,
    public camera: Camera,
    private crop: Crop,
    private fileTransfer: FileTransfer,
    private file: File,
    public storage: Storage,
    public userService: UserService,
    public baseService: BaseService,
    public countryService: CountryService,
    public formBuilder: FormBuilder
  ) {
    this.scrollTop = 0;
    this.genders = [{ title: "Female", value: "female" },
    { title: "Male", value: "male" }];
    this.hairs = [{ color: "Black", value: "Black" }, { color: "Brown", value: "Brown" }, { color: "Alonde", value: "Alonde" },
    { color: "Auburn", value: "Auburn" }, { color: "Red", value: "Red" }, { color: "Gray", value: "Grey" },
    { color: "White", value: "White" }, { color: "Chestnut", value: "Chestnut" }, { color: "No Hair", value: "Bald" }];
    this.eyes = [{ color: "Brown", value: "Brown" }, { color: "Gray", value: "Gray" }, { color: "Green", value: "Green" }, { color: "Hazel", value: "Hezel" },
    { color: "Red", value: "Red" }, { color: "Violet", value: "Violet" }, { color: "Blue", value: "Blue" }, { color: "Other", value: "Other" }];
    this.bloods = [{ type: "O+", value: "O+" }, { type: "O-", value: "O-" }, { type: "A+", value: "A+" }, { type: "A-", value: "A-" },
    { type: "B+", value: "B+" }, { type: "B-", value: "B-" }, { type: "AB+", value: "AB+" }, { type: "AB-", value: "AB-" }];
    this.donors = [{ title: "Yes", value: true }, { title: "No", value: false }];

    this.heightColumns = [
      {
        name: 'col1',
        options: [
          { text: "1'", value: 30.48 },
          { text: "2'", value: 60.96 },
          { text: "3'", value: 91.44 },
          { text: "4'", value: 121.92 },
          { text: "5'", value: 152.4 },
          { text: "6'", value: 182.88 },
          { text: "7'", value: 213.36 }
        ]
      }, {
        name: 'col2',
        options: [
          { text: '0"', value: 0 },
          { text: '1"', value: 2.54 },
          { text: '2"', value: 5.08 },
          { text: '3"', value: 7.62 },
          { text: '4"', value: 10.16 },
          { text: '5"', value: 12.7 },
          { text: '6"', value: 15.24 },
          { text: '7"', value: 17.78 },
          { text: '8"', value: 20.32 },
          { text: '9"', value: 22.86 },
          { text: '10"', value: 25.4 },
          { text: '11"', value: 27.94 }
        ]
      }
    ];

    this.countries = this.countryService.getCountries();

    this.profile_id = navParams.get("profile_id");
    console.log(this.profile_id);
    this.persnolInfoForm = formBuilder.group({
      first_name: ['', Validators.required],
      middle_name: [''],
      last_name: ['', Validators.required],
      phone_number: [''],
      birth_date: ['', Validators.required],
      gender: ['', Validators.required],
      hair: [''],
      eye_color: [''],
      height: [''],
      weight: [''],
      blood_type: ['',],
      donor: [''],
      line1: [''],
      line2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['']
    });
    this.getData(this.profile_id);

  }



  ionViewWillEnter() {
    // this.getData(this.profile_id);
  }

  scrollHandler(event) {
    this.scrollTop = event.scrollTop;
    // console.log(this.scrollTop);
    // let newDate = new Date();
    //
    // if(this.scrollTop>150 && newDate.getTime() - this.lastTime.getTime() > 500) {
    //   this.buttonFlag = true;
    //   this.lastTime = newDate;
    // } else if(this.scrollTop<150 && newDate.getTime() - this.lastTime.getTime() > 500) {
    //   this.buttonFlag = false;
    //   this.lastTime = newDate;
    // }

  }

  getHeightValue(value) {

    let val: number = value * 100;
    let feet = (val / 3048);
    let feet_val = Math.floor(feet);
    let feet_value = 3048 * feet_val / 100;
    let inch_val = val % 3048 / 100;



    return feet_value.toString() + ' ' + inch_val.toString();

  }

  heightChange() {
    console.log('changed', this.height);
    let value = this.height.split(' ');

    let height = Number(value[0]) + Number(value[1]);
    let height_value = height.toString()
    this.person.height = height.toString();
    console.log('height', this.person.height)

  }

  getData(profile_id) {

    let loading = this.loadingCtrl.create();
    loading.present();

    var endValue = "/preview"
    this.storage.get('email').then(val => {
      this.email = val;
      this.storage.get('auth_token').then(val => {
        this.auth_token = val;
        this.userService.getPersonalProfiles(this.auth_token, this.email, profile_id)
          .subscribe(
          (data) => {
            loading.dismiss();
            console.log("Data: ", data);
            if (data.success == false) {
              let alert = this.alertCtrl.create({
                title: "Error", subTitle: "Get Data Error", buttons: ['OK']
              });
              alert.present();
              this.navCtrl.pop();
            } else {
              console.log(data);
              this.person = data.profile.person;
              this.address = data.profile.address;
              this.imagePath = data.profile.image_url.thumb;
              this.height = this.getHeightValue(this.person.height);
              console.log('height', this.height);
            }
          },
          (data) => {
            loading.dismiss();
            console.log('internet Fails');
          });
      });
    });
  }

  getPicture() {

    console.log("getPicture");

    let buttonLabels = ['Photo Library', 'Camera'];
    this.actionSheet
      .show({
        title: 'Source Library',
        buttonLabels: buttonLabels,
        addCancelButtonWithLabel: 'Cancel',
        destructiveButtonLast: true
      })
      .then((buttonIndex: number) => {
        switch (buttonIndex) {
          case 1:
            let options: CameraOptions = {
              destinationType: this.camera.DestinationType.FILE_URI,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            }
            this.camera.getPicture(options).then((imageData) => {
              this.crop.crop(imageData, { quality: 75 })
                .then(newImage => {
                  console.log('NewImage', newImage);
                  this.imagePath = newImage;
                  this.updatePhoto();
                }, error => console.error('Error cropping image', JSON.stringify(error))
                );
            }, (err) => {
              alert(JSON.stringify(err))
            });
            break;
          case 2:
            let options1: CameraOptions = {
              destinationType: this.camera.DestinationType.FILE_URI,
              encodingType: this.camera.EncodingType.JPEG,
              sourceType: this.camera.PictureSourceType.CAMERA,
            }
            this.camera.getPicture(options1).then((imageData) => {
              this.crop.crop(imageData, { quality: 75 })
                .then(newImage => {
                  console.log('NewImage', newImage);
                  this.imagePath = newImage;
                  this.updatePhoto();
                }, error => console.error('Error cropping image', error)
                );
            }, (err) => {
              alert(JSON.stringify(err))
            });
            break;
          default:
            break;
        }
      });
  }

  updatePhoto() {
    let loading = this.loadingCtrl.create();
    loading.present();

    if (this.imagePath) {
      let filename = this.imagePath.split('/').pop();
      let options = {
        fileKey: "profile[image]",
        fileName: filename,
        chunkedMode: false,
        httpMethod: "PUT",
        mimeType: "image/jpg",
        headers:
          { 'auth_token': this.auth_token, 'email': this.email }
      };

      const fileTransfer: FileTransferObject = this.fileTransfer.create();

      fileTransfer.upload(this.imagePath, this.baseService.createProfileUrl + "/" + this.person.id,
        options).then((entry) => {
          console.log("url: " + this.baseService.createProfileUrl + "/" + this.person.id);
          if (JSON.stringify(entry).indexOf("error_code") == -1) {
            this.person.image_url.thumb = this.imagePath;
            loading.dismiss();
          }
          else {
            loading.dismiss();
            console.log("success:" + JSON.stringify(entry));
          }
        }, (err) => {
          loading.dismiss();
          console.log("failed:" + JSON.stringify(err));
        });
    }
  }


  personalDataUpdate() {

    let loading = this.loadingCtrl.create();
    console.log(this.person.birth_date);
    let profile = {
      "first_name": this.person.first_name,
      "middle_name": this.person.middle_name,
      "last_name": this.person.last_name,
      "phone_number": this.person.phone_number,
      "birth_date": this.person.birth_date,
      "gender": this.person.gender,
      "hair": this.person.hair,
      "eye_color": this.person.eye_color,
      "height": this.person.height,
      "weight": this.person.weight,
      "blood_type": this.person.blood_type,
      "donor": this.person.donor
    }
    let body = { "id": this.person.id, "profile": _.pickBy(profile, _.identity) };

    console.log(body);
    loading.present();
    this.storage.get('email').then(val => {
      this.email = val;
      this.storage.get('auth_token').then(val => {
        this.auth_token = val;
        this.userService.dataUpdate(this.email, this.auth_token, this.person.id, "", body)
          .subscribe(
          (data) => {
            loading.dismiss();
            console.log("PersonalInfo Data: ", data);
            if (data.success == false) {
              let alert = this.alertCtrl.create({
                title: "Error", subTitle: "Updated Error", buttons: ['OK']
              });
              alert.present();
              this.navCtrl.pop();
            } else {
              console.log(data);
              this.updateAddress();
            }
          });
      });
    });
  }

  updateAddress() {

    let loading = this.loadingCtrl.create();
    var endValue = "/address";
    let address = {
      "line1": this.address.line1, "line2": this.address.line2,
      "city": this.address.city, "state": this.address.state,
      "country": this.address.country, "zip": this.address.zip
    };
    var body = { "id": this.address.id, "address": _.pickBy(address, _.identity) };
    console.log(body);
    loading.present();
    this.storage.get('email').then(val => {
      this.email = val;
      this.storage.get('auth_token').then(val => {
        this.auth_token = val;
        this.userService.dataUpdate(this.email, this.auth_token, this.profile_id, endValue, body)
          .subscribe(
          (data) => {
            loading.dismiss();
            console.log("Address Data: ", data);
            if (data.success == false) {
              let alert = this.alertCtrl.create({
                title: "Error", subTitle: "Updated Error", buttons: ['OK']
              });
              alert.present();
              this.navCtrl.pop();
            } else {
              // this.flagService.setChangedFlag(true);
              let alert = this.alertCtrl.create({
                title: "Updated", subTitle: "Updated Success", buttons: ['OK']
              });
              alert.present();
              console.log(data);
              this.navCtrl.pop();

            }
          });
      });
    });
  }




  closePage() {
    this.navCtrl.pop();
  }
}
