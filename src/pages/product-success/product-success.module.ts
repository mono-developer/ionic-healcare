import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductSuccessPage } from './product-success';
@NgModule({
    declarations: [
        ProductSuccessPage,
    ],
    imports: [
        IonicPageModule.forChild(ProductSuccessPage),
    ],
    exports: [
        ProductSuccessPage
    ]
})
export class ProductSuccessPageModule {
    
}