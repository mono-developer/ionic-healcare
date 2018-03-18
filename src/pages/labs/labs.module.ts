import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LabsPage } from './labs';
@NgModule({
    declarations: [
        LabsPage,
    ],
    imports: [
        IonicPageModule.forChild(LabsPage),
    ],
    exports: [
        LabsPage
    ]
})
export class LabsPageModule {

}