import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { SwiperModule } from 'angular2-useful-swiper';
@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    SwiperModule,
    IonicPageModule.forChild(ProfilePage),
  ],
  exports: [
    ProfilePage
  ]
})
export class ProfilePageModule {}