import { UsersComponent } from './users/users.component';
import { ChatComponent } from './chat/chat.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../auth-guard.service';
import { AdminAuthGuardService } from '../admin-auth-guard.service';

const routes: Routes = [
  {
    path: ':id',
    component: ChatComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: '',
    component: UsersComponent,
    canActivate: [AuthGuardService, AdminAuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule {}
