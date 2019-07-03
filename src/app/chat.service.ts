import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Chat } from './models/chat';
import { User } from './models/user';
import { Message } from './models/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private db: AngularFireDatabase) {}
  public addMessage(chat: Chat) {
    this.db.object('/chats/' + chat.id).update(chat.json());
  }
  public getChats(){
    return this.db.list('/chats').snapshotChanges().map(chats =>{
      return chats.map(chat => {
        const c = chat as any;
        const user = new User(c.key, c.payload.val().name, c.payload.val().email);
        return new Chat(user, [], c.payload.val().hasUnread);
      });
    });
  }
  public setAsRead(id){
    
    return this.db.object('/chats/' + id + '/hasUnread').set(false);
  }
  public get(id) {
    return this.db
      .object('/chats/' + id)
      .valueChanges()
      .map(c => {
        const chat = c as any;
        if (chat === null) {
          return undefined;
        }
        const user = new User(id, chat.name, chat.email);
        return new Chat(
          user,
          chat.messages.map(message => {
            return new Message(message.name, message.message);
          }),
          chat.hasUnread
        );
      });
  }
}
