var repo = require("./repo");

exports.branches = {
    // Branches listing
    list: function(test) {
        console.log(repo);
        repo.branches().then(function(branches) {
            test.done();
        }, function() {
            test.ok(false);
        });
    }
}