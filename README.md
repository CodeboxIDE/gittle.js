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

A last argument could be use for authentication on ```Gittle.clone```, ```repo.push```, ```repo.pull```, ```repo.fetch```:
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

##### Status

* Get status: ```repo.status()```

##### Identity

* Get identity: ```repo.identity()```, Returns an Actor object
* Set identity: ```repo.identify(actor)```, actor is an object like: ```{name: "", email: ""}```

##### Push/pull

* Pull: ```repo.pull(remote, branch)```
* Push: ```repo.push(remote, branch)```
* Fetch: ```repo.fetch(remote)```

Check out [Authentication](#authentication) about how to configure https/ssh authentication.


##### Commits

* List all commits: ```repo.commits(start, limit, skip)```

##### Tags

* List all tags: ```repo.tags()```

##### Branches

* List all branches: ```repo.branches()```
* Create a branch: ```repo.create_branch("branch_name")```
* Delete a branch: ```repo.delete_branch("branch_name")```

