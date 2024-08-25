import {Component, Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, ChildrenOutletContexts, RouterOutlet} from '@angular/router';
import {fadeAnimation} from "@app/core/animation/fade.animation";
import AppUtils from "@app/shared/utils/AppUtils";
import {NavbarComponent} from "@app/core/components/menu/navbar.component";

@Injectable({providedIn: 'root'})
@Component({
  standalone: true,
  templateUrl: 'secure.component.html',
  styleUrls: ['secure.component.css'],
  imports: [
    NavbarComponent,
    RouterOutlet
  ],
  animations: [fadeAnimation]
})
export class SecureComponent implements OnInit {

  username = '';

  constructor(private http: HttpClient,
              private route: ActivatedRoute,
              private contexts: ChildrenOutletContexts,
              private appUtils: AppUtils) {
  }

  ngOnInit() {
    this.username = this.appUtils.getUsername();
  }

  animateRoute(outlet: RouterOutlet) {
    let activated = outlet?.isActivated ? outlet?.activatedRoute : {}
    return activated;
  }
}
