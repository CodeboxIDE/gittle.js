Gittle
=========

A simple Node.js wrapper for the Git CLI. The API uses promises.

#### Installation

```
npm install gittle
```

#### Examples

Load a repository

```javascript
var Gittle = require("gittle");
var repo = new Gittle("./");
```

Initialize a repository

```javascript
Gittle.init("./test").then(funciton(repo) {
    // ...
});
```

Clone a repository

```javascript
Gittle.clone("https://github.com/FriendCode/gittle.js.git", "./test").then(funciton(repo) {
    // ...
});
```

Get repository status

```javascript
repo.status().then(function(status) {
    // ...
});
```

List branches

```javascript
repo.branches().then(function(branches) {
    console.log(branches);
});
```

List commits

```javascript
repo.commits(start, limit, skip).then(function(commits) {
    console.log(commits);
});
```

List tags

```javascript
repo.tags().then(function(tags) {
    console.log(tags);
});
```

Create a branch

```javascript
repo.create_branch("branch_name").then(function() {
    // ...
});
```

Delete a branch

```javascript
repo.delete_branch("branch_name").then(function() {
    // ...
});
```


