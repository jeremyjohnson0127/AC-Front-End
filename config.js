var fs         = require("fs");
var _          = require("underscore");
var configfile = ".redirect-rest.json";

exports.getOptions = function() {
  var data = fs.readFileSync(configfile);

  if (!data) {
    log.error("Can't find a .redirect-rest.json file. Please create it to tell us what requests you want to redirect to a remote server.");
    return;
  }

  var options = JSON.parse(data);

  options = _.defaults(options, {
    html_extensions : ["html", "php", "jsp"],
    public_path     : "./",
    port            : 8080,
    proxy           : null,
    livereload      : false,
    livereloadPort  : 35729
  });

  if (!options.redirection_rules || options.redirection_rules == "") {
    console.log("You must set a value for `redirection_rules` attribute on your .redirect-rest.json file");
    return;
  }

  console.log("--------------");
  console.log("CONFIG OPTIONS");
  console.log("--------------");
  console.log("public_path:     "+ options.public_path);
  console.log("html_extensions: "+ options.html_extensions);
  console.log("redirection_rules:  ");
  options.redirection_rules.forEach(function(rule) {
     console.log("");
	 console.log("   path: "+ rule.path);
	 console.log("   remote_url: "+rule.remote_url);
	 console.log("   proxy: "+rule.proxy);
	 console.log("");
  });
  console.log("port:            "+ options.port);
  console.log("livereload:      "+ options.livereload);
  console.log("livereloadPort:  "+ options.livereloadPort);
  
  console.log("");
  return options;
};
