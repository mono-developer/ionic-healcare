import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LinkNewPage } from './link-new';
@NgModule({
    declarations: [
        LinkNewPage,
    ],
    imports: [
        IonicPageModule.forChild(LinkNewPage),
    ],
    exports: [
        LinkNewPage
    ]
})
export class LinkNewPageModule {
    
}