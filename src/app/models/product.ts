export class Product {
  private _id: string;
  private _title: string;
  private _category: string;
  private _imageUrl: string;
  private _price: number;
  private _discount: number;
  private _quantity: number;

  public constructor(
    id: string = '',
    title: string = '',
    category: string = '',
    imageUrl: string = '',
    price: number = 0,
    discount: number = 0,
    quantity: number = 0
  ) {
    this._id = id;
    this.title = title;
    this.category = category;
    this.imageUrl = imageUrl;
    this.price = price;
    this.discount = discount;
    this.quantity = quantity;
  }
  public get quantity(): number {
    return this._quantity;
  }
  public set quantity(value: number) {
    this._quantity = value;
  }

  public priceAfterDiscount(): number {
    return this.price - (this.price * this.discount) / 100;
  }

  public get discount(): number {
    return this._discount;
  }
  public set discount(value: number) {
    this._discount = value;
  }

  public get id(): string {
    return this._id;
  }

  public get category(): string {
    return this._category;
  }
  public set category(value: string) {
    this._category = value;
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

  public json() {
    return {
      title: this.title,
      category: this.category,
      imageUrl: this.imageUrl,
      price: this.price,
      discount: this.discount,
      quantity: this.quantity
    };
  }
}
