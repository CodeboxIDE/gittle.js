
module.exports = {
    // Use promise for testing
    qtest: function(d, test) {
        d.then(function(out) {
            test.ok(true);
        }, function(err) {
            console.log("Error: ", err);
            test.ok(false);
        }).fin(function() {
            test.done();
        });
    }
};