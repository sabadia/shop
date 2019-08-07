import { ShoppingCartService } from "./../shopping-cart.service";
import { CategoryService } from "./../category.service";
import { User } from "../models/user";
import { AuthService } from "./../auth.service";
import { Component, OnInit, Injectable } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MatDialog, MatDialogRef } from "@angular/material";
import { LoginComponent } from "../user/login/login.component";
import { Category } from "../models/category";
import { ChatService } from "../chat.service";
import { Chat } from "../models/chat";
@Injectable({
  providedIn: "root"
})
@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"]
})
export class NavComponent implements OnInit {
  showSpinner = true;
  opened: boolean;
  appUser: User;
  isHeadset: boolean;
  categories: Category[];
  shoppingCartItemCount;
  dialogRef: MatDialogRef<LoginComponent, any>;
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
    auth.appUser$.subscribe(appUser => {
      this.appUser = appUser;
      if (appUser) {
        if (this.dialogRef) {
          this.dialogRef.close();
        }
        this.showSpinner = false;
      }
    });

    this.categoryService.getCategory().subscribe(categories => {
      this.categories = categories;
      this.showSpinner = false;
    });
    this.isHandset$.subscribe(isHeadset => {
      if (!isHeadset) {
        this.opened = true;
      } else {
        this.opened = false;
      }
      this.isHeadset = isHeadset;
    });
  }

  openLogin() {
    this.dialogRef = this.dialog.open(LoginComponent, {
      width: "350px"
    });
  }
  closeLogin(dialogRef: MatDialogRef<LoginComponent, any>) {
    dialogRef.close(result => {});
    dialogRef.afterClosed().subscribe(result => {});
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
      this.shoppingCartItemCount = cart.getAllCartProductsQuantity();
    });
  }

  gotoTop() {
    document.getElementById("scroll").scrollTop = 0;
  }
  gotoBottom() {
    const container = document.getElementById("scroll");
    container.scrollTop = container.scrollHeight - container.clientHeight;
  }
}
