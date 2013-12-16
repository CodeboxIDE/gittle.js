var Actor, crypto;

crypto = require('crypto');

module.exports = Actor = (function() {
    function Actor(name, email) {
        this.name = name;
        this.email = email;
        if (email) {
            this.hash = crypto.createHash("md5").update(this.email, "ascii").digest("hex");
        }
    }

    Actor.prototype.toString = function() {
        return "" + this.name + " <" + this.email + ">";
    };

    Actor.from_string = function(str) {
        var email, m, name, _ref;
        if (/<.+>/.test(str)) {
            _ref = /(.*) <(.+?)>/.exec(str), m = _ref[0], name = _ref[1], email = _ref[2];
            return new Actor(name, email);
        } else {
            return new Actor(str, null);
        }
    };

    return Actor;
})();