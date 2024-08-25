import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import AppUtils from "@app/shared/utils/AppUtils";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private appUtils: AppUtils) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    let allow = this.appUtils.canAccessRoute(route);

    if (allow) {
      return true;

    } else {
      console.error("Unauthorized! cannot access " + state.url)
      this.handleUnauthorizedRequest(state);
      return false;
    }
  }

  handleUnauthorizedRequest(state: RouterStateSnapshot) {

    // ** handle unauthorized requests here eg rredirect to login page **
    //AppUtils.redirectToLoginPage();

    // ** Or add query params or some other means **

    // const urlTree = this.router.parseUrl('login');
    //
    // if (state.url.length > 2) {
    //   urlTree.queryParams[Constants.AUTH_ERROR] = "Access denied";
    //   urlTree.queryParams[Constants.GOTO_URL_PARAM] = state.url;
    // }
    //return urlTree;
  }
}

