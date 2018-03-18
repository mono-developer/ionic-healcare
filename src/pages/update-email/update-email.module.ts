import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdateEamilPage } from './update-email';
@NgModule({
    declarations: [
        UpdateEamilPage,
    ],
    imports: [
        IonicPageModule.forChild(UpdateEamilPage),
    ],
    exports: [
        UpdateEamilPage
    ]
})
export class UpdateEamilPageModule {
    
}