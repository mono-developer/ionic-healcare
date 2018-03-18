import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewReminderPage } from './new-reminder';
import { MultiPickerModule } from 'ion-multi-picker';

@NgModule({
    declarations: [
        NewReminderPage,
    ],
    imports: [
        MultiPickerModule,
        IonicPageModule.forChild(NewReminderPage),
    ],
    exports: [
        NewReminderPage
    ]
})
export class NewReminderPageModule {
    
}