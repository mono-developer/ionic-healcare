import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FamilyHistoryEditPage } from './family-history-edit';
@NgModule({
    declarations: [
        FamilyHistoryEditPage,
    ],
    imports: [
        IonicPageModule.forChild(FamilyHistoryEditPage),
    ],
    exports: [
        FamilyHistoryEditPage
    ]
})
export class FamilyHistoryEditPageModule {
    
}