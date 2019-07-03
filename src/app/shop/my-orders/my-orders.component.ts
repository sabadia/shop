import { OrderService } from './../../order.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Order } from 'src/app/models/order';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit, OnDestroy {
  filteredOrders: Order[] = [];
  orders: Order[] = [];
  subscription: Subscription;
  userSubscription: Subscription;
  constructor(private orderService: OrderService, private auth: AuthService) {
    this.userSubscription = this.auth.appUser$.subscribe(u => {
      this.subscription = this.orderService
        .getOrders(u.id)
        .subscribe(orders => {
          this.filteredOrders = this.orders = orders;
        });
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
