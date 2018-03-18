import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PersonalInfoPage } from './personal-info';
import { MultiPickerModule } from 'ion-multi-picker';
@NgModule({
  declarations: [
    PersonalInfoPage,
  ],
  imports: [
    MultiPickerModule,
    IonicPageModule.forChild(PersonalInfoPage),
  ],
  exports: [
    PersonalInfoPage
  ]
})
export class PersonalInfoPageModule {}