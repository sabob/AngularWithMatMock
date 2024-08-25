import {Injectable, NgZone} from "@angular/core";
import {environment} from '@app/./../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {Credentials} from "@app/core/models/Credentials";
import {UnauthenticatedDialog} from "@app/core/components/unauthenticated-dialog/unauthenticated.dialog";

@Injectable({providedIn: 'root'})
export class AuthService {

  logoutUrl = environment.logoutUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private location: Location,
    private zone: NgZone,
    private dialog: MatDialog) {
  }

  async login(credentials: Credentials) {

    try {

      let headers = new HttpHeaders({});
      headers.set('Content-Type', 'application/x-www-form-urlencoded');

      let httpOptions: Object = {
        headers,
      };

      let body: any = new FormData();
      body.append("username", credentials.username);
      body.append("password", credentials.password);

      let loginUrl = environment.loginUrl;
      let result = await this.http.post<any>(loginUrl, body, httpOptions).toPromise();

      return result;

    } catch (err: any) {
      // TODO Should we not throw here and let global handler check it?
      console.error("Error: ", err);
    }
  }

  async logout() {

    // Reload app at root url to ensure store or other caches are cleared
    let url = `${document.location.origin}${this.location.prepareExternalUrl(this.logoutUrl)}`;
    console.info("LOGGING out with url: ", url);

    document.location.assign(url);
  }

  openUnauthenticatedDialog(): void {

    let data = {
      postLoginUrl: environment.postLoginUrl
    };

    this.zone.run(() => {
      const dialogRef = this.dialog.open(UnauthenticatedDialog, {
        data: data
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        // do something here when dialog closes
      });
    });
  }
}
