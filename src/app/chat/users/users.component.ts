import { ChatService } from './../../chat.service';
import { Subscription } from 'rxjs';
import { UserService } from './../../user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/models/user';
import { Chat } from 'src/app/models/chat';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  chats: Chat[] = [];
  subscription: Subscription;
  constructor(private chatService: ChatService) {
    this.subscription = this.chatService.getChats().subscribe(chats => {
      this.chats = chats;
    });
  }
  public setAsRead(id){
    this.chatService.setAsRead(id);
  }

  ngOnInit() {}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
