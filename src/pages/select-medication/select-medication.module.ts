import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectMedicationPage } from './select-medication';
@NgModule({
    declarations: [
        SelectMedicationPage,
    ],
    imports: [
        IonicPageModule.forChild(SelectMedicationPage),
    ],
    exports: [
        SelectMedicationPage
    ]
})
export class SelectMedicationPageModule {
    
}