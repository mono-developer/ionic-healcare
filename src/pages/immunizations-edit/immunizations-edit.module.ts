import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImmunizationsEditPage } from './immunizations-edit';
@NgModule({
    declarations: [
        ImmunizationsEditPage,
    ],
    imports: [
        IonicPageModule.forChild(ImmunizationsEditPage),
    ],
    exports: [
        ImmunizationsEditPage
    ]
})
export class ImmunizationsEditPageModule {
    
}