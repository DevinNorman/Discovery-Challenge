import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DropCsvComponent } from './drop-csv/drop-csv.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LandingComponent } from './landing/landing.component';


const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'drop-csv', component: DropCsvComponent },
  { path: '**', redirectTo: 'landing' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
