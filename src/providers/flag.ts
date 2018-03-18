import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Flags {

  public changedFlag: boolean = false;
  constructor() {
  }
  setChangedFlag(flag){
    this.changedFlag = flag;
  }

  getChangedFlag(){
    return this.changedFlag;
  }


}
