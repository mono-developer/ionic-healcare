import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VitalMedicalPage } from './vital-medical';

@NgModule({
  declarations: [
    VitalMedicalPage,
  ],
  imports: [
    IonicPageModule.forChild(VitalMedicalPage),
  ],
  exports: [
    VitalMedicalPage
  ]
})
export class VitalMedicalPageModule {}