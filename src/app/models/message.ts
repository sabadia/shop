export class Message {
  private _name: string;
  private _message: string;

  constructor(name: string, message: string = '') {
    this.name = name;
    this.message = message;
  }
  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }

  public get message(): string {
    return this._message;
  }
  public set message(value: string) {
    this._message = value;
  }
  json() {
    return {
      name: this.name,
      message: this.message
    };
  }
}
