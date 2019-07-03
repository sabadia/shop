import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { AuthGuardService } from '../auth-guard.service';
import { AdminAuthGuardService } from '../admin-auth-guard.service';
import { ProductFormComponent } from './product-form/product-form.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';

const routes: Routes = [
  {
    path: 'products/new',
    component: ProductFormComponent,
    canActivate: [AuthGuardService, AdminAuthGuardService]
  },
  {
    path: 'products/:id',
    component: ProductFormComponent,
    canActivate: [AuthGuardService, AdminAuthGuardService]
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [AuthGuardService, AdminAuthGuardService]
  },
  {
    path: 'orders',
    component: OrderListComponent,
    canActivate: [AuthGuardService, AdminAuthGuardService]
  },
  // {
  //   path: 'orders/:id',
  //   component: OrderListComponent,
  //   canActivate: [AuthGuardService, AdminAuthGuardService]
  // },
  {
    path: 'orders/:id/:dateCreated',
    component: OrderDetailComponent,
    canActivate: [AuthGuardService, AdminAuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
