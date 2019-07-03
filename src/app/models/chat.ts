import { User } from './user';
import { Message } from './message';

export class Chat {
  private _id: string;
  private _name: string;
  private _email: string;
  private _messages: Message[];
  private _hasUnread: boolean;

  constructor(user: User, messages: Message[] = [], hasUnread: boolean = true) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.messages = messages;
    this.hasUnread = hasUnread;
  }
  private msgJsonArray() {
    return this.messages.map(message => message.json());
  }
  public pushMessage(message: Message) {
    this.messages.push(message);
  }
  public get email(): string {
    return this._email;
  }
  public set email(value: string) {
    this._email = value;
  }
  public get id(): string {
    return this._id;
  }
  public set id(value: string) {
    this._id = value;
  }
  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }
  public get messages(): Message[] {
    return this._messages;
  }
  public set messages(value: Message[]) {
    this._messages = value;
  }

  public get hasUnread(): boolean {
    return this._hasUnread;
  }
  public set hasUnread(value: boolean) {
    this._hasUnread = value;
  }
  public json() {
    return {
      name: this.name,
      email: this.email,
      messages: this.msgJsonArray(),
      hasUnread: this.hasUnread
    };
  }
}
