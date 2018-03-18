import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { BaseService } from "./base-service";
import { Observable } from 'rxjs';

/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserService {

  constructor(public http: Http, public baseService: BaseService) {
  }

  login(username, password) {
    let body = { email: username, password: password, type: 'ios' };
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.baseService.loginUrl, JSON.stringify(body), options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  forgot(email) {
    let body = { email: email };
    console.log(body);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.baseService.forgotUrl, JSON.stringify(body), options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
  signup(email, password, pw_confirm) {
    let body = {
      user:
        {
          email: email,
          password: password,
          password_confirmation: pw_confirm
        }
    }
    console.log(body);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.baseService.signupUrl, JSON.stringify(body), options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateInfo(email, auth_token, body) {
    let headers = new Headers({ 'Content-Type': 'application/json', 'auth_token': auth_token, 'email': email });
    let options = new RequestOptions({ headers: headers });
    console.log(JSON.stringify(body) + " " + JSON.stringify(headers) + " " + this.baseService.updateUrl);
    return this.http.put(this.baseService.updateUrl, JSON.stringify(body), options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
  cancelAccount(email, auth_token) {
    let headers = new Headers({ 'Content-Type': 'application/json', 'auth_token': auth_token, 'email': email });
    let options = new RequestOptions({ headers: headers });
    return this.http.delete(this.baseService.cancelUrl, options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
  getPersonalProfiles(auth_token, email, profile_id) {
    let headers = new Headers({ 'Content-Type': 'application/json', 'auth_token': auth_token, 'email': email });
    console.log(JSON.stringify(headers) + "headers");
    console.log(auth_token + profile_id);
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this.baseService.getProfilesUrl + "/" + profile_id, options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getProfiles(email, auth_token) {
    let headers = new Headers({ 'Content-Type': 'application/json', 'auth_token': auth_token, 'email': email });
    console.log(JSON.stringify(headers) + "headers");
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this.baseService.getProfilesUrl, options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteProfile(auth_token, email, id) {
    let headers = new Headers({ 'Content-Type': 'application/json', 'auth_token': auth_token, 'email': email });
    let options = new RequestOptions({ headers: headers });
    var main_url = this.baseService.getDataUrl + id;
    console.log(main_url);
    return this.http.delete(main_url, options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  createProfiles(email, auth_token, first_name, last_name, gender, birth_date, city, state, zip, country) {

    let body = {
      profile:
        {
          first_name: first_name,
          last_name: last_name,
          gender: gender,
          birth_date: birth_date,
          city: city,
          state: state,
          zip: zip,
          country: country
        }
    }
    console.log("body:" + JSON.stringify(body));
    let headers = new Headers({ 'Content-Type': 'application/json', 'auth_token': auth_token, 'email': email });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.baseService.createProfileUrl, JSON.stringify(body), options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  dataGet(email, auth_token, id, endpoint) {
    let headers = new Headers({ 'Content-Type': 'application/json', 'auth_token': auth_token, 'email': email });
    let main_URL = this.baseService.getDataUrl + id + endpoint;
    console.log(main_URL);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(main_URL, options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  dataCreate(email, auth_token, id, endpoint, body) {
    let headers = new Headers({ 'Content-Type': 'application/json', 'auth_token': auth_token, 'email': email });
    let main_URL = this.baseService.getDataUrl + id + endpoint;
    console.log(main_URL);
    console.log(body);
    let options = new RequestOptions({ headers: headers });
    return this.http.post(main_URL, JSON.stringify(body), options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  dataUpdate(email, auth_token, id, endpoint, body) {
    let headers = new Headers({ 'Content-Type': 'application/json', 'auth_token': auth_token, 'email': email });
    let main_URL = this.baseService.getDataUrl + id + endpoint;
    console.log(main_URL);
    console.log(body);
    let options = new RequestOptions({ headers: headers });
    return this.http.put(main_URL, JSON.stringify(body), options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  dataDelete(email, auth_token, id, endpoint) {
    let headers = new Headers({ 'Content-Type': 'application/json', 'auth_token': auth_token, 'email': email });
    let main_URL = this.baseService.getDataUrl + id + endpoint;
    console.log(main_URL);
    let options = new RequestOptions({ headers: headers });
    return this.http.delete(main_URL, options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getShares(email, auth_token) {
    let headers = new Headers({ 'Content-Type': 'application/json', 'auth_token': auth_token, 'email': email });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.baseService.getSharesUrl, options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getDocuments(email, auth_token, id, slug) {
    let headers = new Headers({ 'Content-Type': 'application/json', 'auth_token': auth_token, 'email': email });
    let main_URL;
    if (slug == undefined || slug == "") {
      main_URL = this.baseService.getDataUrl + id + '/load_documents_folders';
    }
    else {
      main_URL = this.baseService.getDataUrl + id + '/load_documents_folders?slug=' + slug;
    }

    console.log(main_URL);
    let options = new RequestOptions({ headers: headers });

    return this.http.get(main_URL, options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  checkIdPin(email, auth_token, url) {
    let body = {
      encoded_url: url
    }
    let headers = new Headers({ 'Content-Type': 'application/json', 'auth_token': auth_token, 'email': email });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.baseService.checkIdUrl, JSON.stringify(body), options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  createIdBands(email, auth_token, profile_id, name, serial, pin) {
    let body = {
      id_band: {
        name: name,
        serial: serial,
        pin: pin
      }
    }
    console.log('id_bands', body)
    let headers = new Headers({ 'Content-Type': 'application/json', 'auth_token': auth_token, 'email': email });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.baseService.baseUrl + "profiles/" + profile_id + "/id_bands", JSON.stringify(body), options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateIdBands(email, auth_token, profile_id, name, id) {
    let body = {
      id_band: {
        name: name
      }
    }
    let headers = new Headers({ 'Content-Type': 'application/json', 'auth_token': auth_token, 'email': email });
    let options = new RequestOptions({ headers: headers });
    return this.http.put(this.baseService.baseUrl + "profiles/" + profile_id + "/id_bands/" + id, JSON.stringify(body), options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteIdBands(email, auth_token, profile_id, id) {
    let headers = new Headers({ 'Content-Type': 'application/json', 'auth_token': auth_token, 'email': email });
    let options = new RequestOptions({ headers: headers });
    return this.http.delete(this.baseService.baseUrl + "profiles/" + profile_id + "/id_bands/" + id, options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }


  ShareProfile(email, auth_token, body) {

    let headers = new Headers({ 'Content-Type': 'application/json', 'auth_token': auth_token, 'email': email });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.baseService.getSharesUrl, JSON.stringify(body), options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  ShareSetPass(email, auth_token, id, body) {

    let headers = new Headers({ 'Content-Type': 'application/json', 'auth_token': auth_token, 'email': email });
    let options = new RequestOptions({ headers: headers });
    console.log(this.baseService.getSharesUrl + '/' + id);
    return this.http.put(this.baseService.getSharesUrl + '/' + id, JSON.stringify(body), options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteShares(email, auth_token, id) {
    let headers = new Headers({ 'Content-Type': 'application/json', 'auth_token': auth_token, 'email': email });
    let main_URL = this.baseService.getSharesUrl + "/" + id;
    console.log(main_URL);
    let options = new RequestOptions({ headers: headers });
    return this.http.delete(main_URL, options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  createFolder(email, auth_token, profile_id, folder_name, parent_id) {
    let body;
    if (parent_id == undefined || parent_id == "") {
      body = {
        'profile_id': profile_id.toString(),
        'folder': {
          'name': folder_name
        }
      }
    }
    else {
      body = {
        'profile_id': profile_id.toString(),
        'folder': {
          'name': folder_name,
          'parent_id': parent_id.toString()
        }
      }
    }
    console.log(JSON.stringify(body) + "   " + this.baseService.createProfileUrl + '/' + profile_id + '/folders' + '   ');
    let headers = new Headers({ 'auth_token': auth_token, 'email': email, 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.baseService.createProfileUrl + '/' + profile_id + '/folders', JSON.stringify(body), options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  uploadFile(email, auth_token, profile_id, filename, url, folder_id) {
    let body;
    if (folder_id == undefined || folder_id == "") {
      body = {
        'profile_id': profile_id.toString(),
        'file_name': filename,
        'file_url': url
      }
    }
    else {
      body = {
        'profile_id': profile_id.toString(),
        'folder_id': folder_id.toString(),
        'file_name': filename,
        'file_url': url
      }
    }

    console.log(JSON.stringify(body) + "   " + this.baseService.createProfileUrl + '/' + profile_id + '/documents');
    let headers = new Headers({ 'auth_token': auth_token, 'email': email, 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.baseService.createProfileUrl + '/' + profile_id + '/documents', JSON.stringify(body), options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteDocuments(email, auth_token, profile_id, selected_ids) {
    let body = {
      profile_id: profile_id.toString(),
      document_ids: selected_ids
    }

    let headers = new Headers({ 'auth_token': auth_token, 'email': email, 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.baseService.createProfileUrl + '/' + profile_id + '/documents/delete_documents', JSON.stringify(body), options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  renameFolder(email, auth_token, profile_id, id, name) {

    let body = {
      'profile_id': profile_id.toString(),
      'id': id.toString(),
      'folder': { 'name': name }
    }
    console.log(body);

    let headers = new Headers({ 'auth_token': auth_token, 'email': email, 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    console.log(this.baseService.createProfileUrl + '/' + profile_id + '/folders/' + id);

    return this.http.put(this.baseService.createProfileUrl + '/' + profile_id + '/folders/' + id, JSON.stringify(body), options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  renameDocument(email, auth_token, profile_id, id, name) {

    let body = {
      'profile_id': profile_id.toString(),
      'id': id.toString(),
      'name': name
    }
    console.log(body);

    let headers = new Headers({ 'auth_token': auth_token, 'email': email, 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put(this.baseService.createProfileUrl + '/' + profile_id + '/documents/' + id, JSON.stringify(body), options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  moveFolder(email, auth_token, profile_id, parent_id, id, name) {

    let body = {
      'profile_id': profile_id.toString(),
      'id': id.toString(),
      'folder': {
        'name': name,
        'parent_id': parent_id.toString()
      },

    }
    console.log(body);

    let headers = new Headers({ 'auth_token': auth_token, 'email': email, 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    console.log(this.baseService.createProfileUrl + '/' + profile_id + '/folders/' + id);

    return this.http.put(this.baseService.createProfileUrl + '/' + profile_id + '/folders/' + id, JSON.stringify(body), options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  moveDocument(email, auth_token, profile_id, parent_id, id) {

    let body = {
      'profile_id': profile_id.toString(),
      'id': id.toString(),
      'folder_id': parent_id.toString()
    }
    console.log(body);

    let headers = new Headers({ 'auth_token': auth_token, 'email': email, 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    console.log(this.baseService.createProfileUrl + '/' + profile_id + '/documents/' + id);

    return this.http.put(this.baseService.createProfileUrl + '/' + profile_id + '/documents/' + id, JSON.stringify(body), options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }




  deleteFolders(email, auth_token, profile_id, selected_ids) {
    let body = {
      profile_id: profile_id.toString(),
      folder_ids: selected_ids
    }

    let headers = new Headers({ 'auth_token': auth_token, 'email': email, 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.baseService.createProfileUrl + '/' + profile_id + '/folders/delete_folders', JSON.stringify(body), options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteDocument(email, auth_token, profile_id, selected_ids) {
    let body = {
      profile_id: profile_id.toString(),
      document_ids: selected_ids
    }

    let headers = new Headers({ 'auth_token': auth_token, 'email': email, 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.baseService.createProfileUrl + '/' + profile_id + '/documents/delete_documents', JSON.stringify(body), options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
}
