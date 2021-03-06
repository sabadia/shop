import {
  MatButtonModule,
  MatHorizontalStepper,
  MatStepperModule
} from '@angular/material';
import { ProductsComponent } from './products/products.component';
import { HomeComponent } from './home/home.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { AuthGuardService } from '../auth-guard.service';
import { FormsModule } from '@angular/forms';
import { OrderDetailComponent } from './order-detail/order-detail.component';

@NgModule({
  declarations: [
    CheckOutComponent,
    HomeComponent,
    MyOrdersComponent,
    OrderSuccessComponent,
    ProductsComponent,
    ShoppingCartComponent,
    OrderDetailComponent
  ],
  imports: [
    CommonModule,
    ShopRoutingModule,
    MatButtonModule,
    FormsModule,
    MatStepperModule
  ]
})
export class ShopModule {}
