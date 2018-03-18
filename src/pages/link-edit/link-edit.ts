import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, AlertController, IonicPage, ViewController } from 'ionic-angular';
import { BarcodeScanner ,BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Storage } from '@ionic/storage';
import { UserService } from "../../providers/user-service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-link-edit',
  templateUrl: 'link-edit.html'
})
export class LinkEditPage {
  linkForm: FormGroup;  
  public profile_id:any;
  scanData : {};
  options :BarcodeScannerOptions;
  public email:any;
  public auth_token:any;
  public link_info:any = { id:"", pin:"", label:"" };
  public id_band_data:any;
  public manu_info:any = {};


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public barcodeScanner: BarcodeScanner,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public userService: UserService,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder
  ) {
    this.profile_id = navParams.get("profile_id");
    this.linkForm = formBuilder.group({
      id: ['', Validators.required],
      pin: ['', Validators.required],
      label: ['', Validators.required],
    });
  }


  ngOnInit(){
    this.storage.get('email').then(val=>{
      this.email = val;
    });

    this.storage.get('auth_token').then(val=>{
      this.auth_token = val;
    });
  }

  presentAlert(title, subTitle) {
    let alert = this.alertCtrl.create({
     title: title, subTitle: subTitle, buttons: ['OK'] });
     alert.present();
   }

  scan(){
    this.options = {
        prompt : "Scan your QR Code."
    }
    this.barcodeScanner.scan(this.options).then((barcodeData) => {

        console.log(barcodeData);
        this.scanData = barcodeData.text;

        let loading = this.loadingCtrl.create();
        loading.present();

        this.userService.checkIdPin(this.email, this.auth_token, this.scanData)
          .subscribe(
            (data) => {
              loading.dismiss();
              if(data.success == false){
                  if (data.error_code == "1003"){
                    this.presentAlert( "Link A MyID Product Save Failed", "There is a problem with this product. Please contact customer support at (888) 500-9720");
                  }
                  else if (data.error_code == "1002"){
                    this.presentAlert( "Link A MyID Product Save Failed", "The product is already linked to " + data.first_name + "'s profile.");
                  }

               }else{
                 console.log("Check ID Pin:" + JSON.stringify(data));
                 this.link_info.id=data.id;
                 this.link_info.pin=data.pin;
                 this.linkToProfile();
               }
            },
            (data) => {
              loading.dismiss();
              this.presentAlert( "Link A MyID Product Save Failed", "There is a problem with this product. Please contact customer support at (888) 500-9720");
            });
    }, (err) => {
        console.log("Error occured : " + err);
    });
  }

  linkToProfile(){
    let loading = this.loadingCtrl.create();
    loading.present();

    this.userService.createIdBands(this.email, this.auth_token, this.profile_id, "", this.link_info.id, this.link_info.pin)
      .subscribe(
        (data) => {
          loading.dismiss();
          if(data.success == false){
            if (data.error_code == "1003"){
              this.presentAlert( "Link A MyID Product Save Failed", "There is a problem with this product. Please contact customer support at (888) 500-9720");
            }
            else if (data.error_code == "1002"){
              this.presentAlert( "Link A MyID Product Save Failed", "The product is already linked to " + data.first_name + "'s profile.");
            }
           }else{
             console.log("Link To Profile:" + JSON.stringify(data));
             this.id_band_data=data;
             console.log('id_band_data', this.id_band_data)

             console.log('go ProductSuccessPage');
             let profileModal = this.modalCtrl.create('ProductSuccessPage',
               { page: 'likeEdit', data: data, profile_id:this.profile_id});
             profileModal.present();

           }

        },
        (data) => {
          console.log("Link To Profile:" + JSON.stringify(data));
          loading.dismiss();
          this.presentAlert( "Link A MyID Product Save Failed", "There is a problem with this product. Please contact customer support at (888) 500-9720");
        });
  }

  createManualLink(){
    console.log('manual');
    let loading = this.loadingCtrl.create();
    loading.present();
    this.userService.createIdBands(this.email, this.auth_token, this.profile_id, this.link_info.label, this.link_info.id, this.link_info.pin)
      .subscribe(
        (data) => {
          loading.dismiss();
          console.log(data);
          if(data.success == false){
            if (data.error_code == "1003"){
              this.presentAlert( "Link A MyID Product Save Failed", "There is a problem with this product. Please contact customer support at (888) 500-9720");
            }
            else if (data.error_code == "1002"){
              this.presentAlert( "Link A MyID Product Save Failed", "The product is already linked to " + data.first_name + "'s profile.");
            }
           }else{
             this.id_band_data=data;
             console.log('id_band_data', this.id_band_data);
             this.viewCtrl.dismiss({ data: 'success' });
           }
        },
        (data) => {
          console.log("Link To Profile:" + JSON.stringify(data));
          loading.dismiss();
          this.presentAlert( "Link A MyID Product Save Failed", "There is a problem with this product. Please contact customer support at (888) 500-9720");
        });
  }

  cancel(){
    this.navCtrl.pop();
  }


}
