// import { HttpClient } from '@angular/common/http';
import { Injectable, ViewChild } from '@angular/core';
import { AutoCompleteService } from 'ionic2-auto-complete';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map'
import { BaseService } from "./base-service";
import { UserService } from './user-service';
import { Observable } from 'rxjs';

import { NavController, App } from 'ionic-angular';

// import { UserService } from "../../providers/user-service";

/*
  Generated class for the AutocompleteServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()

export class CompleteTestService implements AutoCompleteService {
  labelAttribute: string;
  auth_token: any;
  email: any;
  type: any;
  page_name: any;
  private navCtrl: NavController;
  parseItem?(item: any) {
    throw new Error("Method not implemented.");
  }

  constructor(private http: Http, public userService: UserService,
    protected app: App,
    public storage: Storage, public baseService: BaseService) {
    console.log('Hello AutocompleteServiceProvider Provider');
    this.navCtrl = app.getActiveNav();
    console.log("this.navCtrl.getActive().name: ", this.navCtrl.getActive().name)
  }

  getResults(keyword: string) {
    var autocopmlite = [];
    var t = this;
    // return this.http.get("https://restcountries.eu/rest/v1/name/"+keyword)
    this.storage.get('auth_token').then(val => {
      this.auth_token = val;

      this.storage.get('email').then(val => {
        this.email = val;

        this.storage.get('active_page').then(val => {
          this.page_name = val;
          console.log("this.page_name", this.page_name)
          if (this.page_name == "MedicationsPage") {
            this.type = 1;
          } if (this.page_name == "InsuranceInfoPage") {
            // InsuranceInfoPage
            this.type = 2;
          } if (this.page_name == "AllergiesPage") {
            this.type = 3;
          } if (this.page_name == "PhysiciansPage") {
            this.type = 4;
          } if (this.page_name == "VitalMedicalPage") {
            this.type = 5;
          }
          // if (this.navCtrl.getActive().component.name == "MedicationsPage" || this.navCtrl.getActive().component.name == "AddMedicationPage") {
          //   this.type = 1;
          // } if (this.navCtrl.getActive().component.name == "InsuranceInfoPage" || this.navCtrl.getActive().component.name == "InsuranceEditPage") {
          //   // InsuranceInfoPage
          //   this.type = 2;
          // } if (this.navCtrl.getActive().component.name == "AllergiesPage" || this.navCtrl.getActive().component.name == "AllergiesEditPage") {

          //   this.type = 3;
          // } if (this.navCtrl.getActive().component.name == "PhysiciansPage" || this.navCtrl.getActive().component.name == "PhysiciansEditPage") {
          //   this.type = 4;
          // } if (this.navCtrl.getActive().component.name == "VitalMedicalPage" || this.navCtrl.getActive().component.name == "VitalEditPage") {
          //   this.type = 5;
          // }
          console.log("this.email ", this.navCtrl.getActive().name, this.type)
          // this.userService.getAutocompliteData(this.auth_token, this.email, term, keyword);
          // https://www.getmyid.com/api/v5/autocompletes?auth_token=wYTFukLuYfiLxJbenqzZ&email=dev1plus@fliptechdev.com&term=AETNA&type=2
          // this.userService.getPersonalProfiles(this.auth_token, this.email, profile_id)
          this.http.get(this.baseService.getAutocompleteUrl + "?auth_token=" + this.auth_token + "&email=" + this.email + "&type=" + this.type + "&term=" + keyword)
            .subscribe(
            (data) => {
              var dataJson = data.json();
              for (var i = 0, len = dataJson.terms.length; i < len; i++) {
                autocopmlite.push(dataJson.terms[i].data);
              }
            })
          // (res: Response) => res.json())
          // .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
        })
      })
    })
    return autocopmlite;
    // return this.http.get(this.baseService.getAutocompleteUrl + "?auth_token=" + this.auth_token + "&email=" + this.email + "&type=" + this.type + "&term=" + keyword)
    //   .map(
    //   result => {
    //     console.log("./././././", result);
    //   })
  }


  // var url = this.baseService.getAutocompleteUrl + "?auth_token=" + this.auth_token + "&type=" + 1 + "&term=" + keyword;
  // return this.http.get(url)
  //   .map(
  //   result => {
  //     console.log("./././././", result)
  //     // var abc=['india',"indigo", "indiaca"]
  //     //   return abc
  //     // var abc= result.json()
  //     //   .filter(item => item.name.toLowerCase().startsWith(keyword.toLowerCase()) )
  //     // console.log("./././././", abc);

  //   });
}

// }
