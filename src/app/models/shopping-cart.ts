import { CartProduct } from './cart-product';

export class ShoppingCart {
  private _id: string;
  private _date: string;
  private _cartProducts: CartProduct[];

  public constructor(
    id: string = '',
    dateCreated: string = '',
    cartproducts: CartProduct[] = []
  ) {
    this._id = id;
    this.dateCreated = dateCreated || this.getCurrentDateTime();
    this.cartProducts = cartproducts;
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

  getCartProductQuantity(key) {
    const cartProduct = this.findCartProduct(key);
    if (cartProduct) {
      return cartProduct.quantity;
    }
    return 0;
  }

  totalPrice(): number {
    let totalPrice = 0;
    this.cartProducts.forEach(
      cartProduct => (totalPrice += cartProduct.totalPrice())
    );
    return totalPrice;
  }
  public findCartProduct(id: string) {
    return this.cartProducts.find(cartProd => cartProd.id === id);
  }
  public get dateCreated(): string {
    return this._date;
  }
  public set dateCreated(value: string) {
    this._date = value;
  }

  public get id(): string {
    return this._id;
  }

  public get cartProducts(): CartProduct[] {
    return this._cartProducts;
  }
  public set cartProducts(value: CartProduct[]) {
    this._cartProducts = value;
  }

  public addCartProduct(cartProduct: CartProduct) {
    this._cartProducts.push(cartProduct);
  }
  public getAllCartProductsQuantity() {
    let count = 0;
    this.cartProducts.forEach(cartProduct => (count += cartProduct.quantity));
    return count;
  }
  private listToObject() {
    const productObject = {};
    this.cartProducts.forEach(
      cartProduct => (productObject[cartProduct.id] = cartProduct.json())
    );
    return productObject;
  }
  public json() {
    return {
      date: this.dateCreated,
      cartProducts: this.listToObject()
    };
  }
}
