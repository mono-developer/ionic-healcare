import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupCodePage } from './group-code';
@NgModule({
    declarations: [
        GroupCodePage,
    ],
    imports: [
        IonicPageModule.forChild(GroupCodePage),
    ],
    exports: [
        GroupCodePage
    ]
})
export class GroupCodePageModule {
    
}