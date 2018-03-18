import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LabsEditPage } from './labs-edit';
@NgModule({
    declarations: [
        LabsEditPage,
    ],
    imports: [
        IonicPageModule.forChild(LabsEditPage),
    ],
    exports: [
        LabsEditPage
    ]
})
export class LabsEditPageModule {

}