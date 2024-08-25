import {Injectable} from "@angular/core";
import {environment} from 'src/environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from "@angular/router";
import {UIConfig} from "@app/core/models/UIConfig";
import {firstValueFrom} from "rxjs";

@Injectable({providedIn: 'root'})
export class ConfigService {

  constructor(private http: HttpClient, private router: Router) {
  }

  async getConfig(): Promise<UIConfig> {

    let result: any;

    let httpOptions: Object = {

      headers: new HttpHeaders({}),
      responseType: 'json'
    };

    result = await firstValueFrom(this.http.get<UIConfig>(environment.uiConfigUrl, httpOptions));

    return result;
  }
}
