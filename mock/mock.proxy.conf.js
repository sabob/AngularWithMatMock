const contextPath = '/myapp';
const port = '13000';
const host = 'http://localhost:' + port;

const pathRewriteRegex = {};
const PROXY_CONFIG = {};

// NOTE:  requests to the root url ('/') aren't intercepted by the proxy, which limits some functionality specifically
// around login/logout

PROXY_CONFIG[contextPath + '/'] = {
  target: host,
  secure: false,
  pathRewrite: pathRewriteRegex, // remove the context-path from the url that is passed onto the server
  logLevel: "debug",
  bypass: function (req, res, proxyOptions) {

    // Ignore sourceMap calls
    if(req.url.indexOf('.js.map') < 0 && req.url.indexOf('@fs') < 0) {
      console.log("mock.proxy.request url: ", req.url)
    }

    let isXHRRequest = req.xhr;
    let isJsonAcceptHeader = req.headers.accept && req.headers.accept.indexOf('json') > -1;

    if (
      req.url.endsWith('/login') ||
      req.url.endsWith('/logout') ||
      req.url.endsWith('/j_security_check') ||
      isJsonAcceptHeader ||
      isXHRRequest) {

      console.log("forward request, " + req.url + ", to " + host);
      return;
    }

    //console.log("proxy bypassed. Serve the request, " + req.url + ", from angular' express server");
    return req.url;
  },

  // "/claims-manager/logout": {
  //   "target": "http://localhost:3000/",
  //   "secure": false,
  //   "logLevel": "debug"
  // },
  //
  // "/claims-manager/api": {
  //   "target": "http://localhost:3000/",
  //   "secure": false,
  //   //pathRewrite: {'^/claims-manager/api' : ''}, // remove claims-manager when forwarding to remote host
  //   "logLevel": "debug"
  // },
  //
  // "/requirements-api": {
  //   "target": "http://localhost:3000/claims-manager/",
  //   "secure": false,
  //   "logLevel": "debug"
  // },
  //
  // "/claims-api/*": {
  //   "target": "http://localhost:3000/claims-manager/",
  //   "secure": false,
  //   "logLevel": "debug"
  // },

  // "/risk-party-api/*": {
  //   "target": "http://localhost:3000/claims-manager/",
  //   "secure": false,
  //   "logLevel": "debug",
  //
  //   // "bypass": function (req, res, proxyOptions) {
  //   //   if (req.url.endsWith(".html")) {
  //   //     return true;
  //   //   }
  //   //   if (req.url.endsWith("/")) {
  //   //     return true;
  //   //   }
  //   //
  //   //   if (req.url.endsWith(".css")) {
  //   //     return true;
  //   //   }
  //   //
  //   //   if (req.url.endsWith(".js")) {
  //   //     return true;
  //   //   }
  //   //   return false;
  //   // }
  // }
}
module.exports = PROXY_CONFIG;
