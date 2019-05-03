import { ProductService } from './../../product.service';
import { CategoryService } from './../../category.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/take';
@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  categories$;
  id;
  product: any;
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

  save(product) {
    if (product.invalid) {
      return;
    }
    if (this.id) {
      this.productService.update(this.id, product.value);
    } else {
      this.productService.create(product.value);
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
