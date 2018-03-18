import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllergiesPage } from './allergies';

@NgModule({
  declarations: [
    AllergiesPage,
  ],
  imports: [
    IonicPageModule.forChild(AllergiesPage),
  ],
  exports: [
    AllergiesPage
  ]
})
export class AllergiesPageModule {
    
}