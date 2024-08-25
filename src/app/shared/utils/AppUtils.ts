import {environment} from "@env/environment";
import {HttpErrorResponse} from "@angular/common/http";
import {ActivatedRouteSnapshot, Router} from "@angular/router";
import {Location} from "@angular/common";
import {Injectable} from "@angular/core";
import {EMPTY, Observable, throwError} from "rxjs";
import {AbstractControl, FormArray, FormControl, FormGroup} from "@angular/forms";
import StringUtils from "@app/shared/utils/StringUtils";
import {UIConfig} from "@app/core/models/UIConfig";
import {Store} from "@app/core/stores/Store";
import {FeedbackService} from "@app/shared/service/feedback/feedback.service";

@Injectable({providedIn: 'root'})
export default class AppUtils {

  constructor(private store: Store, private feedbackService: FeedbackService) {
  }

  handleHttpErrorAndRethrow = (error: HttpErrorResponse): Observable<HttpErrorResponse> => {
    this.handleHttpError(error);
    return throwError((error));
  }

  handleHttpError = (error: HttpErrorResponse): Observable<never> => {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.message);
      this.feedbackService.addError(`You are either offline or a network error occurred`);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      // Show a user-facing error message.
      this.feedbackService.addError(`Backend returned code ${error.status}`);
    }
    //return throwError(() => new Error('Something bad happened; please try again later.'));
    return EMPTY;
  }

  static isResponseTextTheIDPLoginPage(error: HttpErrorResponse) {
    if (error && error.error && error.error.text) {
      let txt: string = error.error.text;

      if (
        (txt.indexOf("<html") >= 0 &&
          txt.indexOf("<body") >= 0) ||
        (txt.indexOf("<!doctype html") >= 0 &&
          txt.indexOf("<body") >= 0)) {
        return true;
      }
    }
    return false;
  }

  static isHttpParsingError(error: any) {
    let msg: string = error.message;

    if (msg == null) {
      return false;
    }

    if (msg.startsWith('Http failure during parsing')) {
      return true;
    }
    return false;
  }

  static isUnauthenticatedHttpRequest(err: HttpErrorResponse) {
    return !this.isAuthenticatedHttpRequest(err);
  }

  static isAuthenticatedHttpRequest(err: HttpErrorResponse) {

    if (!(err instanceof HttpErrorResponse)) {
      return true;
    }

    let response: HttpErrorResponse = err;

    if (response.status == 401) {
      return false;
    }

    return true;
  }

  /**
   * This method isn't 100% correct. We say request is CORS if the httpstatus is 0.
   * But in reality, 0 could also be because of a network error or being offline.
   *
   * See this discussion for overview of why we implemented this hack:
   * https://keycloak.discourse.group/t/authorizationendpoint-does-not-support-cors/3495
   */
  static isCorsError(err: any) {
    if (!(err instanceof HttpErrorResponse)) {
      return false;
    }

    let response: HttpErrorResponse = err;

    if (response.status == 0) {
      return true;
    }

    return false;
  }

  static reloadPage() {
    document.location.reload();
  }

  static redirectToOAuthPage(location: Location) {
    let url = `${document.location.origin}${location.prepareExternalUrl(environment.oauthUrl)}`;
    console.warn("Redirecting to IDP ", url);
    document.location.assign(url);
  }

  static sleep(milliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  static getCookie(name: string) {
    name = name + "=";
    let decodedCookie = decodeURIComponent(document.cookie);

    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }

  static hasCookie(name: string) {
    return AppUtils.getCookie(name) != null;
  }

  isProdProfile() {
    let uiConfig = this.getUIConfig();
    let profile = uiConfig.profile;
    return profile == 'prod';
  }

  isAdmin() {
    let appToken = this.getUIConfig();
    if (appToken) {
      return appToken.admin;
    }
    return false;
  }

  getUIConfig(): UIConfig {
    let uiConfig: UIConfig = this.store.getUIConfig();
    return uiConfig;
  }

  getUsername() {
    return this.store.getUsername();
  }

  canAccessRoute(route: ActivatedRouteSnapshot) {

    // TODO use roles to check if route can be accessed
    //let roles = this.store.getUIConfig().roles;

    return true;
  }

  static isPossibleAuthenticationError(error: any) {

    // When we receive cors error we must redirect to login instead of doing a page refresh (location.assign) otherwise
    // we might end up with an infinite loop because we do an xhr request when the app loads and if that request
    // returns a CORS, we start the infinite cycle.
    if (AppUtils.isCorsError(error)) {
      return true;
    }

    // TODO below is hacking time. If their is a parse error, it *might* be because the server redirected an XHR request
    // to the Identity provider (IDP). If the token isn't valid anymore the user is redirected to the HTML login page.
    // So if a parse error occurs it might be because the response is html instead of JSON. Below we try to determine
    // if the response is from the IDP HTML login page.
    if (AppUtils.isHttpParsingError(error) && AppUtils.isResponseTextTheIDPLoginPage(error)) {
      return true;
    }

    if (AppUtils.isAuthenticatedHttpRequest(error)) {
      return false;
    }

    return true;

  }

  static getErrorFromPromise(error: any): any {
    if (error.promise && error.rejection) {
      // Promise rejection wrapped by zone.js
      error = error.rejection;
    }
    return error;
  }

  static deleteCookie(name: string) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  static getFormControlsAsArray(abstractControl: any): AbstractControl[] {
    if (!abstractControl.controls) return [];
    let result: AbstractControl[] = [];
    AppUtils.getAllControlsAsArray([abstractControl], result);
    return result;
  }

  static getAllControlsAsArray(abstractControls: AbstractControl[], result: AbstractControl[]): void {
    abstractControls.forEach((abstractControl) => {
      if (abstractControl instanceof FormControl) {
        result.push(abstractControl);
      } else if (abstractControl instanceof FormGroup) {
        AppUtils.getAllControlsAsArray(
          Object.values((abstractControl as FormGroup).controls), result);
      } else if (abstractControl instanceof FormArray) {
        AppUtils.getAllControlsAsArray((abstractControl as FormArray).controls, result);
      }
    });
  }

  static validateFormAndMarkAsDirty(abstractControl: AbstractControl): boolean {
    AppUtils.validateFormAndMarkAllControlsAsDirty([abstractControl]);
    return abstractControl.valid;
  }

  static validateFormAndMarkAllControlsAsDirty(abstractControls: AbstractControl[]): void {
    abstractControls.forEach((abstractControl) => {
      if (abstractControl instanceof FormControl) {
        (abstractControl as FormControl).updateValueAndValidity();
        (abstractControl as FormControl).markAsDirty({onlySelf: true});
      } else if (abstractControl instanceof FormGroup) {
        AppUtils.validateFormAndMarkAllControlsAsDirty(
          Object.values((abstractControl as FormGroup).controls)
        );
      } else if (abstractControl instanceof FormArray) {
        AppUtils.validateFormAndMarkAllControlsAsDirty((abstractControl as FormArray).controls);
      }
    });
  }

  static markFormAsDirty(abstractControl: AbstractControl): void {
    AppUtils.markAllControlsAsDirty([abstractControl]);
  }

  static markAllControlsAsDirty(abstractControls: AbstractControl[]): void {
    abstractControls.forEach((abstractControl) => {
      if (abstractControl instanceof FormControl) {
        (abstractControl as FormControl).markAsDirty({onlySelf: true});
      } else if (abstractControl instanceof FormGroup) {
        AppUtils.markAllControlsAsDirty(
          Object.values((abstractControl as FormGroup).controls)
        );
      } else if (abstractControl instanceof FormArray) {
        AppUtils.markAllControlsAsDirty((abstractControl as FormArray).controls);
      }
    });
  }

  static markFormAsPristine(abstractControl: AbstractControl): void {
    AppUtils.markAllControlsAsPristine([abstractControl]);
  }

  static markAllControlsAsPristine(abstractControls: AbstractControl[]): void {
    abstractControls.forEach((abstractControl) => {
      if (abstractControl instanceof FormControl) {
        (abstractControl as FormControl).markAsPristine({onlySelf: true});
      } else if (abstractControl instanceof FormGroup) {
        AppUtils.markAllControlsAsPristine(
          Object.values((abstractControl as FormGroup).controls)
        );
      } else if (abstractControl instanceof FormArray) {
        AppUtils.markAllControlsAsPristine((abstractControl as FormArray).controls);
      }
    });
  }

  static fromBase64JsonOrNull(base64Str: string) {

    try {
      if (StringUtils.isEmpty(base64Str)) {
        return null;
      }

      let json: string = atob(base64Str);

      let obj = AppUtils.fromJsonOrNull(json);
      return obj;

    } catch (err) {
      console.error(err);
    }

    return null;
  }

  static fromJsonOrNull(str: string) {

    try {

      let obj = JSON.parse(str);
      return obj;

    } catch (err) {
      console.error(err);
    }
    return null;
  }

  static addPathToUrl(router: Router, location: Location, param: string) {
    // Get the current URL from the activated route
    const currentUrl = router.url;
    // Append the desired path parameter
    const newUrl = `${currentUrl}/${param}`;
    // Update the URL in the address bar without reloading the route
    location.go(newUrl);
  }
}
