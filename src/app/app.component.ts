import { AuthService } from './auth.service';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'shop';
  constructor(
    private auth: AuthService,
    router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
    auth.user$.subscribe(user => {
      if (user) {
        this.userService.save(user);
        // console.log(localStorage.getItem('returnUrl'));
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        if (returnUrl) {
          router.navigateByUrl(returnUrl);
        }
      }
    });
  }
}
