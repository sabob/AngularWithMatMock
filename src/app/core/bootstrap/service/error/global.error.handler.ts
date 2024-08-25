import {ErrorHandler, Inject, Injectable, NgZone} from "@angular/core";
import {DOCUMENT, Location} from "@angular/common";
import {Store} from "@app/core/stores/Store";
import {AuthService} from "@app/core/auth/service/auth.service";
import AppUtils from "@app/shared/utils/AppUtils";
import {FeedbackService} from "@app/shared/service/feedback/feedback.service";

declare global {
  function myriadAppFailedToInitialize(retryUrl: string, message: string, error: any): any;
}

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  private window: Window | null;

  constructor(
    private store: Store,
    private feedbackService: FeedbackService,
    private zone: NgZone,
    private authService: AuthService,
    private location: Location,
    @Inject(DOCUMENT) private document: Document) {
    this.window = this.document.defaultView;
  }

  handleError(error: any) {

    // if (!this.store.getInitializeStatus().isInitialized()) {
    //
    //   if ( this.isDevModeInitializedAuthError(error) ) {
    //     console.info("Could not initialize app because request to ui-config returns 401. Redirecting to IDP");
    //     // If we get an initialize error in dev mode ("npm run start"), chances are that IDP has expired, and we need
    //     // to login again. So instead of assuming initialization broke, we redirect to IDP
    //     AppUtils.redirectToOAuthPage(this.location);
    //     return;
    //   }
    //
    //   let reinitializeUrl = `${document.location.origin}${this.location.prepareExternalUrl(environment.oauthUrl)}`;
    //   let msg = this.convertErrorToMessage(error);
    //   window.myriadAppFailedToInitialize(reinitializeUrl, msg, error);
    //   return;
    // }

    console.error('Error caught in global error handler: ', error);

    // if error is a promise, get the underlying error
    error = AppUtils.getErrorFromPromise(error);

    if (AppUtils.isPossibleAuthenticationError(error)) {
      this.authService.openUnauthenticatedDialog();
      return;
    }

    let msg = error?.message || 'There is a problem. An unknown error occurred!';
    this.zone.run(() => {
      this.feedbackService.addError(msg);
    });
  }

}
