import {Component, HostListener, Injectable, OnInit} from '@angular/core';
import {SlideInFromRightAnimation, SlideUpDownAnimation} from "@app/core/animation/animations";
import {FeedbackType} from "@app/core/components/feedback/feedbackType";
import {Feedback} from "@app/core/components/feedback/feedback";
import {MatListModule, MatNavList} from "@angular/material/list";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {NgClass} from "@angular/common";
import {FeedbackService} from "@app/shared/service/feedback/feedback.service";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatLineModule} from "@angular/material/core";

@Injectable({providedIn: 'root'})
@Component({
  standalone: true,
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  imports: [
    MatNavList,
    MatIconModule,
    MatLineModule,
    MatListModule,
    MatButtonModule,
    NgClass
  ],
  animations: [SlideUpDownAnimation, SlideInFromRightAnimation]
})
export class FeedbackComponent implements OnInit {

  // Make feedbackType enum available in template
  FeedbackType = FeedbackType;

  constructor(public service: FeedbackService) {
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    if (event.key == "Escape") {
      this.hideHandler();
    }
  }

  ngOnInit(): void {
  }

  getFeedbackIcon(feedback: Feedback): string {
    if (feedback.type == FeedbackType.WARNING) {
      return "warning";
    }

    if (feedback.type == FeedbackType.SUCCESS) {
      return "check";
    }

    if (feedback.type == FeedbackType.INFO) {
      return "info";
    }
    return "clear";
  }

  getFeedbackTextColor(feedback: Feedback): string {
    //  By default no styling applied on text
    return "";
  }

  getFeedbackIconColor(feedback: Feedback): string {
    if (feedback.type == FeedbackType.WARNING) {
      return "text-warning";
    }

    if (feedback.type == FeedbackType.SUCCESS) {
      return "text-success";
    }

    if (feedback.type == FeedbackType.INFO) {
      return "text-info";
    }

    return "text-error";
  }


  // highlight() {
  //
  //     $(this).each(function () {
  //
  //         var el = $(this);
  //
  //         $("<div/>")
  //
  //             .width(el.outerWidth())
  //
  //             .height(el.outerHeight())
  //
  //             .css({
  //
  //                 "position": "absolute",
  //
  //                 "left": el.offset().left,
  //
  //                 "top": el.offset().top,
  //
  //                 "background-color": "#009DDB",
  //
  //                 "opacity": ".9",
  //
  //                 "z-index": "9999"
  //
  //             }).appendTo('body').delay(400).fadeOut(1000).queue(function () { $(this).remove(); });
  //
  //     });
  //
  // }

  private hideHandler() {
    if (this.service.hasFeedback()) {
      this.service.hide();
    }
  }
}
