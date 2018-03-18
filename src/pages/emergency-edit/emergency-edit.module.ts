import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmergencyEditPage } from './emergency-edit';

@NgModule({
  declarations: [
    EmergencyEditPage,
  ],
  imports: [
    IonicPageModule.forChild(EmergencyEditPage),
  ],
  exports: [
    EmergencyEditPage
  ]
})
export class EmergencyEditPageModule {
    
}