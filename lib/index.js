var Gittle, Repo, exec, Q;

Q = require('q');
exec = require('child_process').exec;
Repo = require('./repo');

module.exports = Gittle = function(path, bare) {
    if (bare == null) {
        bare = false;
    }
    return new Repo(path, bare);
};

Gittle.init = function(path) {
    var d = Q.defer();
    exec("git init .", {
        cwd: path
    }, function(err) {
        if (err) return d.reject(err);
        d.resolve(new Repo(path));
    });
    return d.promise;
};

Gittle.clone = function(repository, path) {
    var d = Q.defer();
    exec("git clone "+repository+" "+path, function(err) {
        if (err) return d.reject(err);
        d.resolve(new Repo(path));
    });
    return d.promise;
};
