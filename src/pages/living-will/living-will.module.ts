import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LivingWillPage } from './living-will';
@NgModule({
    declarations: [
        LivingWillPage,
    ],
    imports: [
        IonicPageModule.forChild(LivingWillPage),
    ],
    exports: [
        LivingWillPage
    ]
})
export class LabsPageModule {

}