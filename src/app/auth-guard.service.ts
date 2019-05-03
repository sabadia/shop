import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRoute,
  RouterStateSnapshot
} from '@angular/router';
import { MatDialog } from '@angular/material';
import 'rxjs/add/operator/map';
import { NavComponent } from './nav/nav.component';
import { Location } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  public dialog: MatDialog;
  constructor(
    private auth: AuthService,
    private router: Router,
    private nav: NavComponent
  ) {}
  canActivate(route, state: RouterStateSnapshot) {
    return this.auth.user$.map(user => {
      if (user) {
        return true;
      }
      this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
      this.nav.openLogin();
      return false;
    });
  }
}
