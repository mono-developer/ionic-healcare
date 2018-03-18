import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PreviewProfilePage } from './preview-profile';
@NgModule({
    declarations: [
        PreviewProfilePage,
    ],
    imports: [
        IonicPageModule.forChild(PreviewProfilePage),
    ],
    exports: [
        PreviewProfilePage
    ]
})
export class PreviewProfilePageModule {
    
}