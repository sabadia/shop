import { Category } from './../../models/category';
import { Observable } from 'rxjs/observable';
import { ProductService } from './../../product.service';
import { CategoryService } from './../../category.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/take';
import { Product } from 'src/app/models/product';
@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  addCategory = false;
  removeCategory = false;
  categories$: Observable<Category[]>;
  id = '';
  product: Product = new Product();
  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.categories$ = categoryService.getCategory();
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      this.productService
        .get(this.id)
        .take(1)
        .subscribe(p => (this.product = p));
    }
  }
  addNewCategory(categoryName: string) {
    if (categoryName === '') {
      return;
    }
    const category = new Category(categoryName, categoryName);
    this.categoryService.add(category);
    this.addCategory = false;
  }
  removeACategory(categoryName: string) {
    if (categoryName === '') {
      return;
    }
    const category = new Category(categoryName, categoryName);
    this.categoryService.remove(category);
    this.removeCategory = false;
  }
  save(product) {
    if (product.invalid) {
      return;
    }
    const p = new Product(
      this.id || '',
      product.value.title,
      product.value.category,
      product.value.imageUrl,
      product.value.price,
      product.value.discount,
      product.value.quantity
    );
    if (this.id) {
      this.productService.update(p);
    } else {
      this.productService.create(p);
    }
    this.router.navigate(['admin/products']);
  }

  delete() {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.delete(this.id);
      this.router.navigate(['admin/products']);
    }
  }

  ngOnInit() {}
}
