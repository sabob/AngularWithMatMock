import {Routes} from '@angular/router';
import {NotFoundComponent} from "@app/core/errors/not-found/not-found.component";
import {SecureComponent} from "@app/core/secure/secure.component";
import {CloseMeComponent} from "@app/core/close/pages/close.me.component";
import {AuthGuard} from "@app/routes/auth.guard";
import {customersResolver} from "@app/features/customers/master/customers.resolver";
import {customerEditResolver} from "@app/features/customers/detail/edit/customer-edit.resolver";
import {customerViewResolver} from "@app/features/customers/detail/view/customer-view.resolver";

export const routes: Routes = [
  {
    path: 'close-me', component: CloseMeComponent
  },
  {
    path: '', component: SecureComponent,
    canActivate: [AuthGuard],
    data: {animation: 'fadeAnimation'},
    children: [

      {
        path: '',
        loadComponent: () => import('@app/features/home/home.component').then((m) => m.HomeComponent),
        data: {animation: 'fadeAnimation'}
      },
      {
        path: 'home',
        loadComponent: () => import('@app/features/home/home.component').then((m) => m.HomeComponent),
        data: {animation: 'fadeAnimation'}
      },
      {
        path: 'customer/create',
        loadComponent: () => import('@app/features/customers/detail/edit/customer-edit.component').then((m) => m.CustomerEditComponent),
        data: {animation: 'fadeAnimation'},
      },
      {
        path: 'customer/edit/:id',
        loadComponent: () => import('@app/features/customers/detail/edit/customer-edit.component').then((m) => m.CustomerEditComponent),
        resolve: {customer: customerEditResolver}
      },
      {
        path: 'customer/view/:id',
        loadComponent: () => import('@app/features/customers/detail/view/customer-view.component').then((m) => m.CustomerViewComponent),
        data: {animation: 'fadeAnimation'},
        resolve: {customer: customerViewResolver}
      },
      {
        path: 'customers',
        loadComponent: () => import('@app/features/customers/master/customers.component').then((m) => m.CustomersComponent),
        resolve: {customers: customersResolver}
      },
      {
        path: '404', component: NotFoundComponent
      }
    ]
  },

  {
    path: '**', redirectTo: '/404'
  }
]
