import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile.component';

const uiModules = [CommonModule, MatButtonModule];

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: ProfileComponent },
    ]),
    ReactiveFormsModule,
    ...uiModules,
  ],
})
export class ProfileModule {}
