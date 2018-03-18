import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LinkedProductPage } from './linked-product';
@NgModule({
    declarations: [
        LinkedProductPage,
    ],
    imports: [
        IonicPageModule.forChild(LinkedProductPage),
    ],
    exports: [
        LinkedProductPage
    ]
})
export class LinkedProductPageModule {
    
}