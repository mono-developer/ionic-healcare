import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InsuranceEditPage } from './insurance-edit';
import { AutoCompleteModule } from 'ionic2-auto-complete';
@NgModule({
    declarations: [
        InsuranceEditPage,
    ],
    imports: [
        AutoCompleteModule,
        IonicPageModule.forChild(InsuranceEditPage),
    ],
    exports: [
        InsuranceEditPage
    ]
})
export class InsuranceEditPageModule {

}