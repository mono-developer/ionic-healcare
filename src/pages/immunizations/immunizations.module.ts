import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImmunizationsPage } from './immunizations';
import { CustomNameComponent } from './custom-name'
@NgModule({
    declarations: [
        ImmunizationsPage,
        CustomNameComponent
    ],
    imports: [
        IonicPageModule.forChild(ImmunizationsPage),
    ],
    exports: [
        ImmunizationsPage,
        CustomNameComponent
    ]
})
export class ImmunizationsPageModule {
    
}