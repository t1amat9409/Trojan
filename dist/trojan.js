"use strict";

var Trojan = Trojan || {};
Trojan.motto = "Give Muscles To Your Web";
Trojan.version = 1;

Trojan.Request = function(url){
	// A small example of object
  var core = {

    // Method that performs the ajax request
    ajax: function (method, url, args) {

      // Creating a promise
      var promise = new Promise( function (resolve, reject) {

        // Instantiates the XMLHttpRequest
        var request = new XMLHttpRequest();
        var uri = url;

        if (args && (method === 'POST' || method === 'PUT')) {
          uri += '?';
          var argcount = 0;
          for (var key in args) {
            if (args.hasOwnProperty(key)) {
              if (argcount++) {
                uri += '&';
              }
              uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
            }
          }
        }

        request.open(method, uri);
        request.send();

        request.onload = function () {
          if (this.status >= 200 && this.status < 300) {
            // Performs the function "resolve" when this.status is equal to 2xx
            resolve(this.response);
          } else {
            // Performs the function "reject" when this.status is different than 2xx
            reject(this.statusText);
          }
        };
        request.onerror = function () {
          reject(this.statusText);
        };
      });

      // Return the promise
      return promise;
    }
  };

  // Adapter pattern
  return {
    'get': function(args) {
      return core.ajax('GET', url, args);
    },
    'post': function(args) {
      return core.ajax('POST', url, args);
    },
    'put': function(args) {
      return core.ajax('PUT', url, args);
    },
    'delete': function(args) {
      return core.ajax('DELETE', url, args);
    }
  };
}

Trojan.style = function(name){
	var el = document.createElement("style");
	el.id = name;
	this.tag = el;
};

Trojan.style.prototype = {
	code : "",
	constructor: Trojan.style, 
	declare : function(style){
		var code = "\n";
		for(var el in style){
			var s = style[el];
			code += "/*Style for "+el+"*/\n\n"+el+" {\n";
			
			for(var prop in s){
				code+="\t"+prop+" : " + s[prop]+";\n";
			}
			
			code += "}\n\n";
		}
		
		this.code += code;
		return this; 
	},
	run : function(){
		this.tag.innerHTML += this.code; 
		document.querySelector("head").appendChild(this.tag);
		return this; 
	},
	load : function(url){
		var that = this;
		var calls = {
			pass : function(data){
				that.code = data;
				that.run();
			},
			fail : function(error){
				alert(error);
			}
		}
		
		Trojan.Request(url).get({}).then(calls.pass).catch(calls.fail);
		return this;
	}
};
