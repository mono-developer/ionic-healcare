import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InsuranceInfoPage } from './insurance-info';
@NgModule({
    declarations: [
        InsuranceInfoPage,
    ],
    imports: [
        IonicPageModule.forChild(InsuranceInfoPage),
    ],
    exports: [
        InsuranceInfoPage
    ]
})
export class PhysiciansEditPageModule {

}