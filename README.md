# AngularWithMatMock

Example project using Angular with Material and a Mock mode.

# Developing modes

## Mock mode

Mock mode allows for a fast development lifecycle without having a running server. Instead, you
would run against static JSON files that are located in the ```mock-data``` folder. You can create your own files, or
copy from live server request output.

In this mode, you start the app on port 80, and ajax requests are forwarded to a mock server running on port 13000.

The mock server can be configured in the file
``` mock-server.js ```

To start this mode do:

for *nix: ```npm run mock```

for Windows: ```npm run mock-win```

The app is available at:

```http://localhost/myapp```

## Dev mode

In this mode the angular frontend is running against a server on your dev machine.

You will likely do most of your front development in this mode or server-mode below.

NOTE: when using oauth to login, this mode won't 100% replicate all the behaviors expected. Use server mode or build and
run the jar. The reason for inconsistency, is because the requests to the root url (/) is served by Angular
which is not protected and will always render. With server-mode a request to root will be served by the server which in
turn will redirect to the IDP server to login.

This is also the reason why a deep-link request for an unauthorized user won't work because the Express server doesn't
store the initial deep-link request. IOW, once the login occurred, the Express server doesn't redirect the user to the
initial deep-link request.

Another difference is if a session times out, and a re-login is initiated, the /close-me route won't be available unless
the index.html page is available in the resource/static folder. For the index.html to be available run the "server mode"
first which copies the index.html to the build folder.

The logging out behavior is also different from server-mode, since the root url ('/') is served from Express and not
Quarkus, so the redirect to IDP doesn't occur. TODO, there might be a way around this issue through the proxy.cong.js
onProxyRes functions. Need to investigate further.

This mode starts the angular embedded server on port 4200 and ajax requests are forwarded (via an Angular Proxy) to the
Quarkus  app running on port 8083.

a NOTE on ports. Because of microservices we end up developing on multiple apps at once, meaning we have to _start_
these apps on different ports. So be sure to align the proxy.conf.js port with the application.-local.properties port.

To run this mode do:
```npm run start```

Also start the Quarkus Application on port 8084.

The app is available at:

```http://localhost:4200/myapp```

### Note on URL -> /oauth2/authorization

This is the url the UI will redirect to if there is a CORS or 401 error. When Quarkus receives this url and the
user isn't logged in, it will redirect the user the IDP login page.

When developing Angular on port 42000 we have to forward this request to Quarkus backend to allow Quarkus to
handle it properly. By default, all requests that are handled by Quarkus will store the request. 
After the login succeeds the user is redirect back to the original url.

When the request, /oauth2/authorization, arrives, Quarkus recognizes this URL and forwards it to the IDP for
login.

Once login succeeds, Quarkus forwards the url /oauth2/authorization (because it was the original incoming
request) to Quarkus to process.

Quarkus must map the url, /oauth2/authorization, to redirect to the application context-path,
'/myapp'.

## Server mode

In this mode we simulate the environment one would have when the app is deployed on the server.

**NOTE:** use this mode if you want to test deep-linking for an unauthenticated user. Reason being, for deep-linking to
work for unauthenticated users, the request needs to reach the  Quarkus server and Quarkus will store the
deep-link request in its session before redirecting to the IDP. Once the login succeeds and browser redirects back to
 Quarkus server, the user is redirected once again to the original, deep-link, request.

However, if you run in the *dev mode*, the initial request non-authenticated request is served by Angular Express server
and thus never reaches Quarkus.

you would need to serve static/index.html from Quarkus, not from angular' Express server.

In this mode the UI is deployed to the Quarkus
```resources/static``` folder and is available at:

```http://localhost:8080/myapp```

To run this mode do:
```npm run server```

Changes made to the angular app is copied to the ```build/resources/main/static```
folder of the app.

NOTE: Start the gateway app (RiskApplication) only after the above command has finished and Angular build is watching
for changes,
otherwise Tomcat doesn't pick up the index.html file, and you will receive a 404 error.

NOTE: If you are not using Gradle eg. Intellij internal build tool, adjust the path above to the correct output folder.
eg. ```production/out/resources/main/static``` or ```build/out/resources/main/static```. IOW, make sure to copy the
output to where your setup reads the Web app from.

Depending on your IDE or dev environment you might need to tweak your setup in order Quarkus to reload the files.

In IntelliJ you might want to open the "Edit Configuration" dialog, click the "modify options" link, and set the
```on frame deactivation``` and ```On 'Update' action``` properties to update resources.

### Test Jar

To run the built .jar locally, first run ```gradlew build```, then run the following command from your
apps ```root-folder```:

```

