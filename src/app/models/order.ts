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
  private _paymentMethod: string;
  private _paymentNumber: string;
  private _paymentID: string;
  
  constructor(
    id: string = '',
    dateCreated: string = '',
    name: string = '',
    email: string = '',
    address: string = '',
    phone: string = '',
    cartProducts: CartProduct[] = [],
    totalPrice: number = 0,
    deliveryStatus: boolean = false,
    paymentMethod: string = "",
    paymentNumber: string = "",
    paymentId: string = ""
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
    this.paymentMethod = paymentMethod;
    this.paymentNumber = paymentNumber;
    this.paymentID = paymentId;
  }

  public get paymentID(): string {
    return this._paymentID;
  }
  public set paymentID(value: string) {
    this._paymentID = value;
  }
  public get paymentNumber(): string {
    return this._paymentNumber;
  }
  public set paymentNumber(value: string) {
    this._paymentNumber = value;
  }
  public get paymentMethod(): string {
    return this._paymentMethod;
  }
  public set paymentMethod(value: string) {
    this._paymentMethod = value;
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
    if(this.paymentMethod == 'bkash'){
      this._totalPrice = price + price * 1.85/100;
    }
    else if(this.paymentMethod == 'rocket'){
      this._totalPrice = price + price * 1.8/100;
    }
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
      totalPrice: this.totalPrice,
      paymentMethod: this.paymentMethod,
      paymentNumber: this.paymentNumber,
      paymentID: this.paymentID
    };
    return obj;
  }
}
