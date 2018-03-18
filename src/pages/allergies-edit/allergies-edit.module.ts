import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllergiesEditPage } from './allergies-edit';
import { AutoCompleteModule } from 'ionic2-auto-complete';

@NgModule({
  declarations: [
    AllergiesEditPage,
  ],
  imports: [
    AutoCompleteModule,
    IonicPageModule.forChild(AllergiesEditPage),
  ],
  exports: [
    AllergiesEditPage
  ]
})
export class AllergiesEditPageModule {
    
}