import { CartProduct } from './models/cart-product';
import { ProductService } from './product.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/observable';
import { Product } from './models/product';
import { ShoppingCart } from './models/shopping-cart';
import { map } from 'rxjs/operators';
import { number } from 'ngx-custom-validators/src/app/number/validator';
@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  constructor(private db: AngularFireDatabase) {}

  private create(id) {
    return this.db.object('/shopping-carts/' + id).set({
      dateCreated: new Date().getTime()
    });
  }
  private makeid(): string {
    length = 20;
    let result = '-';
    const characters =
      '-ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 1; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  private async getOrCreateCartId(): Promise<string> {
    let cartId = localStorage.getItem('cartId');
    if (cartId) {
      return cartId;
    } else {
      cartId = this.makeid();
      localStorage.setItem('cartId', cartId);
      await this.create(cartId);
      return cartId;
    }
  }
  async getCart() {
    const cartId = await this.getOrCreateCartId();
    return this.db
      .object('/shopping-carts/' + cartId)
      .snapshotChanges()
      .pipe(
        map(shoppingCart => {
          const sk = shoppingCart.payload.val() as any;
          if (!sk) {
            const dt = this.getCurrentDateTime();
            this.db
              .object('/shopping-carts/' + cartId)
              .set({ dateCreated: dt });
            return new ShoppingCart();
          }
          let cartProducts: CartProduct[] = [];
          if (sk.cartProducts) {
            cartProducts = Object.keys(sk.cartProducts).map(key => {
              const id = key;
              const title = sk.cartProducts[key].title;
              const imageUrl = sk.cartProducts[key].imageUrl;
              const price = sk.cartProducts[key].price;
              const quantity = sk.cartProducts[key].quantity;
              const discount = sk.cartProducts[key].discount;
              return new CartProduct(
                quantity,
                new Product(id, title, '', imageUrl, price, discount)
              );
            });
          }
          const dateCreated = sk.dateCreated;
          return new ShoppingCart(cartId, dateCreated, cartProducts);
        })
      );
  }
  private getCurrentDateTime() {
    const today = new Date();
    const date =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate();
    const time =
      today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    return date + '_' + time;
  }
  private getCartDate(cartId): string {
    let date: string;
    this.db
      .object('/shopping-carts/' + cartId)
      .snapshotChanges()
      .pipe(
        map(cart => {
          const c = cart as any;
          if (c.payload.val() != null) {
            return c.payload.val().dateCreated;
          } else {
            const dt = this.getCurrentDateTime();
            this.db
              .object('/shopping-carts/' + cartId)
              .set({ dateCreated: dt });
            return dt;
          }
        })
      )
      .take(1)
      .subscribe(d => (date = d));
    return date;
  }

  async updateCart(cartProduct: CartProduct) {
    const cartId = await this.getOrCreateCartId();
    if (cartProduct.quantity === 0) {
      this.db
        .object('/shopping-carts/' + cartId + '/cartProducts/' + cartProduct.id)
        .remove();
    } else {
      this.db
        .object('/shopping-carts/' + cartId + '/cartProducts/' + cartProduct.id)
        .update(cartProduct.json());
    }
  }
  async clearCart() {
    const cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartId + '/cartProducts').remove();
  }
}
