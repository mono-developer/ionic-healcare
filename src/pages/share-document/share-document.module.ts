import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShareDocumentPage } from './share-document';
@NgModule({
    declarations: [
        ShareDocumentPage,    ],
    imports: [
        IonicPageModule.forChild(ShareDocumentPage),
    ],
    exports: [
        ShareDocumentPage    ]
})
export class ShareDocumentPageModule {
    
}