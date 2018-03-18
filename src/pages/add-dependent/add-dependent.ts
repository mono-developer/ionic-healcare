import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import { Crop } from '@ionic-native/crop';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { UserService } from "../../providers/user-service";
import { BaseService } from "../../providers/base-service";
import { Flags } from "../../providers/flag";
import { CountryService } from '../../providers/country-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-add-dependent',
  templateUrl: 'add-dependent.html'
})
export class AddDependentPage {

  public profile_info: any = {first_name:'', last_name: '', gender:'', birth_date:'', city:'', state:'', country:'', zip:''};
  // public profile_info: any = {};
  dependentForm: FormGroup;  
  public email: string;
  public auth_token: string;
  public imageChosen: any = 0;
  public imagePath: any;
  public imageNewPath: any;
  public genders:any;
  public countries:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl:ViewController,
    public camera: Camera,
    private crop: Crop,
    public actionSheet: ActionSheet,
    public storage:Storage,
    public loadingCtrl:LoadingController,
    public userService:UserService,
    public file:File,
    public baseService:BaseService,
    public fileTransfer: FileTransfer,
    private flagService: Flags,
    public countryService: CountryService,
    public formBuilder: FormBuilder
    
  ) {

      this.genders = [{ title:"Female", value:"female"},
                      { title:"Male", value:"male"} ];
      this.countries = this.countryService.getCountries();

      this.dependentForm = formBuilder.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        gender: ['', Validators.required],
        birth_date: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required],
        zip: ['']
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

  getPicture(){

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
           let options:CameraOptions = {
              destinationType: this.camera.DestinationType.FILE_URI,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            }
            this.camera.getPicture(options).then((imageData) => {
              this.crop.crop(imageData, {quality: 75})
              .then(newImage => {
                console.log('NewImage', newImage);
                this.imagePath = newImage;
                // this.updatePhoto();
                },error=>console.error('Error cropping image', JSON.stringify(error))
              );
             }, (err) => {
              alert(JSON.stringify(err))
             });
 						break;
 					case 2:
             let options1:CameraOptions = {
               destinationType: this.camera.DestinationType.FILE_URI,
               encodingType: this.camera.EncodingType.JPEG,
               sourceType: this.camera.PictureSourceType.CAMERA,
             }
             this.camera.getPicture(options1).then((imageData) => {
              this.crop.crop(imageData, {quality: 75})
                .then(newImage => {
                  console.log('NewImage', newImage);
                  this.imagePath = newImage;
                  // this.updatePhoto();
                },error => console.error('Error cropping image', error)
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

  createProfile(){

    console.log('CreateProfile');

    let loading = this.loadingCtrl.create();
    loading.present();

    if (this.imagePath){

      let filename = this.imagePath.split('/').pop();

      // console.log("filekey: ", profile[image]);
      console.log("fileName: ", filename);
      console.log("imagePath: ", this.imagePath);


      let options = {
        fileKey: "profile[image]",
        fileName: filename,
        chunkedMode: false,
        mimeType: "image/jpg",
        headers:
          {'auth_token': this.auth_token, 'email': this.email}
        ,
        params: {
            'profile[first_name]':this.profile_info.first_name,
            'profile[last_name]':this.profile_info.last_name,
            'profile[gender]':this.profile_info.gender,
            'profile[birth_date]':this.profile_info.birth_date,
            'profile[city]':this.profile_info.city,
            'profile[state]':this.profile_info.state,
            'profile[zip]':this.profile_info.zip,
            'profile[country]':this.profile_info.country
          }
      };

      const fileTransfer: FileTransferObject = this.fileTransfer.create();

      fileTransfer.upload(this.imagePath, this.baseService.createProfileUrl,
        options).then((entry) => {
          this.imagePath = '';
          this.imageChosen = 0;
          loading.dismiss();
          this.flagService.setChangedFlag(true);
          this.navCtrl.pop();
          console.log("success:" + JSON.stringify(entry));
        }, (err) => {
          loading.dismiss();
          console.log("failed:" + JSON.stringify(err));
        });
    }
    else{
      this.userService.createProfiles(this.email, this.auth_token, this.profile_info.first_name, this.profile_info.last_name, this.profile_info.gender, this.profile_info.birth_date,
        this.profile_info.city, this.profile_info.state, this.profile_info.zip, this.profile_info.country)
        .subscribe(
          (data) => {
            loading.dismiss();
            if(data.success == false){
              console.log("create Profiles:" + JSON.stringify(data));
           }else{
             console.log("create Profiles:" + JSON.stringify(data));
             this.flagService.setChangedFlag(true);
             this.navCtrl.pop();
           }
          },
          (data) => {
            loading.dismiss();
            console.log("get Profiles:" + JSON.stringify(data));
          });
    }
  }





  dismiss() {
    this.viewCtrl.dismiss();
  }

}
