import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageSharingPage } from './manage-sharing';
@NgModule({
    declarations: [
        ManageSharingPage,
    ],
    imports: [
        IonicPageModule.forChild(ManageSharingPage),
    ],
    exports: [
        ManageSharingPage
    ]
})
export class ManageSharingPageModule {
    
}