import {Injectable} from "@angular/core";
import {InitializeStatus} from "@app/core/models/InitializeStatus";
import {UIConfig} from "@app/core/models/UIConfig";
import StringUtils from "@app/shared/utils/StringUtils";

@Injectable({providedIn: 'root'})
export class Store {

  private initializeStatus: InitializeStatus = new InitializeStatus();

  uiConfig: UIConfig = new UIConfig('Anonymous', '');

  getUsername(): string {
    this.initializeStatus.errorMessage

    if (StringUtils.isEmpty(this.uiConfig.username)) {
      return "Anonymous";
    } else {
      return this.uiConfig.username;
    }
  }

  setUIConfig(config: UIConfig) {
    this.uiConfig = config;
  }

  getUIConfig() {
    return this.uiConfig;
  }

  getInitializeStatus(): InitializeStatus {
    return this.initializeStatus;
  }
}
