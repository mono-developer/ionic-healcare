import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OtherInfoPage } from './other-info';
@NgModule({
    declarations: [
        OtherInfoPage,
    ],
    imports: [
        IonicPageModule.forChild(OtherInfoPage),
    ],
    exports: [
        OtherInfoPage
    ]
})
export class OtherInfoPageModule {
    
}