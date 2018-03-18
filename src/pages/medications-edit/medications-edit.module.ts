import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MedicationsEditPage } from './medications-edit';
@NgModule({
    declarations: [
        MedicationsEditPage,
    ],
    imports: [
        IonicPageModule.forChild(MedicationsEditPage),
    ],
    exports: [
        MedicationsEditPage
    ]
})
export class MedicationsEditPageModule {
    
}