import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the BaseService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class BaseService {

  // public baseUrl = "http://beta.myidband.com/api/v5/";
  public baseUrl = "https://www.getmyid.com/api/v5/";
  public loginUrl = this.baseUrl + "auth/sign_in";
  public signupUrl = this.baseUrl + "auth/sign_up";
  public forgotUrl = this.baseUrl + "auth/forgot_password";
  public updateUrl =  this.baseUrl + "auth/update_info";
  public cancelUrl = this.baseUrl + "auth/cancel_account";
  public getProfilesUrl = this.baseUrl + "profiles";
  public createProfileUrl = this.baseUrl + "profiles";
  public getDataUrl = this.baseUrl+"profiles/";
  public getAutocompleteUrl = this.baseUrl+"autocompletes";
  public getSharesUrl = this.baseUrl+"shares";
  public checkIdUrl = this.baseUrl + "main/check_id_pin";

  constructor(public http: Http) {
    console.log('Hello BaseService Provider');
  }


}
