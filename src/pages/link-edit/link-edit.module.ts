import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LinkEditPage } from './link-edit';
@NgModule({
    declarations: [
        LinkEditPage,
    ],
    imports: [
        IonicPageModule.forChild(LinkEditPage),
    ],
    exports: [
        LinkEditPage
    ]
})
export class LinkEditPageModule {
    
}