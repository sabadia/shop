import { Component, OnInit, OnDestroy } from '@angular/core';
import { Order } from 'src/app/models/order';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/order.service';
import { AuthService } from 'src/app/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, OnDestroy {
  filteredOrders: Order[] = [];
  orders: Order[] = [];
  subscription: Subscription;
  userSubscription: Subscription;
  constructor(
    private orderService: OrderService,
    private auth: AuthService,
    private activatedRoute: ActivatedRoute
  ) {
    this.userSubscription = this.auth.appUser$.subscribe(u => {
      if (u.isAdmin) {
        this.subscription = this.orderService
          .getAllUsersOrders()
          .subscribe(orders => {
            this.filteredOrders = [];
            this.orders = [];
            orders.forEach(ods => {
              this.filteredOrders = this.filteredOrders.concat(ods);
              this.orders = this.orders.concat(ods);
            });
          });
      }
    });
  }
  filter(query: string) {
    this.filteredOrders = query
      ? this.orders.filter(o =>
          o.dateCreated.toLowerCase().includes(query.toLowerCase())
        )
      : this.orders;
  }
  ngOnInit() {}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }
}
