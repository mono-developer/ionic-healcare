import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, NavParams,IonicPage, AlertController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { DependentService } from "../../providers/dependent-service";
import { RemindersService } from '../../providers/reminders-service';
import { BaseMedicineService } from "../../providers/base-medicine-service";
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";
@IonicPage()
@Component({
  selector: 'page-medications',
  templateUrl: 'medications.html'
})
export class MedicationsPage {

  person: any = [];
  personData:any;
  profile_id:any;
  imagePath:any;
  reminderData:any;
  medicationData:any;
  email:string;
  auth_token:string
  loaded: any;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public dependentService: DependentService,
    public baseMedicineService: BaseMedicineService,
    public remindersService: RemindersService,
    public userService: UserService,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    private flagService: Flags,
  ) {
    this.profile_id = navParams.get("profile_id");
    console.log('person_id', this.profile_id );
    this.personData = navParams.get("personData");
    this.imagePath =  this.personData.image_url.thumb;
    this.loaded = false;
    this.storage.set("active_page", "MedicationsPage");
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.gettingdata();
      refresher.complete();
    }, 1000);
  }

  ionViewWillEnter() {
    console.log('* Here is Select Medication Page *');
    // this.persons = this.dependentService.getAll();
    // this.getDatas();
  }

  ngOnInit(){
      this.flagService.setChangedFlag(false);
      this.gettingdata();
    }

    ionViewDidEnter(){
      if(this.flagService.getChangedFlag()){
        this.gettingdata();
      }
    }

    gettingdata(){
      let loading = this.loadingCtrl.create({
        content: 'Loading Medications'
      });  
      var endValue = "/medications"
      loading.present();
      this.storage.get('email').then(val=>{
        this.email = val;
        this.storage.get('auth_token').then(val=>{
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
                  console.log("Medication Data", data.medications);
                  this.medicationData = data.medications;

                }
            });
        });
      });
    }

  // getDatas() {
  //   let loading = this.loadingCtrl.create();
  //   loading.present();
  //     this.remindersService.getForDependent(this.profile_id)
  //     .then((res) => {
  //        loading.dismiss();
  //        this.reminderData = res;
  //        console.log(this.reminderData)
  //        this.loaded = true;
  //        this.reminderData.forEach((item) => {
  //          this.baseMedicineService.getForm(item.form_Id)
  //          .then((res) => {
  //            item.form = res;
  //            console.log('reminderForm', res);
  //          }, (err) => {
  //            console.log(err);
  //            loading.dismiss();
  //          });
  //          this.baseMedicineService.getColor(item.color1_Id)
  //          .then((res) => {
  //            item.color1 = res;
  //            console.log('reminderColor1', res);
  //          }, (err) => {
  //            console.log(err);
  //            loading.dismiss();
  //          });
  //          this.baseMedicineService.getColor(item.color2_Id)
  //          .then((res) => {
  //            item.color2 = res;
  //            console.log('reminderColor2', res);
  //          }, (err) => {
  //            console.log(err);
  //            loading.dismiss();
  //          });
  //        })
  //     }, (err) => {
  //       console.log(err);
  //       loading.dismiss();
  //     })
  // }

  // createMedicationsData(){
  //   let profileModal = this.modalCtrl.create(AddMedicationPage, { id: this.profile_id});
  //   profileModal.onDidDismiss(() => {
  //     this.getDatas();
  //   });
  //   profileModal.present();
  // }
  //
  // editMedicationsData(event, reminderData){
  //   let editModal = this.modalCtrl.create(EditMedicationPage, { id: reminderData.id});
  //   editModal.onDidDismiss(() => {
  //     this.getDatas();
  //   });
  //   editModal.present();
  // }

  createMedicationsData(){
    console.log('go PharmaciesEditPage');
    let profileModal = this.modalCtrl.create('AddMedicationPage', { save: 'save', profile_id:this.profile_id });
    profileModal.onDidDismiss(data =>{
      if(data){
        this.gettingdata();
      }
    })
    profileModal.present();
  }

  editMedicationsData(event, medicationData){
    console.log('go medicationData');
    this.navCtrl.push('AddMedicationPage', { edit:'edit', medicationData: medicationData, profile_id:this.profile_id });
  }



  closePage(){
    this.navCtrl.pop();
  }

}
