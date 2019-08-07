import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  id = '';
  date: string;
  order: Order = new Order();
  userSubscription: Subscription;
  constructor(
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.date = this.activatedRoute.snapshot.paramMap.get('dateCreated');
    this.subscription = this.orderService
      .getOrder(this.id, this.date)
      .subscribe(order => (this.order = order));
  }

  changeDeliveryStatus() {
    const order: Order = this.order;
    order.changeDeliveryStatus();
    this.orderService.addOrder(order);
  }
  deleteOrder(){
    this.subscription.unsubscribe();
    this.orderService.deleteOrder(this.order);
    this.router.navigate(['/admin/orders'])
  }
  ngOnInit() {}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
