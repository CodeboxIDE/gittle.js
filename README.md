Gittle
=========

A simple Node.js wrapper for the Git CLI. The API uses promises. This library is used in [Codebox](https://github.com/FriendCode/codebox).

### Installation

```
npm install gittle
```

### How to use it?

#### Global Methods

##### Load a repository

```javascript
var Gittle = require("gittle");
var repo = new Gittle("./");
```

##### Initialize a new repository

```javascript
Gittle.init("./test").then(function(repo) {
    // ...
});
```

##### Clone a repository

```javascript
Gittle.clone("https://github.com/FriendCode/gittle.js.git", "./test").then(function(repo) {
    // ...
});
```

##### Authentication

A third argument could be use for authentication on ```Gittle.clone```, ```repo.push```, ```repo.pull```, ```repo.fetch```:
```javascript
{
    // SSH:
    'passphrase': "...",
    'refuseUnknownHost': true, // Default is false
    
    // HTTPS:
    'username': "...",
    'password': "..."
}
```

#### Repository Methods:

##### Get repository status

```javascript
repo.status().then(function(status) {
    // ...
});
```

##### Push

```javascript
repo.push(remote, branch).then(function(status) {
    // ...
});
```

Check out [Authentication](#authentication) about how to configure https/ssh authentication.

##### List branches

```javascript
repo.branches().then(function(branches) {
    console.log(branches);
});
```

##### List commits

```javascript
repo.commits(start, limit, skip).then(function(commits) {
    console.log(commits);
});
```

##### List tags

```javascript
repo.tags().then(function(tags) {
    console.log(tags);
});
```

##### Create a branch

```javascript
repo.create_branch("branch_name").then(function() {
    // ...
});
```

##### Delete a branch

```javascript
repo.delete_branch("branch_name").then(function() {
    // ...
});
```


