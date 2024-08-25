import {Component, Injectable, OnInit} from '@angular/core';

@Injectable()
@Component({
  standalone: true,
  templateUrl: 'close.me.component.html',
  styleUrls: ['close.me.component.css']
})
export class CloseMeComponent implements OnInit {

  ngOnInit() {
    window.close();
  }

  close(evt: Event) {
    evt.stopPropagation();
    evt.preventDefault();
    window.close();
  }
}
