var Git, Repo, exec;

exec = require('child_process').exec;

Repo = require('./repo');

module.exports = Git = function(path, bare) {
    if (bare == null) {
        bare = false;
    }
    return new Repo(path, bare);
};

Git.init = function(path) {
    return exec("git init .", {
        cwd: path
    }).then(function(out) {
        return new Repo(path);
    });
};
