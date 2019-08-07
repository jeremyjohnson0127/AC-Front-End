const express    = require("express");
const bodyParser = require("body-parser");
const path       = require("path");
const request    = require("request");
const _          = require("underscore");
const serveStatic = require('serve-static');
const cookieParser = require('cookie-parser');
const config  = require("./config");
const options = config.getOptions();

let app = port = null;
function get_querystring(url) {
  let querystring = "";
  let split = url.split("?");

  if (split.length > 1) {
    querystring = "?" + split[1];
  }

  return querystring;
}
let cookieVal = '';

function request_server(req, res, path, method, stagingUrl) {
  let options = {};
  options.url = stagingUrl + path;
  options.json = req.body;
  options.method = method;
  options.headers = { 
    'host': 'staging.compliancedepartment.online',
    'connection': 'keep-alive',
    'cache-control': 'max-age=0',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'accept-language': 'uk-UA,uk;q=0.9,ru;q=0.8,en-US;q=0.7,en;q=0.6',
    'cookie': cookieVal || req.headers.cookie};
  request(
    options,
    function(error, remote_response, body) {
      if (path.includes('login')) {
        cookieVal = remote_response.headers['set-cookie'];
      }
      if (error) {
        console.log("Error requesting remote server: "+ error);
      } else {
        res.set('Content-Type', remote_response.headers["content-type"]);
        res.status(remote_response.statusCode).send(remote_response.body);
      }
    }
  );
};

function registerHtmlExtensions(extensions) {
  express.static.mime.define({'text/html': extensions});
}

function registerPublicFolder(path1, useLivereload, livereloadPort) {
  path1 = path1 || "./";
  
  app = express();

  app.use(bodyParser.urlencoded());
  app.use(bodyParser.json());
  app.use(express.static(path1));
  app.use('/public/', serveStatic(path.join(__dirname, '/public')));
  app.use('/public/files/', function(req, res, next) {
    return next();
  }, serveStatic(path.join(__dirname, '/public'))); 
  app.use('/scripts/', serveStatic(path.join(__dirname, '/node_modules')));
  
}

function registerRedirectionsRules(redirectionRules) {
  if (!app) {
    registerPublicFolder();
  }
  redirectionRules.forEach(function(rule) {
      app.route('/*').all(function(req, res) {
        var stagingUrl =  `https://staging.compliancedepartment.online`;
        request_server(req, res, req.url, req.method, stagingUrl);
	  });
  });
};



function start(_port) {
  port = _port;
  
  if (!app) {
    registerPublicFolder();
  }

  app.listen(port);
  console.log("Server running at http://localhost:"+ port +"/");
}



registerHtmlExtensions(options.html_extensions);
registerPublicFolder(options.public_path, options.livereload, null);
registerRedirectionsRules(options.redirection_rules);
	
start(options.port);
