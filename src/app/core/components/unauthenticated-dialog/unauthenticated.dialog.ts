import {Component, Inject, NgZone} from "@angular/core";
import {DOCUMENT, Location} from "@angular/common";
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {FeedbackService} from "@app/shared/service/feedback/feedback.service";
import {MatIcon} from "@angular/material/icon";
import {MatDivider} from "@angular/material/divider";

export interface DialogData {
  postLoginUrl: string;
}

@Component({
  standalone: true,
  selector: 'unauthenticated-dialog',
  templateUrl: 'unauthenticated.dialog.html',
  styleUrls: ['unauthenticated.dialog.css'],
  imports: [
    MatIcon,
    MatDialogContent,
    MatDialogActions,
    MatDivider
  ]
})
export class UnauthenticatedDialog {

  private window: Window | null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private zone: NgZone,
    private location: Location,
    @Inject(DOCUMENT) private document: Document,
    private unauthenticatedDialogRef: MatDialogRef<UnauthenticatedDialog>,
    private windowBlockedDialog: MatDialog,
    private feedbackService: FeedbackService,
  ) {
    this.window = this.document.defaultView;
  }

  onLoginClick(): void {
    this.unauthenticatedDialogRef.close();
    let openedWindow = this.openLoginWindow();

    // if myWindow is null, it means that the window was blocked by browser
    if (openedWindow == null) {
      this.feedbackService.addError("Login Window Blocked by browser!");
    }
  }

  onCancelClick() {
    this.unauthenticatedDialogRef.close();
  }

  openLoginWindow(): Window | null {
    let url = `${document.location.origin}${this.location.prepareExternalUrl(this.data.postLoginUrl)}`;
    return this.openCenteredWindow(url);
  }

  openCenteredWindow(url: string): Window | null {
    let width: number = window.document.body.clientWidth;
    let height: number = window.document.body.clientHeight;
    height = height * 0.65;
    width = width * 0.85;
    let left = (window.screen.availWidth / 2) - (width / 2);
    let top = (screen.availHeight / 2) - (height / 2);
    let windowFeatures = "width=" + width + ",height=" + height + ",left=" + left + ",top=" + top + "screenX=" + left + ",screenY=" + top;

    console.info("open login window at: " + url);

    let myWindow = window.open(url, "OAuth", windowFeatures);
    return myWindow;
  }

}
