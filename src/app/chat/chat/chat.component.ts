import { UserService } from './../../user.service';
import { Subscription, Observable } from 'rxjs';
import { ChatService } from './../../chat.service';
import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chat } from 'src/app/models/chat';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { Message } from 'src/app/models/message';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy,AfterViewChecked {
  message = '';
  id;
  user: User = new User(this.id);
  chat: Chat = new Chat(this.user);
  appUser: User = new User();
  subscription: Subscription;
  userSubscription: Subscription;
  appUserSubscription: Subscription;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));
  constructor(
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService,
    private breakpointObserver: BreakpointObserver,
    private userService: UserService,
    private auth: AuthService,
    private router: Router,
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.appUserSubscription = this.auth.appUser$.subscribe(user =>{
      if(user.id !== this.id && !user.isAdmin){
        this.router.navigate(['']);
      }
      this.appUser = user;
    });
    this.userSubscription = this.userService.get(this.id).subscribe(user => {
      this.user = user;
      this.subscription = this.chatService.get(this.id).subscribe(chat => {
        if (!chat) {
          this.chat = new Chat(this.user, [], false);
        } else {
          this.chat = chat;
        }
        if (this.chat.messages.length > 0) {
          this.gotoBottom();
        }
      });
    });
  }
  addMessage() {
    if (this.message === '') {
      return;
    }
    if (this.user.id) {
      let name: string;
      if (this.appUser.isAdmin) {
        name = 'Admin';
      } else {
        name = this.appUser.name;
      }
      this.chat.pushMessage(new Message(name, this.message));
      if (this.chat.id) {
        this.chat.hasUnread = true;
        this.chatService.addMessage(this.chat);
        this.message = '';
      }
    }
    this.gotoBottom();
  }
  ngAfterViewChecked() {
    this.gotoBottom();
}

  gotoBottom() {
    const container = document.getElementById('scroll');
    if(container){
      container.scrollTop = container.scrollHeight - container.clientHeight;
    }
  }
  ngOnInit() {}
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.subscription.unsubscribe();
    this.appUserSubscription.unsubscribe();
  }
}
