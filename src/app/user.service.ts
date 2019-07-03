import { User } from './models/user';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private db: AngularFireDatabase) {}
  save(user: firebase.User) {
    this.db.object('/users/' + user.uid).update({
      name: user.displayName,
      email: user.email
    });
  }
  public snapshotToObservable(user): User {
    return new User(
      user.key,
      user.payload.val().name,
      user.payload.val().email,
      user.payload.val().isAdmin
    );
  }
  public getAll() {
    return this.db
      .list('/users')
      .snapshotChanges()
      .pipe(
        map(users => {
          return users.map(user => this.snapshotToObservable(user));
        })
      );
  }
  get(uid: string): Observable<User> {
    return this.db
      .object('/users/' + uid)
      .snapshotChanges()
      .map(user => {
        const u = user as any;
        return new User(
          uid,
          u.payload.val().name,
          u.payload.val().email,
          u.payload.val().isAdmin
        );
      });
  }
}
