import { AuthService } from "./auth.service";
import { Injectable } from "@angular/core";
import { CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import "rxjs/add/operator/map";
import { NavComponent } from "./nav/nav.component";
import { LoginComponent } from "./user/login/login.component";
import { MatDialogRef } from "@angular/material";
@Injectable({
  providedIn: "root"
})
export class AuthGuardService implements CanActivate {
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
      this.router.navigate([this.router.url], {
        queryParams: { returnUrl: state.url }
      });
      this.nav.openLogin();
      return false;
    });
  }
}
