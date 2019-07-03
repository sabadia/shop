import { CartProduct } from './cart-product';

export class Order {
  private _id: string;
  private _dateCreated: string;
  private _name: string;
  private _address: string;
  private _phone: string;
  private _cartProducts: CartProduct[];
  private _totalPrice: number;
  private _email: string;
  private _deliveryStatus: boolean;

  constructor(
    id: string = '',
    dateCreated: string = '',
    name: string = '',
    email: string = '',
    address: string = '',
    phone: string = '',
    cartProducts: CartProduct[] = [],
    totalPrice: number = 0,
    deliveryStatus: boolean = false
  ) {
    this._id = id;
    this.dateCreated = dateCreated || this.getCurrentDateTime();
    this.name = name;
    this.email = email;
    this.address = address;
    this.phone = phone;
    this.cartProducts = cartProducts;
    this._totalPrice = totalPrice;
    this._deliveryStatus = deliveryStatus;
  }
  public get deliveryStatus(): boolean {
    return this._deliveryStatus;
  }
  public set deliveryStatus(value: boolean) {
    this._deliveryStatus = value;
  }
  getProductCount() {
    return this.cartProducts.length;
  }
  getReadableDate() {
    return (
      this.dateCreated
        .split('_')[0]
        .split('-')
        .join('/') +
      ' ' +
      this.dateCreated.split('_')[1]
    );
  }
  private getCurrentDateTime() {
    const today = new Date();
    const date =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate();
    const time =
      today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    return date + '_' + time;
  }
  public get totalPrice(): number {
    return this._totalPrice;
  }
  public set totalPrice(price: number) {
    this._totalPrice = price;
  }
  public get cartProducts(): CartProduct[] {
    return this._cartProducts;
  }
  public set cartProducts(value: CartProduct[]) {
    this._cartProducts = value;
  }
  public get id(): string {
    return this._id;
  }
  public set id(value: string) {
    this._id = value;
  }
  public get dateCreated(): string {
    return this._dateCreated;
  }
  public set dateCreated(value: string) {
    this._dateCreated = value;
  }

  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }

  public get email(): string {
    return this._email;
  }
  public set email(value: string) {
    this._email = value;
  }

  public get address(): string {
    return this._address;
  }
  public set address(value: string) {
    this._address = value;
  }
  public get phone(): string {
    return this._phone;
  }
  public set phone(value: string) {
    this._phone = value;
  }
  private listToObject() {
    const productObject = {};
    this.cartProducts.forEach(
      cartProduct => (productObject[cartProduct.id] = cartProduct.json())
    );
    return productObject;
  }
  changeDeliveryStatus() {
    this._deliveryStatus = !this.deliveryStatus;
  }
  json() {
    const obj = {};
    obj[this.dateCreated] = {
      shipping: {
        name: this.name,
        email: this.email,
        address: this.address,
        phone: this.phone
      },
      products: this.listToObject(),
      deliveryStatus: this.deliveryStatus,
      totalPrice: this.totalPrice
    };
    return obj;
  }
}
