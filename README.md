# finder
A finder use XPath expression to find dom


## Usage
```javascript
npm install dom-finder
```
```javascript
Finder.findNode(selector, context) => selector could be id,class,name,tagName,text,value
Finder.advanceFind(opts) => find node with indicated attribute list, and find node in specifc context
opts: {
  tagName, //just tagName, like: div,p,input,etc.
  attrs,   //an attribute list that could contains any attribute like: href,name,title,style,etc.
  context, //could be another opts just like this one
  global,  //will match all nodes whether is child or grandchild default true
  contains //contains attribute value or equals attribute value default true
}
Finder.verison()=> get the current Finder version
```
```js
//search for text
Finder.advanceFind({attrs: {text: "some text"}});
```

Enjoy
----
