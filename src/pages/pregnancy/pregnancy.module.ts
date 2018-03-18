import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PregnancyPage } from './pregnancy';
@NgModule({
    declarations: [
        PregnancyPage,    ],
    imports: [
        IonicPageModule.forChild(PregnancyPage),
    ],
    exports: [
        PregnancyPage
    ]
})
export class PregnancyPageModule {
    
}