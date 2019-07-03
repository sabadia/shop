import { AuthService } from './../../auth.service';
import { OrderService } from './../../order.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/observable';
import { Order } from 'src/app/models/order';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  date: string;
  order$: Observable<Order>;
  userSubscription: Subscription;
  constructor(
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService
  ) {
    this.date = this.activatedRoute.snapshot.paramMap.get('id');
    this.userSubscription = this.auth.appUser$.subscribe(u => {
      this.order$ = this.orderService.getOrder(u.id, this.date);
    });
  }

  ngOnInit() {}
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
