import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';

const uiModules = [CommonModule, MatButtonModule];

@NgModule({
  declarations: [HomeComponent],
  imports: [
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: HomeComponent },
    ]),
    ReactiveFormsModule,
    ...uiModules,
  ],
})
export class HomeModule {}
