import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { OrdersComponent } from './orders/orders.component';
import { ProductsComponent } from './products/products.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { MatFormFieldModule, MatButtonModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ngx-custom-validators';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderListComponent } from './order-list/order-list.component';
import { NgxPrintModule } from 'ngx-print';

@NgModule({
  declarations: [
    OrdersComponent,
    ProductsComponent,
    ProductFormComponent,
    OrderDetailComponent,
    OrderListComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatFormFieldModule,
    FormsModule,
    CustomFormsModule,
    MatButtonModule,
    NgxPrintModule
  ]
})
export class AdminModule {}
