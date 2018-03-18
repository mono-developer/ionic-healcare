import { Component, Input } from '@angular/core';

@Component({
  selector: 'custom-name',
  template: `<ion-col col-12 class="data-des">{{customName}}</ion-col>`
})
export class CustomNameComponent {

  @Input() realName:any;
  customName: string='';

  ngOnInit(){
    let name = this.realName.split('Other ');
    if(name[1]){
      this.customName = name[1]
    } else {
      this.customName = this.realName;
    }
  }

  
}
