import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ContainerComponent } from './container/container.component';
import { ErrorComponent } from './error/error.component';

const routes: Routes = [
  //{ path: '', component: ContainerComponent },
  //{ path: 'error', component: ErrorComponent },
  //{ path: '**', redirectTo: '/error' } // Redirect to error page for any other unknown route, ling todo: needed?
  // Commented out to test build files - md-co index does not load with routing module

];


@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
