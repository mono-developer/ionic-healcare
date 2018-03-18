import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OtherInfoEditPage } from './other-edit';
@NgModule({
    declarations: [
        OtherInfoEditPage,
    ],
    imports: [
        IonicPageModule.forChild(OtherInfoEditPage),
    ],
    exports: [
        OtherInfoEditPage
    ]
})
export class OtherInfoEditPageModule {
    
}