import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LinkedProductEditPage } from './linked-product-edit';
@NgModule({
    declarations: [
        LinkedProductEditPage,
    ],
    imports: [
        IonicPageModule.forChild(LinkedProductEditPage),
    ],
    exports: [
        LinkedProductEditPage
    ]
})
export class LinkedProductEditPageModule {
    
}