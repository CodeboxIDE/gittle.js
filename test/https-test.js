var repo = require("./repo");
var Q = require("q");
var qtest = require("./test").qtest;

exports.https = {
    push:  function(test) {
        // Auth should failed
        qtest(
            repo.push("https://invalid@bitbucket.org/SamyPesse/node-js-sample.git")
            .then(function() {
                return Q.reject("Error !");
            }, function(err) {
                return Q();
            })
        , test);
    }
}