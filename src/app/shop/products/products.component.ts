import { Subscription } from 'rxjs';
import { ShoppingCartService } from './../../shopping-cart.service';
import { ProductService } from 'src/app/product.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: any[];
  filteredProducts: any[];
  categoryProducts: any[];
  id;
  cart;
  subscription: Subscription;
  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private shoppingCartService: ShoppingCartService
  ) {
    productService.getAll().subscribe(products => {
      this.categoryProducts = this.filteredProducts = this.products = products;
      this.activatedRoute.queryParamMap.subscribe(params => {
        const category = params.get('category');
        if (category === 'all') {
          this.categoryProducts = this.filteredProducts = this.products;
        } else {
          this.categoryProducts = this.filteredProducts = category
            ? this.products.filter(p => p.payload.val().category === category)
            : this.products;
        }
      });
    });
  }

  filter(query: string) {
    this.filteredProducts = query
      ? this.categoryProducts.filter(p =>
          p.payload
            .val()
            .title.toLowerCase()
            .includes(query.toLowerCase())
        )
      : this.categoryProducts;
  }

  addToCart(product) {
    product = {
      key: product.key,
      category: product.payload.val().category,
      imageUrl: product.payload.val().imageUrl,
      price: product.payload.val().price,
      title: product.payload.val().title
    };
    this.shoppingCartService.addToCart(product);
  }

  removeFromCart(product) {
    product = {
      key: product.key,
      category: product.payload.val().category,
      imageUrl: product.payload.val().imageUrl,
      price: product.payload.val().price,
      title: product.payload.val().title
    };
    this.shoppingCartService.removeFromCart(product);
  }

  getQuantity(key) {
    if (this.cart && this.cart.items && this.cart.items[key]) {
      return this.cart.items[key].quantity;
    }
    return 0;
  }

  async ngOnInit() {
    this.subscription = (await this.shoppingCartService.getCart()).subscribe(
      cart => (this.cart = cart)
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
