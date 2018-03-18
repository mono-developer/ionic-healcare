
import { Component, ViewChild} from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, ModalController, LoadingController, ToastController, IonicPage } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser";
import { BaseMedicineService } from "../../providers/base-medicine-service";
import { RemindersService } from '../../providers/reminders-service';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";

import * as AWS from "aws-sdk/global";
import S3 from "aws-sdk/clients/s3";

import * as _ from 'lodash';
import { fail } from 'assert';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutoCompleteComponent } from 'ionic2-auto-complete';
import { CompleteTestService } from '../../providers/CompleteTestService';

@IonicPage()
@Component({
  selector: 'add-medication',
  templateUrl: 'add-medication.html'
})
export class AddMedicationPage {
  @ViewChild('searchbar')
  searchbar: AutoCompleteComponent;
  public frequencyColumns: any;
  public tablet_image: string;
  addMedicationForm: FormGroup;
  // demi icons
  public icons: any;
  public default_forms: any;
  public default_colors: any;
  public selecting: any;

  public profile_id: any;

  public note_template: string;
  public medicationData: any;

  public physicianData: any = [];
  public email:string;
  public auth_token:string

  public color1: any;
  public color2: any;
  public form: any;
  public loaded: boolean = false;

  edit: string;
  save: string;

  file: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    public baseMedicineService: BaseMedicineService,
    public remindersService: RemindersService,
    public alertCtrl: AlertController,
    private inAppBrowser: InAppBrowser,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public userService: UserService,
    public storage: Storage,
    public toastCtrl: ToastController,
    private flagService: Flags,
    public formBuilder: FormBuilder,
    public completeTestService: CompleteTestService
  ) {

    this.edit = navParams.get('edit');
    this.save = navParams.get('save');
    if (this.edit) {
      this.medicationData = navParams.get('medicationData')
      this.medicationData.visible = !this.medicationData.is_private;
    } else {
      this.medicationData = { name: '', form: '', color1: '', color2: '', frequency: '', dosage: '', notes: '', is_private: false, visible: true };
    }
    this.profile_id = navParams.get("profile_id");
    this.frequencyColumns = [
      {
        name: 'times',
        parentCol: 'schedule',
        options: [
          { text: '1', value: '1', parentVal: '1' },
          { text: '2', value: '2', parentVal: '1' },
          { text: '3', value: '3', parentVal: '1' },
          { text: '4', value: '4', parentVal: '1' },
          { text: '5', value: '5', parentVal: '1' },
          { text: '6', value: '6', parentVal: '1' },
          { text: '1', value: '1', parentVal: '2' },
          { text: '2', value: '2', parentVal: '2' },
          { text: '3', value: '3', parentVal: '2' },
          { text: '4', value: '4', parentVal: '2' },
          { text: '5', value: '5', parentVal: '2' },
          { text: '6', value: '6', parentVal: '2' },
          { text: '7', value: '7', parentVal: '2' },
          { text: '8', value: '8', parentVal: '2' },
          { text: '9', value: '9', parentVal: '2' },
          { text: '10', value: '10', parentVal: '2' },
          { text: '11', value: '11', parentVal: '2' },
          { text: '12', value: '12', parentVal: '2' },
          { text: '13', value: '13', parentVal: '2' },
          { text: '14', value: '14', parentVal: '2' }
        ]
      }, {
        name: 'schedule',
        options: [
          { text: 'Daily', value: '1' },
          { text: 'Weekly', value: '2' },
        ]
      }];
      this.tablet_image = "assets/tablet-icon/icon-pill.png";

      // demo icons
      this.icons = [
        { type: "pill", color1: "#ff0000", color2: "#00ff00" },
        { type: "bubbles", color1: "#ffff00" },
        { type: "shape", color1: "#ff00ff" },
        { type: "tube", color1: "#0000ff" },
        { type: "round", color1: "#0000ff" },
        { type: "drop", color1: "#0000ff" },
        { type: "notch", color1: "#0000ff" },
        { type: "bar", color1: "#0000ff" },
        { type: "pentagon", color1: "#0000ff" },
        { type: "inhaler", color1: "#0000ff" },
        { type: "injection", color1: "#0000ff" },
        { type: "3-sided", color1: "#0000ff" },
        { type: "foam", color1: "#0000ff" },
        { type: "granules", color1: "#0000ff" },
        { type: "patch", color1: "#0000ff" },
        { type: "rectangle", color1: "#0000ff" },
        { type: "ring", color1: "#0000ff" },
        { type: "spoon", color1: "#0000ff" },
        { type: "spray", color1: "#0000ff" },
        { type: "square", color1: "#0000ff" },
        { type: "strip", color1: "#0000ff" },
        { type: "swab", color1: "#0000ff" },
        { type: "barrel", color1: "#0000ff" },
        { type: "drops", color1: "#0000ff" },
        { type: "elixir", color1: "#0000ff" },
        { type: "enima", color1: "#0000ff" },
        { type: "figure8", color1: "#0000ff" },
        { type: "foam", color1: "#0000ff" },
        { type: "gear", color1: "#0000ff" },
        { type: "gel", color1: "#0000ff" },
        { type: "halfcircle", color1: "#0000ff" },
        { type: "heart", color1: "#0000ff" },
        { type: "kidney", color1: "#0000ff" },
        { type: "kit", color1: "#0000ff" },
        { type: "powder", color1: "#0000ff" },
        { type: "shampoo", color1: "#0000ff" },
        { type: "stick", color1: "#0000ff" },
        { type: "suppository", color1: "#0000ff" },
        { type: "swab", color1: "#0000ff" },
        { type: "tape", color1: "#0000ff" },
        { type: "tube", color1: "#0000ff" },

      ];

      this.default_forms = this.baseMedicineService.getForms();
      this.default_colors = this.baseMedicineService.getColors();

      this.selecting = {
        color1: false,
        color2: false,
        form: false,
        notes: false
      };
      this.note_template = "";

      this.physicianData = [];
      if (this.edit) {
        this.addMedicationForm = formBuilder.group({
          name: [this.medicationData.name,],
        });
      } else {
        this.addMedicationForm = formBuilder.group({
          name: ['', Validators.required],
        });
      }
  }

  ionViewWillEnter() {
    this.storage.get('email').then(val=>{
      this.email = val;
    });

    this.storage.get('auth_token').then(val=>{
      this.auth_token = val;
    });
    this.viewCtrl.showBackButton(false);
    this.baseMedicineService.getValue(this.medicationData.color1)
      .then((res) => {
        this.color1 = res;
        this.baseMedicineService.getValue(this.medicationData.color2)
          .then((res) => {
            this.color2 = res;
            this.baseMedicineService.getNewForm(this.medicationData.form)
              .then((res) => {
                this.form = res;
                this.loaded = true;
                console.log(res);
              }, (err) => {
                console.log(err)
              })
          }, (err) => {
            console.log(err)
          })
      }, (err) => {
        console.log(err)
      })

    this.getPhysicianData();

  }

  getPhysicianData(){
    let loading = this.loadingCtrl.create({
      content: 'Loading Physician',  showBackdrop: false
    });
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
                  this.medicationData = { name:'', physician:'', form: '', color1:'', color2:'', frequency:'', dosage:'', notes:'', attach_file_urls:[], is_private: false, visible: true} ;
                }
              }
            }
          );
        });
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
              this.medicationData.physician = '';
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
    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
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
                this.medicationData.physician = value;
              }
          });
      });
    });
  }

  selectForm() {
    this.selecting.form = !this.selecting.form;
  }

  selectColor1() {
    this.selecting.color1 = !this.selecting.color1;
  }

  selectColor2() {
    this.selecting.color2 = !this.selecting.color2;
  }

  enterNote() {
    this.selecting.notes = !this.selecting.notes;
    this.note_template = this.medicationData.notes;
  }

  setForm(val) {
    this.form = val;
    this.medicationData.form = val.name;
    this.selecting.form = false;
  }

  setColor1(val) {
    this.color1 = val;
    this.medicationData.color1 = val.color;
    this.selecting.color1 = false;
  }

  setColor2(val) {
    this.color2 = val;
    this.medicationData.color2 = val.color;
    this.selecting.color2 = false;
  }

  noteCancel() {
    this.selecting.notes = false;
  }

  noteSave() {
    if (!this.note_template) {
      this.note_template = '';
    }
    this.selecting.notes = false;
    this.medicationData.notes = this.note_template;
  }

  checkValidate() {
    let retVal = true;
    if (!this.medicationData.name || !this.medicationData.dosage) {
      return false;
    }
    return retVal;
  }

  onCancel() {
    this.navCtrl.pop();
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
      console.log( 'attach', this.medicationData.attach_file_urls);
      var files = event.target.files;
      var file = files[0];
      this.file = file;
      let file_name = this.file.name;
      console.log("this.file:" + JSON.stringify(this.medicationData.file_name));
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
          console.log('newAttach', newAttach);
          that.medicationData.attach_file_urls.push(newAttach);
          console.log(that.medicationData.attach_file_urls);
      });
    }

  deleteItem(i){
    this.medicationData.attach_file_urls.splice(i, 1);
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
            this.deleteMedicationData();
          }
        }
      ]
    });
    alert.present();
  }

  deleteMedicationData() {
    let loading = this.loadingCtrl.create();
    var endValue = "/medications/" + this.medicationData.id;
    loading.present();
    this.userService.dataDelete(this.email, this.auth_token, this.profile_id, endValue)
      .subscribe(
        (data) => {
          loading.dismiss();
          console.log("medicationData: ", data);
          if(data.success == false){
            let alert = this.alertCtrl.create({
              title: "Error", subTitle: "Unable to remove medication", buttons: ['OK']
            });
            alert.present();
          } else{
            this.flagService.setChangedFlag(true);
            let toast = this.toastCtrl.create({
                message: 'Medication Deleted', duration: 2000, position: 'bottom',
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

  updateMedicationsData() {

    let loading = this.loadingCtrl.create({
      content: 'Updating Medication'
    });
    var endValue = "/medications/"+this.medicationData.id;
    let newBody = _.cloneDeep(this.medicationData);
    newBody.is_private = (!this.medicationData.visible).toString();
    let body = { "id": this.medicationData.id, "medication": this.getBody(newBody) }

    loading.present();
    this.userService.dataUpdate(this.email, this.auth_token, this.profile_id, endValue, body)
      .subscribe(
        (data) => {
          loading.dismiss();
          console.log("MedicationData Data: ", data);
          if(data.success == false){
            let alert = this.alertCtrl.create({
              title: "Error", subTitle: "Unable to update medication", buttons: ['OK']
            });
            alert.present();
          } else{
            this.flagService.setChangedFlag(true);
            let toast = this.toastCtrl.create({
              message: 'Medication Updated', duration: 2000, position: 'bottom',
          });
            toast.present();
            this.navCtrl.pop();
            console.log(data);
          }
      });
    }

  createMedicationsData() {
    let loading = this.loadingCtrl.create();
    let endValue = "/medications";
    this.medicationData.name = this.searchbar.getValue();
    let newBody = _.cloneDeep(this.medicationData);
    newBody.is_private = (!this.medicationData.visible).toString();
    let body = this.getBody(newBody);
    loading.present();

    this.userService.dataCreate(this.email, this.auth_token, this.profile_id, endValue, body)
      .subscribe(
        (data) => {
          loading.dismiss();
          console.log("Medication Data: ", data);
          if(data.success == false){
            let alert = this.alertCtrl.create({
              title: "Error", subTitle: "Unable to create medication", buttons: ['OK']
            });
            alert.present();
          } else{
            let toast = this.toastCtrl.create({
              message: 'Medication Created', duration: 2000, position: 'bottom',

          });
            toast.present();
            this.viewCtrl.dismiss({data:'success'});
          }
      });

  }

  // onSave () {
  //   console.log(this.medicationData);
  //   if(this.checkValidate()) {
  //     this.remindersService.add(this.medicationData)
  //     .then((res) => {
  //       if (res == 'exist') {
  //         let alert0 = this.alertController.create({
  //           title: 'Warning',
  //           subTitle: 'This meditation is already added for this dependent.',
  //           buttons: ['OK']
  //         });
  //         alert0.present();
  //       } else {
  //         let profileModal = this.modalCtrl.create(SuccessPage, { value: 'medication'});
  //         profileModal.present();
  //       }
  //     }, (err) => {
  //       console.log(err);
  //     })
  //   } else {
  //     let alert = this.alertController.create({
  //       title: 'Warning',
  //       subTitle: 'Please fill in the fields required in red.',
  //       buttons: ['OK']
  //     });
  //     alert.present();
  //   }
  // }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
