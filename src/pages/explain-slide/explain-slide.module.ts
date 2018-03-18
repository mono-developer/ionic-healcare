import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExplainSlidePage } from './explain-slide';
@NgModule({
    declarations: [
        ExplainSlidePage,
    ],
    imports: [
        IonicPageModule.forChild(ExplainSlidePage),
    ],
    exports: [
        ExplainSlidePage
    ]
})
export class ExplainSlidePageModule {
    
}