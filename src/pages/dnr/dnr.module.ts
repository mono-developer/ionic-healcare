import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DNRPage } from './dnr';
@NgModule({
    declarations: [
        DNRPage,
    ],
    imports: [
        IonicPageModule.forChild(DNRPage),
    ],
    exports: [
        DNRPage
    ]
})
export class DNRPageModule {

}