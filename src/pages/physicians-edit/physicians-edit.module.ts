import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhysiciansEditPage } from './physicians-edit';
import { AutoCompleteModule } from 'ionic2-auto-complete';

@NgModule({
    declarations: [
        PhysiciansEditPage,
    ],
    imports: [
        AutoCompleteModule,
        IonicPageModule.forChild(PhysiciansEditPage),
    ],
    exports: [
        PhysiciansEditPage
    ]
})
export class PhysiciansEditPageModule {

}