import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';

const uiModules = [
  CommonModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
];

@NgModule({
  declarations: [LoginComponent],
  imports: [
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: LoginComponent },
    ]),
    ReactiveFormsModule,
    ...uiModules,
  ],
  exports: [LoginComponent],
})
export class LoginModule {}
