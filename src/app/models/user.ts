export class User {
  private _id: string;
  private _name: string;
  private _email: string;

  private _isAdmin: boolean;

  constructor(
    id: string = '',
    name: string = '',
    email: string = '',
    isAdmin: boolean = false
  ) {
    this.id = id;
    this.email = email;
    this._isAdmin = isAdmin;
    this.name = name;
  }

  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }

  public get id(): string {
    return this._id;
  }
  public set id(value: string) {
    this._id = value;
  }

  public get email(): string {
    return this._email;
  }
  public set email(value: string) {
    this._email = value;
  }

  public get isAdmin(): boolean {
    return this._isAdmin;
  }

  json() {
    return {
      email: this.email,
      isAdmin: this.isAdmin
    };
  }
}
