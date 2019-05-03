import { ShoppingCartService } from './../shopping-cart.service';
import { CategoryService } from './../category.service';
import { AppUser } from './../models/app-user';
import { AuthService } from './../auth.service';
import { Component, OnInit, Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { LoginComponent } from '../user/login/login.component';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  opened: boolean;
  appUser: AppUser;
  isHeadset: boolean;
  categories$;
  shoppingCartItemCount;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    private auth: AuthService,
    private categoryService: CategoryService,
    private shoppingCartService: ShoppingCartService
  ) {
    auth.appUser$.subscribe(appUser => (this.appUser = appUser));

    this.categories$ = this.categoryService.getCategory();
    this.isHandset$.subscribe(isHeadset => {
      if (!isHeadset) {
        this.opened = true;
      } else {
        this.opened = false;
      }
      this.isHeadset = isHeadset;
    });
  }

  openLogin(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  closeSideNav(drawer) {
    if (this.opened) {
      if (this.isHeadset) {
        drawer.toggle();
      }
    }
  }

  logOut() {
    this.auth.logOut();
  }
  async ngOnInit() {
    const cart$ = await this.shoppingCartService.getCart();
    cart$.subscribe(cart => {
      this.shoppingCartItemCount = 0;
      // tslint:disable-next-line: forin
      for (const itemId in cart.items) {
        this.shoppingCartItemCount += cart.items[itemId].quantity;
      }
    });
  }
}
