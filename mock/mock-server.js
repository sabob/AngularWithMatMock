const express = require('express');
const path = require('path');
const fs = require('fs');
let bodyParser = require('body-parser');
let morgan = require('morgan');

const app = express()

const port = 13000

const oneDayInMillis = 1000 * 60 * 60 * 24;
const contextPath = '/myapp';
const loginPage = '/login.html';
const JSESSIONID = 'JSESSIONID'
const jwtTokenName = 'JwtToken'
const myappTokenName = 'myappToken'
const dataDir = __dirname + '/mock-data';

setup = function (app) {
  app.use(bodyParser.json());
  app.use(morgan('dev'))

  app.use(function (req, res, next) {
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    next();
  });

  app.get(contextPath + '/api/unauth', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.status(401);
    res.send();
  });

  app.post(contextPath + '/login', (req, res) => {
    let tokenPath = path.join(dataDir, 'jwtToken.json');
    let jwtToken = fs.readFileSync(tokenPath, 'utf8');
    let base64Value = base64(jwtToken);
    res.cookie(jwtTokenName, base64Value, {maxAge: oneDayInMillis, httpOnly: true, path: contextPath});

    tokenPath = path.join(dataDir, myappTokenName + '.json');
    let myappToken = fs.readFileSync(tokenPath, 'utf8');
    base64Value = base64(myappToken);
    res.cookie(jwtTokenName, base64Value, {maxAge: oneDayInMillis, httpOnly: true, path: contextPath});
    res.cookie(myappTokenName, base64Value, {maxAge: oneDayInMillis, httpOnly: false, path: contextPath});
    res.cookie(JSESSIONID, "", {maxAge: oneDayInMillis, httpOnly: true, path: contextPath});
    res.redirect(302, contextPath);
  });

  // depending on technology, you can use j2ee login below
  app.post(contextPath + '/j_security_check', (req, res) => {
    res.cookie(JSESSIONID, "", {maxAge: oneDayInMillis, httpOnly: true, path: contextPath});
    res.redirect(302, contextPath);
  });

  app.get(contextPath + '/logout', (req, res) => {
    res.cookie(JSESSIONID, "", {maxAge: -1, httpOnly: true, path: contextPath});
    res.redirect(302, contextPath + loginPage);
  });

  app.get(contextPath + '/api/v1/config/ui', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.sendFile(path.join(dataDir, 'ui-config.json'));

  });

  app.get(contextPath + '/api/customers', (req, res) => {
    let query = req.query.query;
    let pageSize = req.query.pageSize;
    let page = req.query.page;

    let file = path.join(dataDir, 'customers.json');
    let json = fs.readFileSync(file, "utf8");
    const customers = JSON.parse(json)

    setTimeout(() => {
      res.send(customers);
    }, 100);
    //let result = filter(customers, query, page, pageSize);
    //res.send(result);

  });

  app.post(contextPath + '/api/customers', (req, res) => {
    // Test a 401 auth error response
    // res.status(401);
    // res.send();
    // return;

    res.set('Content-Type', 'application/json');
    // if (Math.random() < 0.5) {
    //   throw new Error("Error")
    // }

    let body = req.body;
    body.id = Math.floor(Math.random() * 1000);
    let result = JSON.stringify(body);

    setTimeout(() => {
      //res.send(result);
      let id = req.params.id || 1;
      let file = path.join(dataDir, `customer-${id}.json`);
      res.sendFile(file);
    }, 100);

  });

  app.put(contextPath + '/api/customers/:id', (req, res) => {
    res.set('Content-Type', 'application/json');
    let body = req.body;
    body.id = Math.floor(Math.random() * 1000);
    let id = req.params.id || 1;
    let file = path.join(dataDir, `customer-${id}.json`);
    res.sendFile(file);
  });

  app.get(contextPath + '/api/customers/:id', (req, res) => {

    // set a timeout to create an artificial delay in response
    setTimeout(() => {
      let id = req.params.id || 1;
      let file = path.join(dataDir, `customer-${id}.json`);
      res.sendFile(file);

    }, 100);
  });
}

setup(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

function base64(str) {
  let buff = new Buffer(str);
  let base64Value = buff.toString('base64');
  return base64Value;
}

function filter(customers, query, page, pageSize) {
  if (query == null) query = '';

  query = query.toLowerCase();
  let result = customers.filter(option => option.description.toLowerCase().indexOf(query) >= 0);

  result = paginate(result, page, pageSize);
  return result;
}

function paginate(array, page, pageSize) {
  page = parseInt(page);
  pageSize = parseInt(pageSize);
  page = isNaN(page) ? 0 : page;

  pageSize = isNaN(pageSize) ? 20 : pageSize;
  const indexMin = page * pageSize;
  const indexMax = indexMin + pageSize;


  const paginatedArray = array.filter(
    (x, index) => index >= indexMin && index < indexMax
  )

  return paginatedArray;
}

