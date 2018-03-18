import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabletDetailModal } from './tablet-detail';
@NgModule({
    declarations: [
        TabletDetailModal,
    ],
    imports: [
        IonicPageModule.forChild(TabletDetailModal),
    ],
    exports: [
        TabletDetailModal
    ]
})
export class TabletDetailModalModule {
    
}