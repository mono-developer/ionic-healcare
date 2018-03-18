import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FamilyHistoryPage } from './family-history';
@NgModule({
    declarations: [
        FamilyHistoryPage,
    ],
    imports: [
        IonicPageModule.forChild(FamilyHistoryPage),
    ],
    exports: [
        FamilyHistoryPage
    ]
})
export class FamilyHistoryPageModule {

}