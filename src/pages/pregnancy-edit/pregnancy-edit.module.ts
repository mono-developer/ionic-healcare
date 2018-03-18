import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PregnancyEditPage } from './pregnancy-edit';
@NgModule({
    declarations: [
        PregnancyEditPage,    ],
    imports: [
        IonicPageModule.forChild(PregnancyEditPage),
    ],
    exports: [
        PregnancyEditPage
    ]
})
export class PregnancyEditPageModule {
    
}