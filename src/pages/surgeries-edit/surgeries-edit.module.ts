import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SurgeriesEditPage } from './surgeries-edit';
@NgModule({
    declarations: [
        SurgeriesEditPage,
    ],
    imports: [
        IonicPageModule.forChild(SurgeriesEditPage),
    ],
    exports: [
        SurgeriesEditPage
    ]
})
export class SurgeriesEditPageModule {

}