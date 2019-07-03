import { ProductService } from './../../product.service';
import { ShoppingCartService } from './../../shopping-cart.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from 'src/app/models/product';
import { CartProduct } from 'src/app/models/cart-product';
import { Observable } from 'rxjs/observable';
import { ShoppingCart } from 'src/app/models/shopping-cart';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  shoppingCart: ShoppingCart = new ShoppingCart();
  subscription: Subscription;
  constructor(private shoppingCartService: ShoppingCartService,private productService: ProductService) {}
  addToCart(cartProduct: CartProduct) {
    this.productService.get(cartProduct.id).take(1).subscribe(product =>{
      if (cartProduct.quantity < product.quantity){
        cartProduct.quantity += 1;
        this.shoppingCartService.updateCart(cartProduct);
      } else {
        return;
      }
    })
    
  }

  removeFromCart(cartProduct: CartProduct) {
    cartProduct.quantity -= 1;
    this.shoppingCartService.updateCart(cartProduct);
  }
  clearCart() {
    this.shoppingCartService.clearCart();
  }

  async ngOnInit() {
    this.subscription = (await this.shoppingCartService.getCart()).subscribe(
      cart => {
        this.shoppingCart = cart;
      }
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
