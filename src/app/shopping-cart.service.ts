import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/observable';
@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  constructor(private db: AngularFireDatabase) {}
  private create() {
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    });
  }
  shoppingCartTotalItem(cart) {
    let count = 0;
    // tslint:disable-next-line: forin
    for (const itemId in cart.items) {
      count += cart.items[itemId].quantity;
    }

    return count;
  }
  async getCart(): Promise<Observable<any>> {
    const cartId = await this.getOrCreateCartId();
    return this.db.object('/shopping-carts/' + cartId).valueChanges();
  }

  private async getOrCreateCartId() {
    const cartId = localStorage.getItem('cartId');
    if (cartId) {
      return cartId;
    }
    const result = await this.create();
    localStorage.setItem('cartId', result.key);
    return result.key;
  }
  async addToCart(product) {
    this.updateCart(product, +1);
  }
  async removeFromCart(product) {
    this.updateCart(product, -1);
  }
  private async updateCart(product, value) {
    const cartId = await this.getOrCreateCartId();
    const item$: any = this.db
      .object('/shopping-carts/' + cartId + '/items/' + product.key)
      .valueChanges();
    item$.take(1).subscribe(item => {
      if (item) {
        this.db
          .object(
            '/shopping-carts/' + cartId + '/items/' + product.key + '/quantity'
          )
          .set(item.quantity + value);
      } else {
        this.db
          .object('/shopping-carts/' + cartId + '/items/' + product.key)
          .set({ product, quantity: 1 });
      }
    });
  }
}
