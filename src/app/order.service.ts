import { CartProduct } from './models/cart-product';
import { ShoppingCartService } from './shopping-cart.service';
import { Order } from 'src/app/models/order';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { Product } from './models/product';
import { UserService } from './user.service';
import { User } from './models/user';
import { mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(
    private db: AngularFireDatabase,
    private shoppingCartService: ShoppingCartService,
    private userService: UserService
  ) {}

  addOrder(order: Order): Promise<Order> {
    if (order.cartProducts.length) {
      return this.db
        .object('/orders/' + order.id)
        .update(order.json())
        .then(() => {
          this.shoppingCartService.clearCart();
          return order;
        });
    }
    return;
  }
  private updateTotalOrderStatus(id: string, n: number) {
    this.db
      .object('/orders/' + id + '/orderStatus')
      .valueChanges()
      .subscribe(value => {
        if (value) {
          const v = value as number;
          this.db.object('/orders/' + id + '/orderNo').update(v + n);
        } else {
          this.db.object('/orders/' + id + '/orderNo').update(0);
        }
      });
  }
  deleteOrder(order: Order) {
    return this.db
      .object('/orders/' + order.id + '/' + order.dateCreated)
      .remove();
  }
  getOrderedUsers() {
    return this.db
      .list('/orders')
      .snapshotChanges()
      .pipe(
        mergeMap(users => {
          return Observable.forkJoin(
            users.map(user => {
              const u = user as any;
              return this.userService.get(u.key);
            })
          );
        })
      );
  }
  getAllUsersOrders() {
    return this.db
      .list('/orders')
      .snapshotChanges()
      .map(users =>
        users.map(user => {
          const u = user.payload.val() as any;
          return Object.keys(u).map(key => {
            const dateCreated = key;
            const deliveryStatus = u[dateCreated].deliveryStatus;
            const totalPrice = u[dateCreated].totalPrice;
            const cartProducts: CartProduct[] = Object.keys(
              u[dateCreated].products
            ).map(
              k =>
                new CartProduct(
                  u[dateCreated].products[k].quantity,
                  new Product(
                    k,
                    u[dateCreated].products[k].title,
                    '',
                    u[dateCreated].products[k].imageUrl,
                    u[dateCreated].products[k].price,
                    u[dateCreated].products[k].discount
                  )
                )
            );
            const name = u[dateCreated].shipping.name;
            const email = u[dateCreated].shipping.email;
            const address = u[dateCreated].shipping.address;
            const phone = u[dateCreated].shipping.phone;
            const order: Order = new Order(
              user.key,
              dateCreated,
              name,
              email,
              address,
              phone,
              cartProducts,
              totalPrice,
              deliveryStatus
            );
            return order;
          });
        })
      );
  }
  getOrder(id: string, date: string) {
    return this.db
      .object('/orders/' + id + '/' + date)
      .snapshotChanges()
      .map(order => {
        const dateCreated = date;
        const o = order.payload.val() as any;
        const cartProducts: CartProduct[] = Object.keys(o.products).map(
          key =>
            new CartProduct(
              o.products[key].quantity,
              new Product(
                key,
                o.products[key].title,
                '',
                o.products[key].imageUrl,
                o.products[key].price,
                o.products[key].discount
              )
            )
        );
        const name = o.shipping.name;
        const email = o.shipping.email;
        const address = o.shipping.address;
        const phone = o.shipping.phone;
        const totalPrice = o.totalPrice;
        const deliveryStatus = o.deliveryStatus;
        return new Order(
          id,
          dateCreated,
          name,
          email,
          address,
          phone,
          cartProducts,
          totalPrice,
          deliveryStatus
        );
      });
  }

  getOrders(id: string) {
    return this.db
      .list('/orders/' + id)
      .snapshotChanges()
      .map(orders =>
        orders.map(order => {
          const dateCreated = order.key;
          const o = order.payload.val() as any;
          const cartProducts: CartProduct[] = Object.keys(o.products).map(
            key =>
              new CartProduct(
                o.products[key].quantity,
                new Product(
                  key,
                  o.products[key].title,
                  '',
                  o.products[key].imageUrl,
                  o.products[key].price,
                  o.products[key].discount
                )
              )
          );
          const name = o.shipping.name;
          const email = o.shipping.email;
          const address = o.shipping.address;
          const phone = o.shipping.phone;
          const totalPrice = o.totalPrice;
          const deliveryStatus = o.deliveryStatus;
          return new Order(
            id,
            dateCreated,
            name,
            email,
            address,
            phone,
            cartProducts,
            totalPrice,
            deliveryStatus
          );
        })
      );
  }
}
