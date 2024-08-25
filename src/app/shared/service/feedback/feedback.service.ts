import {FeedbackType} from "@app/core/components/feedback/feedbackType";
import {Feedback} from "@app/core/components/feedback/feedback";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class FeedbackService {

  feedbackList: Feedback[] = [];

  animationState = 'in';

  addError(msg: string) {
    let feedback = new Feedback(FeedbackType.ERROR, msg);
    this.addFeedback(feedback);
  }

  addWarning(msg: string) {
    let feedback = new Feedback(FeedbackType.WARNING, msg);
    this.addFeedback(feedback);
  }

  addSuccess(msg: string) {
    let feedback = new Feedback(FeedbackType.SUCCESS, msg);
    this.addFeedback(feedback);
  }

  addInfo(msg: string) {
    let feedback = new Feedback(FeedbackType.INFO, msg);
    this.addFeedback(feedback);
  }

  addFeedback(fb: Feedback) {
    //this.feedbackList.push(fb);
    this.feedbackList.unshift(fb);
    this.show();
  }

  setFeedback(value: any) {
    this.clear();

    if (value == null) return;

    if (this.isFeedback(value)) {
      this.addFeedback(value);
      return;
    }

    if (this.isFeedbackArray(value)) {
      this.setFeedbackArray(value);
      return;
    }

    if (typeof value === 'string') {
      let feedback = new Feedback(FeedbackType.ERROR, value);
      this.addFeedback(feedback);
      return;
    }

    let feedback = new Feedback(FeedbackType.ERROR, 'There is a problem. An unknown error occurred. Please try again later.');
    this.addFeedback(feedback);
    throw new Error(value);

  }

  isFeedback(feedback: Feedback) {

    if (feedback == null) return false;

    if ((typeof feedback !== "object")) return false;

    return feedback.hasOwnProperty("type") && feedback.hasOwnProperty("message");
  }

  isFeedbackArray(ar: Feedback[]) {
    if (ar == null) return false;

    if (!Array.isArray(ar)) return false;

    if (ar.length === 0) {
      return false;
    }

    let fb: Feedback = ar[0];
    if (this.isFeedback(fb)) return true;

    return false;
  }

  setFeedbackArray(ar: Feedback[]) {

    this.clear();
    for (let fb of ar) {

      if (!this.isFeedback(fb)) return;

      this.addFeedback(fb);
    }
  }

  hasFeedback() {
    if (this.feedbackList.length > 0) return true;
    return false;
  }

  removeFeedback(item: Feedback) {
    this.removeFromArray(item, this.feedbackList);

    if (!this.hasFeedback()) {
      this.animationState = 'in';
    }
  }

  removeFromArray(item: Feedback, array: Feedback[]) {
    var index = array.indexOf(item, 0);
    if (index > -1) {
      array.splice(index, 1);
    }
  }

  clear() {
    this.feedbackList = [];
    this.animationState = 'in';
  }

  toggleShowFeedback() {
    if (this.hasFeedback()) {
      this.animationState = this.animationState === 'out' ? 'in' : 'out';
    } else {
      if (this.animationState === 'out') {
        this.animationState = 'in';
      }
    }
  }

  hide() {
    this.animationState = 'in';
  }

  show() {
    this.animationState = 'out';
  }

  slideDone(evt: any) {
    if (evt.toState === 'in') {
      //this.clear();
    }
  }
}
