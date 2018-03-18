import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VitalEditPage } from './vital-edit';
import { AutoCompleteModule } from 'ionic2-auto-complete';
@NgModule({
  declarations: [
    VitalEditPage,
  ],
  imports: [
    AutoCompleteModule,
    IonicPageModule.forChild(VitalEditPage),
  ],
  exports: [
    VitalEditPage
  ]
})
export class VitalEditPageModule {
}