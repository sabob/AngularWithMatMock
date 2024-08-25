import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {Store} from "@app/core/stores/Store";
import {AuthService} from "@app/core/auth/service/auth.service";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";

@Component({
  standalone: true,
  selector: 'navbar',
  templateUrl: 'navbar.component.html',
  imports: [
    MatToolbar,
    RouterLink,
    MatIcon,
    MatTooltip,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem
  ],
  styleUrls: ['navbar.component.css',
  ]
})
export class NavbarComponent implements OnInit {
  username: string;
  version: string;
  profile: string | undefined;

  constructor(private router: Router,
              private store: Store,
              private authService: AuthService) {
    this.username = this.store.getUIConfig().username;
    this.version = this.store.getUIConfig().version;
    this.profile = this.store.getUIConfig().profile;
  }

  ngOnInit(): void {
  }

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
  }
}
