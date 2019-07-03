import { ProductService } from './../../product.service';
import { OrderService } from './../../order.service';
import { ShoppingCart } from 'src/app/models/shopping-cart';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingCartService } from 'src/app/shopping-cart.service';
import { Subscription } from 'rxjs';
import { Order } from 'src/app/models/order';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit, OnDestroy {
  shoppingCart: ShoppingCart = new ShoppingCart();
  subscription: Subscription;

  order = new Order();
  constructor(
    private shoppingCartService: ShoppingCartService,
    private auth: AuthService,
    private orderService: OrderService,
    private router: Router,
    private productService: ProductService
  ) {}

  saveOrder(userDetails) {
    if (userDetails.invalid) {
      return;
    }
    this.auth.appUser$.take(1).subscribe(appUser => {
      const user = appUser;
      if (!user) {
        return;
      }
      this.order.id = user.id;
      this.order.cartProducts = this.shoppingCart.cartProducts;
      this.shoppingCart.cartProducts.forEach(cartProduct => {
        this.productService.updateQuantity(
          cartProduct.id,
          cartProduct.quantity
        );
      });
      this.order.totalPrice = this.shoppingCart.totalPrice();
      this.orderService
        .addOrder(this.order)
        .then(o => this.router.navigate(['/order-success', o.id]));
    });
  }
  async ngOnInit() {
    this.subscription = (await this.shoppingCartService.getCart()).subscribe(
      cart => {
        this.shoppingCart = cart;
        if (!cart) {
          this.router.navigate(['']);
        }
      }
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
