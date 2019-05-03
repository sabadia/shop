import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule],
  providers: [],
  exports: [LoginComponent],
  entryComponents: [LoginComponent]
})
export class UserModule {}
