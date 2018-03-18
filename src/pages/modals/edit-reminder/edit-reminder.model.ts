import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditReminderModal } from './edit-reminder';
import { MultiPickerModule } from 'ion-multi-picker';
@NgModule({
    declarations: [
        EditReminderModal,
    ],
    imports: [
        MultiPickerModule,
        IonicPageModule.forChild(EditReminderModal),
    ],
    exports: [
        EditReminderModal
    ]
})
export class EditReminderModalModule {
    
}