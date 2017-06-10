# Trojan
JSON-CSS Loader
>Nothing new here, just an experimental mini lib I created and turned to be doing the job. No tests have been made yet, but be free to go through the source code and improve it
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
//url can point to any path that returns an application/json content
style.load("test.json")

//Then you are done!!

```
# TEST.JSON

```json

{
		"*" : {},
		"html" : {
			"background":"teal"
		},
		"ul, div[view]" : {
			"background":"white",
			"list-style":"none",
			"padding":"0.3em",
			"border-radius":"5px"
		},
		"a":{
			"color":"brown",
			"text-decoration":"none",
			"outline":"none"
		},
		".link":{
			"display":"flex",
			"display":"-webkit-flex",
			"line-height":"24pt",
			"align-items":"center",
			"-webkit-align-items":"center",
			"justify-content":"center",
			"-webkit-justify-content":"center",
		},
		".link li":{
			"display":"block",
			"flex":"1",
			"-webkit-flex":"1",
			"text-align":"center",
			"background":"#e3e6eb"
		},
		"h1":{
			"border-bottom":"1px solid #e4e6eb",
			"margin":0,
			"padding":"0.2em",
			"font-size":"18pt"
		}
	}

```
