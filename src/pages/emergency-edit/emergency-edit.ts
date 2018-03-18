import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, AlertController,  LoadingController, ToastController, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@IonicPage()
@Component({
  selector: 'page-emergency-edit',
  templateUrl: 'emergency-edit.html'
})
export class EmergencyEditPage {

  public save:string;
  public edit:string;

  emergencyData:any = {name:'', relationship:'', phone_number:'', alt_phone_number:'', email:''};
  profile_id:any;
  email:string;
  auth_token:string;
  relationships:any;
  other:string;
  emergencyForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public userService: UserService,
    public storage: Storage,
    public toastCtrl: ToastController,    
    private flagService: Flags,
    public formBuilder: FormBuilder,
  ) {
      this.save = navParams.get("save");
      this.edit = navParams.get("edit");
      console.log(this.save);
      if (navParams.get("emergencyData") != null){
          this.emergencyData = navParams.get("emergencyData");
          console.log(this.emergencyData);
      }

      this.profile_id = navParams.get("profile_id");
      this.relationships = [
        { name:'Brother', value: 0},
        { name:'Sister', value: 1},
        { name:'Mother', value: 2 },
        { name:'Father', value: 3},
        { name:'Aunt', value: 4},
        { name:'Uncle', value: 5},
        { name:'Grandfather', value:6 },
        { name:'Grandmother', value: 7},
        { name:'Wife', value: 9},
        { name:'Other', value: 8},

      ];
      
      this.email = "";
      this.auth_token = "";
      this.emergencyForm = formBuilder.group({
        name: ['', Validators.required],
        other:[''],
        relationship: [''],
        phone_number: ['', Validators.required],
        email: [''],
        alt_phone_number: [''],
      });
  }

  ngOnInit(){
    let relationship = this.emergencyData.relationship.split(' ');
    if(relationship[0] == 'Other'){
      this.emergencyData.relationship = 'Other';
      this.other = relationship[1];
    }
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
            this.deleteEmergencyData();
            }
          }
        ]
      });
      alert.present();
  }

  deleteEmergencyData(){
      let loading = this.loadingCtrl.create({
        content: 'Deleting Contact'
      });  
      let endValue = "/emergency_contacts/"+this.emergencyData.id;
      loading.present();
      this.storage.get('email').then(val=>{
        this.email = val;
        this.storage.get('auth_token').then(val=>{
          this.auth_token = val;
          this.userService.dataDelete(this.email, this.auth_token, this.profile_id, endValue)
            .subscribe(
              (data) => {
                loading.dismiss();
                console.log("EmergencyData: ", data);
                if(data.success == false){
                  let alert = this.alertCtrl.create({
                    title: "Error", subTitle: "Delete Error", buttons: ['OK']
                  });
                  alert.present();
                  this.navCtrl.pop();
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
        });
      });
    }

  emergencyDataUpdate(){
      let loading = this.loadingCtrl.create();
      let endValue = "/emergency_contacts/"+this.emergencyData.id;
      let relationship;
      if(this.emergencyData.relationship == 'Other'){
        console.log('other', this.other); 
        relationship = this.emergencyData.relationship + ' ' + this.other; 
      }else{
        relationship = this.emergencyData.relationship;
      }
      let body = {"id":this.emergencyData.id, "emergency_contact":
                      { "name": this.emergencyData.name, "relationship": relationship,
                        "phone_number": this.emergencyData.phone_number,"alt_phone_number":this.emergencyData.alt_phone_number,
                        "email":this.emergencyData.email }
                      };
        console.log(body);
        loading.present();
        this.storage.get('email').then(val=>{
          this.email = val;
          this.storage.get('auth_token').then(val=>{
            this.auth_token = val;
            this.userService.dataUpdate(this.email, this.auth_token, this.profile_id, endValue, body)
              .subscribe(
                (data) => {
                  loading.dismiss();
                  console.log("Emergency Data: ", data);
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
          });
      });
    }

  emergencyDataCreate(){
   let loading = this.loadingCtrl.create({
      content: 'Creating Contact'
    });  
    var endValue = "/emergency_contacts";
    let relationship;
    if(this.emergencyData.relationship == 'Other'){
      console.log('other', this.other); 
      relationship = this.emergencyData.relationship + ' ' + this.other; 
    }else{
      relationship = this.emergencyData.relationship;
    }
    var body = {"emergency_contact":
    { "name": this.emergencyData.name, "relationship": relationship,
     "phone_number": this.emergencyData.phone_number,"alt_phone_number":this.emergencyData.alt_phone_number,
      "email":this.emergencyData.email }
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
              console.log("Vital Data: ", data);
              if(data.success == false){
                let alert = this.alertCtrl.create({
                  title: "Error", subTitle: "Created Error", buttons: ['OK']
                });
                alert.present();
              } else{
                let toast = this.toastCtrl.create({
                  message: 'Created Successfully', duration: 2000, position: 'bottom'
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
