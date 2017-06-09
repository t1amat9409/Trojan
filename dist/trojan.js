"use strict";

var Trojan = Trojan || {};

if(typeof define==='function' && define.amd) {
	define( 'Trojan ', Trojan  );
} else if ( 'undefined' !== typeof exports && 'undefined' !== typeof module ) {
	module.exports = Trojan ;
}

// polyfills

if ( self.requestAnimationFrame === undefined || self.cancelAnimationFrame === undefined ) {

	// Missing in Android stock browser.

	( function () {

		var lastTime = 0;
		var vendors = [ 'ms', 'moz', 'webkit', 'o' ];

		for ( var x = 0; x < vendors.length && ! self.requestAnimationFrame; ++ x ) {

			self.requestAnimationFrame = self[ vendors[ x ] + 'RequestAnimationFrame' ];
			self.cancelAnimationFrame = self[ vendors[ x ] + 'CancelAnimationFrame' ] || self[ vendors[ x ] + 'CancelRequestAnimationFrame' ];

		}

		if ( self.requestAnimationFrame === undefined && self.setTimeout !== undefined ) {

			self.requestAnimationFrame = function ( callback ) {

				var currTime = Date.now(), timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
				var id = self.setTimeout( function () {

					callback( currTime + timeToCall );

				}, timeToCall );
				lastTime = currTime + timeToCall;
				return id;

			};

		}

		if ( self.cancelAnimationFrame === undefined && self.clearTimeout !== undefined ) {

			self.cancelAnimationFrame = function ( id ) {

				self.clearTimeout( id );

			};

		}

	}() );

}

if ( Math.sign === undefined ) {

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign

	Math.sign = function ( x ) {

		return ( x < 0 ) ? - 1 : ( x > 0 ) ? 1 : + x;

	};

}

if ( Function.prototype.name === undefined && Object.defineProperty !== undefined ) {

	// Missing in IE9-11.
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name

	Object.defineProperty( Function.prototype, 'name', {

		get: function () {

			return this.toString().match( /^\s*function\s*(\S*)\s*\(/ )[ 1 ];

		}

	} );

}

// Document.querySelectorAll method
// http://ajaxian.com/archives/creating-a-queryselector-for-ie-that-runs-at-native-speed
// Needed for: IE7-
if (!document.querySelectorAll) {
  document.querySelectorAll = function(selectors) {
    var style = document.createElement('style'), elements = [], element;
    document.documentElement.firstChild.appendChild(style);
    document._qsa = [];

    style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
    window.scrollBy(0, 0);
    style.parentNode.removeChild(style);

    while (document._qsa.length) {
      element = document._qsa.shift();
      element.style.removeAttribute('x-qsa');
      elements.push(element);
    }
    document._qsa = null;
    return elements;
  };
}

// Document.querySelector method
// Needed for: IE7-
if (!document.querySelector) {
  document.querySelector = function(selectors) {
    var elements = document.querySelectorAll(selectors);
    return (elements.length) ? elements[0] : null;
  };
}

// Document.getElementsByClassName method
// Needed for: IE8-
if (!document.getElementsByClassName) {
  document.getElementsByClassName = function(classNames) {
    classNames = String(classNames).replace(/^|\s+/g, '.');
    return document.querySelectorAll(classNames);
  };
}

Trojan.motto = "Give Muscles To Your Web";
Trojan.version = 1;

/**
 *	@description
 *	@link : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 *		Request method uses Promises together with the old XMLHttpRequest to communicate with the backend.
 *		It is also bundled with all header methods like "get","post","put","delete".
 *
 *	**************************************************************************************************************************
 *	****																																																									****
 *	****																											USAGE																												****
 *	****																																																									****
 *	**************************************************************************************************************************
 *
 *	var url = 'https://developer.mozilla.org/en-US/search.json';
 *
 *	@param : declare params, an object to parse to the server.
 *
 *	**************************************************************************************************************************
 *	****																																																									****
 *	****																											USAGE																												****
 *	****																																																									****
 *	**************************************************************************************************************************
 *	var params = {
 *	  'param1' : 'value1',
 *	  'param2'     : 'value2'
 *	};
 *
 *	**Putting all together**
 *	var callbackObj = {
 *	  success: function(data) {
 *	    console.log(1, 'success', JSON.parse(data));
 *	  },
 *	  error: function(data) {
 *	    console.log(2, 'error', JSON.parse(data));
 *	  }
 *	};
 *	End instantiation
 *	Run request
 *	Trojan.Request(url)
 *	.get(params)
 *	.then(callbackObj.success)
 *	.catch(callbackObj.error);
 *
 *	Executes the method call but an alternative way (1) to handle Promise Reject case
 *	Trojan.Request(url)
 *	.get(params)
 *	.then(callbackObj.success, callbackObj.error);
 **/

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
		if(document.querySelector("#"+this.tag.id)){
			document.querySelector("#"+this.tag.id).innerHTML = this.code;
		} else{
			this.tag.innerHTML += this.code; 
			document.querySelector("head").appendChild(this.tag);
		}
		
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
