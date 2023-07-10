import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'selector',
    loadChildren: () => import('./countries/countries.module').then( m => m.CountriesModule )
    // loadChildren: lazyload
  },
  {
    path: '**',
    redirectTo: 'selector'
    // loadChildren: lazyload
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
