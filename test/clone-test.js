var Gittle = require("../");
var Q = require("q");
var tmp = require("tmp");
var qtest = require("./test").qtest;

tmp.setGracefulCleanup();

exports.clones = {
    // Clone https public repo
    httpsPublic: function(test) {
        qtest(
            Q.nfcall(tmp.dir)
            .then(function(path) {
                return Gittle.clone("https://SamyPesse@bitbucket.org/SamyPesse/node-js-sample.git", path);
            }),
            test
        );
    },

    // Clone https repo with invalid auth
    httpsAuth: function(test) {
        Q.nfcall(tmp.dir)
        .then(function(path) {
            return Gittle.clone("https://invalid@bitbucket.org/SamyPesse/node-js-sample2.git", path, {
                username: "invalid",
                password: "invalid"
            });
        })
        .then(function(out) {
            test.ok(false);
        }, function(err) {
            test.ok(true);
        }).fin(function() {
            test.done();
        });
    }
}