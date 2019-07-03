import { Category } from './models/category';
import {
  AngularFireDatabase,
  AngularFireAction,
  DatabaseSnapshot
} from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private db: AngularFireDatabase) {}
  add(category: Category) {
    return this.db.object('/categories/' + category.id).set(category.json());
  }
  remove(category: Category) {
    return this.db.object('/categories/' + category.id).remove();
  }
  getCategory(): Observable<Category[]> {
    return this.db
      .list('/categories', ref => ref.orderByChild('name'))
      .snapshotChanges()
      .pipe(
        map(categories => {
          return categories.map(category => {
            const c = category as any;
            return new Category(c.key, c.payload.val().name);
          });
        })
      );
  }
}
