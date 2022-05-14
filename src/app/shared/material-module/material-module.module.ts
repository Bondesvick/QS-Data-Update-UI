import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material//input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';
import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
    imports: [MatInputModule, MatStepperModule, MatFormFieldModule, MatButtonModule, MatRadioModule,
        MatMenuModule, MatSelectModule, MatDialogModule, MatIconModule, MatProgressBarModule, MatCheckboxModule,
        MatCardModule, MatDatepickerModule, MatSnackBarModule, MatInputModule, MatNativeDateModule, MatTabsModule],//, MatTooltipModule],
    exports: [MatInputModule, MatStepperModule, MatFormFieldModule, MatButtonModule, MatRadioModule,
        MatCheckboxModule, MatCardModule, MatDatepickerModule, MatSnackBarModule, MatInputModule, MatNativeDateModule,
        MatMenuModule, MatSelectModule, MatDialogModule, MatIconModule, MatProgressBarModule, MatTabsModule],//, MatTooltipModule],
    providers: [{
        provide: MAT_RADIO_DEFAULT_OPTIONS,
        useValue: { color: 'accent' },
    }, {
        provide: STEPPER_GLOBAL_OPTIONS,
        useValue: { displayDefaultIndicatorType: false }

    }]
})
export class MaterialModule {

}
