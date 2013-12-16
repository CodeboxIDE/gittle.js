var Gittle = require("gittle");

var repo = new Gittle("./");

var output = function() {
    console.log(arguments);
};

repo.remotes().then(output, output);