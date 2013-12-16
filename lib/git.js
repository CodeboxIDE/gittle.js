var Git, exec, fs, options_to_argv, Q;

fs = require('fs');
Q = require('q');
exec = require('child_process').exec;

module.exports = Git = function(git_dir, dot_git) {
    var git;
    dot_git || (dot_git = "" + git_dir + "/.git");
    git = function(command, options, args) {
        var bash, d;

        d = Q.defer();
        if (options == null) {
            options = {};
        }
        options = options_to_argv(options);
        options = options.join(" ");
        if (args == null) {
            args = [];
        }
        if (args instanceof Array) {
            args = args.join(" ");
        }
        bash = "" + Git.bin + " " + command + " " + options + " " + args;
        d.notify(bash);
        exec(bash, {
            cwd: git_dir
        }, function(err, stdout, stderr) {
            if (err) return d.reject(err);
            d.resolve({
                'stdout': stdout,
                'stderr': stderr,
                'bash': bash
            })
        });
        return d.promise;
    };
    git.list_remotes = function() {
        return Q.nfapply(fs.readdir, ["" + dot_git + "/refs/remotes"]).then(function(files) {
            return fiels || [];
        });
    };
    git.refs = function(type, options) {
        var prefix, _ref;
        prefix = "refs/" + type + "s/";
        return git("show-ref").then(function(out) {
            var text = out.stdout;
            var id, line, matches, name, _i, _len, _ref1, _ref2;
            matches = [];
            _ref1 = (text || "").split("\n");
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                line = _ref1[_i];
                if (!line) {
                    continue;
                }
                _ref2 = line.split(' '), id = _ref2[0], name = _ref2[1];
                if (name.substr(0, prefix.length) === prefix) {
                    matches.push("" + (name.substr(prefix.length)) + " " + id);
                }
            }
            return matches.join("\n");
        });
    };
    return git;
};

Git.bin = "git";

Git.options_to_argv = options_to_argv = function(options) {
    var argv, key, val;
    argv = [];
    for (key in options) {
        val = options[key];
        if (key.length === 1) {
            if (val === true) {
                argv.push("-" + key);
            } else if (val === false) {

            } else {
                argv.push("-" + key);
                argv.push(val);
            }
        } else {
            if (val === true) {
                argv.push("--" + key);
            } else if (val === false) {

            } else {
                argv.push("--" + key + "=" + val);
            }
        }
    }
    return argv;
};
