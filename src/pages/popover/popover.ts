import { Component } from '@angular/core';
import { ViewController, AlertController, LoadingController, NavParams, IonicPage} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserService } from "../../providers/user-service";
import * as AWS from "aws-sdk/global";
import S3 from "aws-sdk/clients/s3";
@IonicPage()
@Component({
  selector: 'page-popover',
   templateUrl: 'popover.html'
})
export class PopoverContentPage {

  public folder_name:any;
  public email:any;
  public auth_token:any;
  public profile_id:any;
  public parent_id:any;
  public filename:any;
  myfile:any;
  file:any;
  public sort_flag:string;
  // static get parameters() {
  //   return [[ViewController],[AlertController],[LoadingController],[Storage], [UserService], [NavParams]];
  // }

  constructor(
    public viewCtrl: ViewController,
    public navParams:NavParams,
    public alertCtrl:AlertController,
    public loadingCtrl:LoadingController,
    public storage:Storage,
    public userService:UserService,
    ){
      this.profile_id = navParams.get('profile_id');
      this.parent_id = navParams.get('parent_id');
      this.sort_flag = navParams.get('sort_flag');

      console.log(this.profile_id + this.parent_id+ this.sort_flag)

  }

  close() {
    this.viewCtrl.dismiss();
  }

  select(){
    this.viewCtrl.dismiss('1');
  }

  createFolderName(){
    let prompt = this.alertCtrl.create({
      title: 'Create Folder',
      message: "",
      inputs: [
        {
          name: 'folder_name',
          placeholder: '–'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            console.log('Saved clicked');
            this.folder_name = data.folder_name;
            this.createFolder();
          }
        }
      ]
    });
    prompt.present();
  }

  createFolder(){
      console.log('parent_id:' + this.parent_id + " name:" + this.folder_name);

      let loading = this.loadingCtrl.create();
      loading.present();

      this.storage.get('email').then(val=>{
        this.email = val;
        this.storage.get('auth_token').then(val=>{
          this.auth_token = val;
          this.userService.createFolder(this.email, this.auth_token, this.profile_id, this.folder_name, this.parent_id)
            .subscribe(
              (data) => {
                loading.dismiss();
                this.viewCtrl.dismiss();
                if(data.success == false){
                  console.log("get Documents:" + JSON.stringify(data));
               }else{
                 console.log("get Documents:" + JSON.stringify(data));
               }
              },
              (data) => {
                loading.dismiss();
                this.viewCtrl.dismiss();
              });
        });
      });

  }

  fileEvent(event){
      var files = event.target.files;
      var file = files[0];
      this.file = file;
      this.filename = this.file.name;
      console.log("this.file:" + JSON.stringify(this.filename));
      AWS.config.accessKeyId = 'AKIAIPQAVOWPUIP2ENSA';
      AWS.config.secretAccessKey = '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';
      var s3 = new S3({
            region: 'us-west-2',
            apiVersion: '2006-03-01',
            params: {Bucket: 'myidband-images'}
        });

      // let bucket = new S3({params: {Bucket: 'YOUR-BUCKET-NAME'}});
      // let params = {BucketName: 'YOUR-BUCKET-NAME', Key: this.file.name, Body: this.file};

      var params = {Bucket: 'myidband-images', Key: 'production/tmp_files/'+ this.file.name, Body: this.file, ContentType: this.file.type, ACL: 'public-read'};
      let that = this;
      let loading = this.loadingCtrl.create();
      loading.present();
      s3.upload(params, function (err, data) {
          loading.dismiss();
          console.log("data: " + JSON.stringify(data) + "err: " + JSON.stringify(err));
          that.uploadFile1(that.filename, data.Location, that.parent_id);
      });

  }

  uploadFile1(filename, url, folder_id){
    let loading = this.loadingCtrl.create();
    loading.present();

    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;

        this.userService.uploadFile(this.email, this.auth_token, this.profile_id, filename, url, folder_id)
          .subscribe(
            (data) => {
              loading.dismiss();
              this.viewCtrl.dismiss();
              if(data.success == false){
                console.log("get Documents:" + JSON.stringify(data));
             }else{
               console.log("get Documents:" + JSON.stringify(data));
             }
            },
            (data) => {
              this.viewCtrl.dismiss();
              loading.dismiss();
            });
      });
    });
  }
}
