import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PasscodeSettingPage } from './passcode-setting';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
    declarations: [
        PasscodeSettingPage  ],
    imports: [
       
        IonicPageModule.forChild(PasscodeSettingPage),
        ComponentsModule
    ],
    exports: [
        PasscodeSettingPage
    ]
})
export class PasscodeSettingPageModule {
    
}