import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PasscodePage } from './passcode';
@NgModule({
    declarations: [
        PasscodePage,    ],
    imports: [
        IonicPageModule.forChild(PasscodePage),
    ],
    exports: [
        PasscodePage
    ]
})
export class PasscodePageModule {
    
}