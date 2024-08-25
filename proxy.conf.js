const contextPath = '/myapp';
const port = '8083';
const host = 'http://localhost:' + port + contextPath + '/';

// NOTE:  requests to the root url ('/') aren't intercepted by the proxy, which limits some functionality specifically
// around login/logout

const pathRewriteRegex = {};
pathRewriteRegex['^' + contextPath] = '';

const PROXY_CONFIG = {};

PROXY_CONFIG[contextPath + '/'] = {
  target: host, // the hostname of the Spring Boot server
  secure: false,
  pathRewrite: pathRewriteRegex, // remove the context-path from the url that is passed onto the server
  logLevel: "debug",

  bypass: function (req, res, proxyOptions) {

    let isXHRRequest = req.xhr;
    let isJsonAcceptHeader = req.headers.accept && req.headers.accept.indexOf('json') > -1;

    // Adjust the logic below to include more urls to forward to the backend-for-frontend
    if (
      req.url.startsWith(contextPath + '/login') ||
      req.url.startsWith(contextPath + '/logout') ||
      req.url.startsWith(contextPath + '/login/oauth2') ||
      req.url.startsWith(contextPath + '/oauth2') ||
      req.url.startsWith(contextPath + '/close-me') ||
      req.url.startsWith(contextPath + '/api') ||
      req.url.startsWith(contextPath + '/j_security_check') ||
      isJsonAcceptHeader ||
      isXHRRequest) {

      console.log("forward request, " + req.url + ", to localhost:" + port);
      return;
    }

    console.log("proxy bypassed. Serve the request, " + req.url + ", from angular' express server");
    return req.url;

  }

  // onProxyRes: (proxyRes, req, res) => {
  //   let originalBody = Buffer.from('');
  //   proxyRes.on('data', function (data) {
  //     originalBody = Buffer.concat([originalBody, data]);
  //   });
  //   proxyRes.on('end', function () {
  //     // If we logout and server responds with a 302, we forcefully redirect to the oauth2 url specified above.
  //     // This simulates the response we will get when the UI is deployed on the server.
  //     if (req.path.startsWith('/logout') && res.statusCode == 302) {
  //       res.set('Location', oauthUrl);
  //       //res.status(401);
  //     }
  //
  //   });
  // }
}


module.exports = PROXY_CONFIG;
