import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {fadeAnimation} from "./core/animation/fade.animation";
import {Store} from "@app/core/stores/Store";
import {InitErrorComponent} from "@app/core/errors/components/init-error/init .error.component";
import {FeedbackComponent} from "@app/core/components/feedback/feedback.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InitErrorComponent, FeedbackComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [fadeAnimation]
})
export class AppComponent implements OnInit {
  title = 'MyApp';

  constructor(public store: Store) {
  }

  ngOnInit(): void {
    console.log("App OnInit", this.store.getInitializeStatus().initialized)
  }

  animateRoute(outlet: RouterOutlet) {
    let activated = outlet?.isActivated ? outlet?.activatedRoute : {}
    return activated;
  }
}
