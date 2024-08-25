import {Injectable} from "@angular/core";
import {Store} from "@app/core/stores/Store";
import {UIConfig} from "@app/core/models/UIConfig";
import {ConfigService} from "@app/core/bootstrap/service/config.service";

@Injectable({providedIn: 'root'})
export class InitService {

  constructor(private configService: ConfigService,
              private store: Store) {
  }

  async init() {

    // NOTE: this method is called from app.module.ts through provide: APP_INITIALIZER, we must handle the error here
    // and not let it through to the global error handler, as that will cause an infinite loop
    try {

      let uiConfig: UIConfig = await this.configService.getConfig();

      if (uiConfig == null) {
        return Promise.reject("App cannot initialize as config could not be retrieved from server");
      }

      this.store.setUIConfig(uiConfig);
      this.store.getInitializeStatus().initialized = true;

    } catch (err) {
      return Promise.reject(err);
    }
    return Promise.resolve();
  }
}
