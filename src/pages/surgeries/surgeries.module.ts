import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SurgeriesPage } from './surgeries';
@NgModule({
    declarations: [
        SurgeriesPage,
    ],
    imports: [
        IonicPageModule.forChild(SurgeriesPage),
    ],
    exports: [
        SurgeriesPage
    ]
})
export class SurgeriesPageModule {

}