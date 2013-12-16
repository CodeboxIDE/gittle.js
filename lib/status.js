var S, Status;

module.exports = S = function(repo) {
    return repo.git("status --porcelain").then(function(out) {
        var status;
        status = new Status(repo);
        status.parse(out.stdout);
        return status;
    });
};

S.Status = Status = (function() {
    function Status(repo) {
        this.repo = repo;
    }

    Status.prototype.parse = function(text) {
        var file, line, type, _i, _len, _ref, _results;
        this.files = {};
        this.clean = text.length === 0;
        _ref = text.split("\n");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            line = _ref[_i];
            if (line.length === 0) {
                continue;
            }
            file = line.substr(3);
            type = line.substr(0, 2);
            this.files[file] = {
                staged: line[0] !== " " && line[0] !== "?",
                tracked: line[0] !== "?"
            };
            if (type !== "??") {
                _results.push(this.files[file].type = type.trim());
            } else {
                _results.push(void 0);
            }
        }
        return _results;
    };

    return Status;
})();
