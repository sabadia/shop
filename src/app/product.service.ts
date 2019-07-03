import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { Product } from './models/product';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/observable';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private db: AngularFireDatabase) {}

  public snapshotToObservable(product): Product {
    return new Product(
      product.key,
      product.payload.val().title,
      product.payload.val().category,
      product.payload.val().imageUrl,
      product.payload.val().price,
      product.payload.val().discount,
      product.payload.val().quantity
    );
  }

  create(product: Product) {
    return this.db.list('/products').push(product.json());
  }
  getAll(): Observable<Product[]> {
    return this.db
      .list('/products')
      .snapshotChanges()
      .pipe(
        map(products => {
          return products.map(product => this.snapshotToObservable(product));
        })
      );
  }

  get(productId: string): Observable<Product> {
    return this.db
      .object('/products/' + productId)
      .snapshotChanges()
      .pipe(map(product => this.snapshotToObservable(product)));
  }

  update(product: Product) {
    return this.db.object('/products/' + product.id).update(product.json());
  }

  updateQuantity(productId: string, amount: number) {
    this.get(productId)
      .take(1)
      .subscribe(product => {
        product.quantity -= amount;
        this.update(product);
      });
  }
  delete(productId: string) {
    return this.db.object('/products/' + productId).remove();
  }
}
