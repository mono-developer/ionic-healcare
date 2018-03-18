import { identifierModuleUrl } from '@angular/compiler/compiler';
import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { NavController, ViewController, NavParams, AlertController, IonicPage, LoadingController, Platform, ToastController } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser";
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
var parseGooglePlace = require('parse-google-place');

import * as AWS from "aws-sdk/global";
import S3 from "aws-sdk/clients/s3";

import * as _ from 'lodash';
import { fail } from 'assert';

declare var google;
@IonicPage()
@Component({
  selector: 'page-pharmacies-edit',
  templateUrl: 'pharmacies-edit.html'
})
export class PharmaciesEditPage {
  id:string;
  pharmacyForm: FormGroup;
  save:string;
  edit:string;
  pharmaciesData:any = { name: '', phone: '', address1:'', city:'', state:'', zip:'', attach_file_urls:[], is_private: false, visible: true};
  states:any;
  email:string;
  auth_token:string;
  profile_id:string;
  file: any;

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('searchbar', { read: ElementRef }) searchbar: ElementRef;
  addressElement: HTMLInputElement = null;

  listSearch: string = '';
  map: any;
  marker: any;
  loading: any;
  search: boolean = false;
  error: any;

  location:any;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private inAppBrowser: InAppBrowser,
    public geolocation: Geolocation,
    public userService: UserService,
    public formBuilder: FormBuilder,
    public storage: Storage,
    private flagService: Flags,
    public zone: NgZone,
    public platform: Platform,
  ) {
      this.platform.ready().then(() => this.loadData());
      // this.platform.ready().then(() => this.loadMaps());
      this.save = navParams.get("save");
      this.edit = navParams.get("edit");
      this.profile_id = navParams.get("profile_id");
      if(this.edit){
        this.id = navParams.get("id");
      }

      this.storage.get('email').then(val=>{
        this.email = val;
        });
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        });

      this.states = [
        { name:'Private',value_string: 'true'},
        { name:'Public', value_string: 'false'} ];

        this.pharmacyForm = formBuilder.group({
          name: ['', Validators.required],
          phone: ['', Validators.required],
          address1: [''],
          city: [''],
          state:[''],
          zip:[''],
          is_private:['']
        });
    }

    loadData(){
      if(this.edit){
        this.getParamacyData();
      }else{
        this.loadMaps();
      }
    }

    getParamacyData(){
      let loading = this.loadingCtrl.create();
      var endValue = "/pharmacies/" + this.id;
      this.storage.get('email').then(val=>{
        this.email = val;
        this.storage.get('auth_token').then(val=>{
          this.auth_token = val;
          loading.present();
          this.userService.dataGet(this.email, this.auth_token, this.profile_id, endValue)
            .subscribe(
              (data) => {
                loading.dismiss();
                console.log("Pharmacy Data", data);
                if(data.success == false){
                  let alert = this.alertCtrl.create({
                    title: "Error", subTitle: "Get Data Error", buttons: ['OK']
                  });
                  alert.present();
                } else{
                  this.pharmaciesData = data.pharmacy;
                  this.pharmaciesData.visible = !this.pharmaciesData.is_private;
                  this.initializeMap( Number(this.pharmaciesData.latitude), Number(this.pharmaciesData.longitude));
                  this.oldMaker( Number(this.pharmaciesData.latitude), Number(this.pharmaciesData.longitude));
                  this.initAutocomplete();
                }
            });
          });
        });
      }

      // ionViewDidEnter(){
      //   if(this.pharmaciesData){
      //     this.initializeMap(this.pharmaciesData.latitude, this.pharmaciesData.longitude);
      //   }else{
      //     this.loadMaps();
      //   }
      // }

    loadMaps() {
      console.log('google', google);
      if (!!google) {
        console.log('google');
        // this.initializeMap();
        this.getCurrentPosition();
        this.initAutocomplete();
      } else {
        console.log('error');
        this.errorAlert('Error', 'Something went wrong with the Internet Connection. Please check your Internet.')
      }
    }

    errorAlert(title, message) {
      let alert = this.alertCtrl.create({
        title: title,
        message: message,
        buttons: [
          {
            text: 'OK',
            handler: data => {
              this.loadMaps();
            }
          }
        ]
      });
      alert.present();
    }

    mapsSearchBar(ev: any) {

      console.log('ev', ev);
      const autocomplete = new google.maps.places.Autocomplete(ev);
      autocomplete.bindTo('bounds', this.map);
      return new Observable((sub: any) => {
        google.maps.event.addListener(autocomplete, 'place_changed', () => {
          const place = autocomplete.getPlace();
          // console.log('place', place);
          if (!place.geometry) {
            sub.error({
              message: 'Autocomplete returned place with no geometry'
            });
          } else {
            sub.next(place.geometry.location);
            sub.complete();
          }
        });
      });
    }

    initAutocomplete(): void {
      // reference : https://github.com/driftyco/ionic/issues/7223
      console.log('initAutocmplete');
      this.addressElement = this.searchbar.nativeElement.querySelector('.searchbar-input');
      this.createAutocomplete(this.addressElement).subscribe((location) => {

        // console.log('SearchData', location.coords)
        let options = {
          center: location,
          zoom: 16
        };
        this.map.setOptions(options);

        this.addMarker(location, "Mein gesuchter Standort");
      });
    }

    createAutocomplete(addressEl: HTMLInputElement): Observable<any> {
        const autocomplete = new google.maps.places.Autocomplete(addressEl);
        // console.log('addressEl', addressEl);
        // autocomplete.bindTo('bounds', this.map);
        return new Observable((sub: any) => {
          google.maps.event.addListener(autocomplete, 'place_changed', () => {
            const place = autocomplete.getPlace();
            const parsedPlace = parseGooglePlace(place);
            this.pharmaciesData.name = place.name;
            this.pharmaciesData.phone = place.international_phone_number || "";
            this.pharmaciesData.address1 =  parsedPlace.address;
            this.pharmaciesData.zip = parsedPlace.zipCode;
            this.pharmaciesData.state = parsedPlace.stateLong;
            this.pharmaciesData.city = parsedPlace.city;

            if (!place.geometry) {
              sub.error({
                message: 'Autocomplete returned place with no geometry'
              });
            } else {
              this.pharmaciesData.latitude = place.geometry.location.lat();
              this.pharmaciesData.longitude = place.geometry.location.lng();
              this.initializeMap(this.pharmaciesData.latitude, this.pharmaciesData.longitude);
              sub.next(place.geometry.location);
            }
          });
        });
      }

    initializeMap(lat, lng) {
        this.zone.run(() => {
          var mapEle = this.mapElement.nativeElement;
          let latLng = new google.maps.LatLng(lat, lng);
          this.map = new google.maps.Map(mapEle, {
            zoom: 16,
            center: { lat: lat, lng: lng },
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: [
            { "featureType": "water", "elementType": "geometry", "stylers": [
              { "color": "#e9e9e9" },
              { "lightness": 17 }]
            },
            { "featureType": "landscape", "elementType": "geometry", "stylers": [
              { "color": "#f5f5f5" },
              { "lightness": 20 }]
            },
            { "featureType": "road.highway", "elementType": "geometry.fill", "stylers":[
              { "color": "#ffffff" },
              { "lightness": 17 }]
            },
            { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [
              { "color": "#ffffff" },
              { "lightness": 29 },
              { "weight": 0.2 }]
            },
            { "featureType": "road.arterial", "elementType": "geometry", "stylers": [
              { "color": "#ffffff" },
              { "lightness": 18 }]
            },
            { "featureType": "road.local", "elementType": "geometry", "stylers": [
              { "color": "#ffffff" },
              { "lightness": 16 }]
            },
            { "featureType": "poi", "elementType": "geometry", "stylers": [
              { "color": "#f5f5f5" },
              { "lightness": 21 }]
            },
            { "featureType": "poi.park", "elementType": "geometry", "stylers": [
              { "color": "#dedede" },
              { "lightness": 21 }]
            },
            { "elementType": "labels.text.stroke", "stylers": [
              { "visibility": "on" },
              { "color": "#ffffff" },
              { "lightness": 16 }]
            },
            { "elementType": "labels.text.fill", "stylers": [
              { "saturation": 36 },
              { "color": "#333333" },
              { "lightness": 40 }]
            },
            { "elementType": "labels.icon", "stylers": [
              { "visibility": "off" }]
            },
            { "featureType": "transit", "elementType": "geometry", "stylers": [
              { "color": "#f2f2f2" },
              { "lightness": 19 }]
            },
            { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [
              { "color": "#fefefe" },
              { "lightness": 20 }]
            },
            { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [
              { "color": "#fefefe" },
              { "lightness": 17 },
              { "weight": 1.2 }]
            }],

            disableDoubleClickZoom: false,
            disableDefaultUI: true,
            zoomControl: true,
            scaleControl: true,
          });
        });

    }

    showToast(message) {
      let toast = this.toastCtrl.create({
        message: message,
        duration: 3000
      });
      toast.present();
    }

  getCurrentPosition() {
    console.log('getCurrentPosition');
    this.loading = this.loadingCtrl.create({
      content: 'Searching Location ...'
    });
    this.loading.present();

    let locationOptions = { timeout: 10000, enableHighAccuracy: true };

    this.geolocation.getCurrentPosition(locationOptions).then(
      (position) => {
        this.loading.dismiss().then(() => {

          this.showToast('Location found!');

          console.log(position.coords.latitude, position.coords.longitude);
          let lat = position.coords.latitude;
          let lng = position.coords.longitude;
          this.initializeMap(lat, lng);

        });
      },
      (error) => {
        this.loading.dismiss().then(() => {
          this.showToast('Location not found. Please enable your GPS!');

          console.log(error);
        });
      }
    )
  }

  addMarker(position, content) {
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: position
      });

      this.addInfoWindow(marker, content);
      return marker;
    }

  oldMaker(lat, lng){
    let latLng = new google.maps.LatLng(lat, lng);
    let content = this.pharmaciesData.address1;
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng,
    });

    this.addInfoWindow(marker, content);
    return marker;

  }

  addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
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
          that.pharmaciesData.attach_file_urls.push(newAttach);
      });
  }

  deleteItem(i){
    this.pharmaciesData.attach_file_urls.splice(i, 1);
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
            this.deletePharmaciesData();
            }
          }
        ]
      });
      alert.present();
  }

  deletePharmaciesData(){
    console.log('deleteVitalData');
    let loading = this.loadingCtrl.create();
    let endValue = "/pharmacies/" + this.id;
    loading.present();
    this.userService.dataDelete(this.email, this.auth_token, this.profile_id, endValue)
      .subscribe(
        (data) => {
          loading.dismiss();
          console.log("Pharmacy Data: ", data);
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

    updatePharmaciesData(){
      let loading = this.loadingCtrl.create();
      var endValue = "/pharmacies/" + this.id;

      let newBody = _.cloneDeep(this.pharmaciesData);
      newBody.is_private = (!this.pharmaciesData.visible).toString();
      let body = { "id": this.id, "pharmacy": this.getBody(newBody) }
      console.log(body);
      loading.present();
      this.userService.dataUpdate(this.email, this.auth_token, this.profile_id, endValue, body)
      .subscribe(
        (data) => {
          loading.dismiss();
          console.log("pharmacies Data: ", data);
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

    createPharmaciesData(){
      let loading = this.loadingCtrl.create();
      var endValue = "/pharmacies";
      let newBody = _.cloneDeep(this.pharmaciesData);
      newBody.is_private = (!this.pharmaciesData.visible).toString();
      newBody.visible = null;
      if(newBody.latitude != undefined) {
        newBody.latitude = newBody.latitude.toString();
        newBody.longitude = newBody.longitude.toString();
      }

      let body = this.getBody(newBody);
      console.log(body);
      loading.present();
      this.userService.dataCreate(this.email, this.auth_token, this.profile_id, endValue, body)
        .subscribe(
          (data) => {
            console.log('data', data);
            loading.dismiss();
            if(data.success == false){
              let alert = this.alertCtrl.create({
                title: "Error", subTitle: "Created Error", buttons: ['OK']
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
