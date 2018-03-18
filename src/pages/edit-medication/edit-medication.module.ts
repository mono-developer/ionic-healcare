import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditMedicationPage } from './edit-medication';
import { MultiPickerModule } from 'ion-multi-picker';

@NgModule({
    declarations: [
        EditMedicationPage,
    ],
    imports: [
        MultiPickerModule,
        IonicPageModule.forChild(EditMedicationPage),
    ],
    exports: [
        EditMedicationPage
    ]
})
export class EditMedicationPageModule {
    
}