import { Component, Input } from '@angular/core';

@Component({
  selector: 'custom-medical',
  template: `<div>{{customType}}</div>`
})
export class CustomTypeComponent {

  @Input() realType:any;
  customType: string='';

  ngOnInit(){
    let type = this.realType.split('Other ');
    if(type[1]){
      this.customType = type[1]
    } else {
      this.customType = this.realType;
    }
  }

  
}
