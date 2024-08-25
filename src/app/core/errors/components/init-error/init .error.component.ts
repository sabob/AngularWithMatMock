import {Component, OnInit} from '@angular/core';
import {Store} from "@app/core/stores/Store";

@Component({
  selector: 'init-error',
  standalone: true,
  templateUrl: './init .error.component.html',
  styleUrls: ['./init .error.component.css']

})
export class InitErrorComponent implements OnInit {
  title = 'initialization error';

  constructor(public store: Store) {
  }

  ngOnInit() {
    console.log("Error done")
  }
}
