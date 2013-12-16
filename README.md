gittle.js
=========

A simple Node.js wrapper for the Git CLI. The API uses promises.

#### Installation

```
npm install gittle
```

#### Examples

Initialize a repository

```javascript
var Gittle = require("gittle");
var repo = new Gittle("./");
```


List Branches

```javascript
repo.branches().then(function(branches) {
    console.log(branches);
});
```
