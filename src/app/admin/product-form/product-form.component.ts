import { Category } from './../../models/category';
import { Observable } from 'rxjs/observable';
import { ProductService } from './../../product.service';
import { CategoryService } from './../../category.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/take';
import { Product } from 'src/app/models/product';
import { AngularFireStorage } from '@angular/fire/storage';
import {finalize} from "rxjs/operators"
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit,OnDestroy {
  addCategory = false;
  removeCategory = false;
  categories$: Observable<Category[]>;
  id = '';
  image : any = null;
  imageFile: any;
  product: Product = new Product();
  subscription:Subscription = null;
  constructor(
    private angularFireStorage:AngularFireStorage,
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
  saveToDBStorage(){
    
  }
  save(product) {
    if (product.invalid) {
      return;
    }
    const filePath ="product_images/"+ new Date().getTime() + this.imageFile.name;
    const ref = this.angularFireStorage.ref(filePath);
    console.log('yes');
    this.subscription = this.angularFireStorage.upload(filePath,this.imageFile).snapshotChanges().pipe(finalize(()=>{
      ref.getDownloadURL().subscribe(url => this.product.imageUrl = url)
      const p = new Product(
        this.id || '',
        product.value.title,
        product.value.category,
        this.product.imageUrl,
        product.value.price,
        product.value.discount,
        product.value.quantity
      );
      console.log(p)
      if (this.id) {
        this.productService.update(p);
      } else {
        this.productService.create(p);
      }
      this.router.navigate(['admin/products']);
    })).subscribe();
    
  }

  delete() {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.delete(this.id);
      this.router.navigate(['admin/products']);
    }
  }
  setImageUrl(event: any){
    if(event.target.files && event.target.files[0]){
      const reader = new FileReader();
      reader.onload = (e: any) => this.product.imageUrl = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.imageFile = event.target.files[0];
    }
    console.log(this.image)
  }

  ngOnInit() {}
  ngOnDestroy(): void {
    if(this.subscription!=null){
      this.subscription.unsubscribe();
    }
    
  }
}
