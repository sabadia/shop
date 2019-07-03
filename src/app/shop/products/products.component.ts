import { Subscription } from 'rxjs';
import { ShoppingCartService } from './../../shopping-cart.service';
import { ProductService } from 'src/app/product.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product';
import { CartProduct } from 'src/app/models/cart-product';
import { ShoppingCart } from 'src/app/models/shopping-cart';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categoryProducts: Product[] = [];
  shoppingCart: ShoppingCart = new ShoppingCart();
  subscription: Subscription;
  view: { first: number; last: number } = { first: 0, last: 0 };
  currentIndex = 1;
  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private shoppingCartService: ShoppingCartService
  ) {
    this.productService.getAll().subscribe(products => {
      this.categoryProducts = this.filteredProducts = this.products = products;
      this.activatedRoute.queryParamMap.subscribe(params => {
        const category = params.get('category');

        if (category === 'all') {
          this.categoryProducts = this.filteredProducts = this.products;
        } else {
          this.categoryProducts = this.filteredProducts = category
            ? this.products.filter(p => p.category === category)
            : this.products;
        }
        this.getView();
      });
    });
  }

  filter(query: string) {
    this.filteredProducts = query
      ? this.categoryProducts.filter(p =>
          p.title.toLowerCase().includes(query.toLowerCase())
        )
      : this.categoryProducts;
    this.getView();
  }
  private getOrCreateCartProduct(product: Product, quantity: number) {
    let cartProduct: CartProduct = this.shoppingCart.findCartProduct(
      product.id
    );
    if (!cartProduct) {
      cartProduct = new CartProduct(0, product);
      // this.shoppingCart.addCartProduct(cartProduct);
    }
    cartProduct.quantity += quantity;
    return cartProduct;
  }

  addToCart(product: Product) {
    if (product.quantity > 0) {
      const cartProduct = this.getOrCreateCartProduct(product, 1);
      product.quantity -= 1;
      this.shoppingCartService.updateCart(cartProduct);
    }
  }

  removeFromCart(product: Product) {
    const cartProduct = this.getOrCreateCartProduct(product, -1);
    product.quantity += 1;
    this.shoppingCartService.updateCart(cartProduct);
  }

  async ngOnInit() {
    this.subscription = (await this.shoppingCartService.getCart()).subscribe(
      cart => {
        this.shoppingCart = cart;
      }
    );
  }
  pagination(num: number) {
    if (!this.range().find(n => n === num)) {
      return;
    }
    if (this.currentIndex === num) {
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
  private getView() {
    this.view = {
      first: this.filteredProducts.length > 0 ? 1 : 0,
      last:
        this.filteredProducts.length > 20 ? 20 : this.filteredProducts.length
    };
  }
  private gotoTop() {
    document.getElementById('scroll').scrollTop = 0;
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
