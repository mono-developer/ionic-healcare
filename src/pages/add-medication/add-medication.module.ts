import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddMedicationPage } from './add-medication';
import { MultiPickerModule } from 'ion-multi-picker';
import { AutoCompleteModule } from 'ionic2-auto-complete';
// import { AutoCompleteModule } from "ionic2-atuo-complete";

@NgModule({
    declarations: [
        AddMedicationPage,
    ],
    imports: [
        MultiPickerModule,
        AutoCompleteModule,
        IonicPageModule.forChild(AddMedicationPage),
    ],
    exports: [
        AddMedicationPage
    ]
})
export class AddMedicationPageModule {
    
}