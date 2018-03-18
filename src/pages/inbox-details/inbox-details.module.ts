import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InboxDetailsPage } from './inbox-details';
@NgModule({
    declarations: [
        InboxDetailsPage,
    ],
    imports: [
        IonicPageModule.forChild(InboxDetailsPage),
    ],
    exports: [
        InboxDetailsPage
    ]
})
export class InboxDetailsPageModule {
    
}