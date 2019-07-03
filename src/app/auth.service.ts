import { User } from './models/user';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/observable';
import { UserService } from './user.service';
import 'rxjs/add/operator/switchMap';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {
  user$: Observable<firebase.User>;

  constructor(
    private fireAuth: AngularFireAuth,
    private router: Router,
    private userService: UserService
  ) {
    this.user$ = fireAuth.authState;
  }

  logOut() {
    this.fireAuth.auth.signOut();
    this.router.navigate(['/']);
  }

  loginWithGoogle() {
    // const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    // localStorage.setItem('returnUrl', returnUrl);
    return this.fireAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    );
  }

  loginWithFacebook() {
    return this.fireAuth.auth.signInWithPopup(
      new firebase.auth.FacebookAuthProvider()
    );
  }
  get appUser$(): Observable<User> {
    return this.user$.switchMap(user => {
      if (user) {
        return this.userService.get(user.uid);
      }
      return of(null);
    });
  }
  ngOnInit(): void {}
}
