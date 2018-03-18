import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MedicalImagingPage } from './medical-imaging';
import { CustomTypeComponent } from './custom-medical';
@NgModule({
    declarations: [
        MedicalImagingPage,
        CustomTypeComponent
    ],
    imports: [
        IonicPageModule.forChild(MedicalImagingPage),
    ],
    exports: [
        MedicalImagingPage,
        CustomTypeComponent
    ]
})
export class MedicalImagingPageModule {
    
}