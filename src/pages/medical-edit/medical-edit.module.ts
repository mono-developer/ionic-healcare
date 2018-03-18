import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MedicalEditPage } from './medical-edit';
@NgModule({
    declarations: [
        MedicalEditPage,
    ],
    imports: [
        IonicPageModule.forChild(MedicalEditPage),
    ],
    exports: [
        MedicalEditPage
    ]
})
export class MedicalEditPageModule {
    
}