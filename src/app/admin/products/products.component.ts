import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from 'src/app/product.service';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  subscription: Subscription;
  view: { first: number; last: number } = { first: 0, last: 0 };
  currentIndex = 1;
  constructor(private productService: ProductService) {
    this.subscription = this.productService.getAll().subscribe(products => {
      this.filteredProducts = this.products = products;
      this.getView();
    });
  }
  private getView() {
    this.view = {
      first: this.filteredProducts.length > 0 ? 1 : 0,
      last:
        this.filteredProducts.length > 20 ? 20 : this.filteredProducts.length
    };
  }
  filter(query: string) {
    this.filteredProducts = query
      ? this.products.filter(p =>
          p.title.toLowerCase().includes(query.toLowerCase())
        )
      : this.products;
    this.getView();
  }
  pagination(num: number) {
    if (!this.range().find(n => n === num)) {
      return;
    }
    this.currentIndex = num;
    const f =
      this.filteredProducts.length > 20 * (num - 1) + 1
        ? 20 * (num - 1) + 1
        : this.view.first;
    const l =
      this.filteredProducts.length > 20 * num
        ? 20 * num
        : this.filteredProducts.length;
    this.view = { first: f, last: l };
    // this.getView();
    this.gotoTop();
  }
  range() {
    const step = 20;
    const max = this.filteredProducts.length;
    const len = Math.ceil(max / step);
    const input = [];
    for (let i = 1; i <= len; i++) {
      input.push(i);
    }
    return input;
  }

  private gotoTop() {
    document.getElementById('scroll').scrollTop = 0;
  }

  ngOnInit() {}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
