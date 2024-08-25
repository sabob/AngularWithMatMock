export const environment = {

  production: false,

  mock: true,

  // oauthUrl: 'login.html',
  postLoginUrl: 'close-me',

  loginUrl: 'login',

  oauthUrl: 'login.html',

  logoutUrl: 'logout',

  uiConfigUrl: "api/v1/config/ui",

  customersUrl: "api/customers",

  externalServiceUrl: "external/service/api/something/${variable}/list",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
