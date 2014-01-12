var Gittle, Repo, Git, exec, Q;

Q = require('q');
exec = require('child_process').exec;
Repo = require('./repo');
Git = require("./git");

module.exports = Gittle = function(path, bare) {
    if (bare == null) {
        bare = false;
    }
    return new Repo(path, bare);
};

Gittle.init = function(path) {
    var d = Q.defer();
    exec(Git.bin+" init .", {
        cwd: path
    }, function(err) {
        if (err) return d.reject(err);
        d.resolve(new Repo(path));
    });
    return d.promise;
};

Gittle.setBin = function(bin) {
    Git.bin = bin;
    return Gittle;
};

Gittle.clone = function(repository, path) {
    var d = Q.defer();
    exec(Git.bin+" clone "+repository+" "+path, function(err) {
        if (err) return d.reject(err);
        d.resolve(new Repo(path));
    });
    return d.promise;
};
