import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PharmaciesEditPage } from './pharmacies-edit';
@NgModule({
    declarations: [
        PharmaciesEditPage,
    ],
    imports: [
        IonicPageModule.forChild(PharmaciesEditPage),
    ],
    exports: [
        PharmaciesEditPage
    ]
})
export class PharmaciesEditPageModule {

}