# Trojan
JSON-CSS Loader
Nothing new here, just an experimental mini lib I created and turned to be doing the job. No tests have been made yet, but be free to go through the source code and improve it
====================================
```Javascript
//Create a new Trojan object
var style = new Trojan.style("styleID") //or
//create a style obj
var styleObj = {
  "*":{...props}
}

//Declare with local object or remote json data
//Local object, which is our styleObj
style.declare(styleObj).run()

//OR via URL (json)
style.load(url)

//Then you are done!!

```
