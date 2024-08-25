import {Component, Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Credentials} from "@app/core/models/Credentials";
import {Constants} from "@app/shared/utils/Constants";
import {AuthService} from "@app/core/auth/service/auth.service";

@Injectable()
@Component({
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  goto: string | undefined;

  authError: string | undefined;

  credentials = new Credentials();

  title = 'Login';

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private authService: AuthService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {

      this.authError = params[Constants.AUTH_ERROR] || null;

      // Next url to navigate to after login succeeds
      this.goto = params[Constants.PARAM_GOTO_URL] || null;
    });
  }

  async login(event: Event) {

    event.preventDefault();

    await this.authService.login(this.credentials);

    if (this.goto) {
      await this.router.navigateByUrl(this.goto);
    } else {
      await this.router.navigateByUrl('/');
    }
  }
}
