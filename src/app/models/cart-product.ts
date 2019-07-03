import { Product } from 'src/app/models/product';
export class CartProduct {
  private _id: string;
  private _quantity: number;
  private _title: string;
  private _imageUrl: string;
  private _price: number;
  private _discount: number;

  constructor(quantity: number, product: Product) {
    this._id = product.id;
    this.title = product.title;
    this.imageUrl = product.imageUrl;
    this.price = product.price;
    this.quantity = quantity;
    this.discount = product.discount;
  }

  public get discount() {
    return this._discount;
  }
  public set discount(value) {
    this._discount = value;
  }

  public get imageUrl(): string {
    return this._imageUrl;
  }

  public set imageUrl(value: string) {
    this._imageUrl = value;
  }

  public get price(): number {
    return this._price;
  }
  public set price(value: number) {
    this._price = value;
  }

  public get title(): string {
    return this._title;
  }

  public set title(value: string) {
    this._title = value;
  }

  public totalPrice() {
    const original = this.price * this.quantity;
    const priceAfterDiscount = original - (original * this.discount) / 100;
    return priceAfterDiscount;
  }
  public get id(): string {
    return this._id;
  }

  public get quantity(): number {
    return this._quantity;
  }
  public set quantity(value: number) {
    this._quantity = value;
  }

  json() {
    return {
      title: this.title,
      imageUrl: this.imageUrl,
      price: this.price,
      discount: this.discount,
      quantity: this.quantity
    };
  }
}
