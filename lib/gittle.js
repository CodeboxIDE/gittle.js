// Requires
var Q = require('q');
var _ = require('underscore');
var inherits = require('util').inherits;

var Gift = require('gift/lib/repo');

var qClass = require('qpatch').qClass;


function Gittle(path, bare) {
    bare = bare || false;
    Gittle.super_.call(this, path, bare);

    _.bindAll(this);
}
inherits(Gittle, qClass(Gift, ['tree']));

// Normalize a diff
Gittle.prototype._normalizeDiff = function(d) {
    return {
        diff: d.diff,
        type: 'text',
        old: {
            path: d.a_path,
            mode: parseInt(d.a_mode || d.b_mode, 8),
            sha: d.a_blob.id
        },
        'new': {
            path: d.b_path,
            mode: parseInt(d.b_mode, 8),
            sha: d.b_blob.id
        }
    };
};

Gittle.prototype.diff = function() {
    var that = this;
    //console.log('DIFF FUNC =', Gittle.super_.prototype.diff);
    return Gittle.super_.prototype.diff.apply(this, _.toArray(arguments))
    .then(function(diffs) {
        return _.map(diffs, that._normalizeDiff);
    });
};

Gittle.prototype._git = function(command, options, files) {
    return Q.nfcall(this.git, command, options, files);
};

Gittle.prototype._track = function(files) {
    return this._git('add', {
        'N': true
    }, files).then(Q());
};

Gittle.prototype._untrack = function(files) {
    return this._git('rm', {
        'r': true,
        'cached': true,
    }, files).then(Q());
};

Gittle.prototype._untracked_files = function() {
    return this.status()
    .then(function(status) {
        return _.filter(_.keys(status.files), function(name) {
            return status.files[name].tracked === false;
        });
    }).then(Q());
};

// Add and remove files
Gittle.prototype._stage_files = function(files) {
    return this._git('add', {
        // -A option
        'A': true
    }, files).then(Q(files));
};

// Diff of the current working directory
// This pushes things to the index, we could avoid that maybe
Gittle.prototype.diff_working = function() {
    var that = this;
    return this._untracked_files()
    .then(function(files) {

        var _diff;
        var setDiff = function(d) {
            _diff = d;
        };
        var getDiff = function() {
            return _diff;
        };

        var diff = _.partial(that.diff, null, null);
        var track = _.partial(that._track, files);
        var untrack = _.partial(that._untrack, files);

        if(_.isEmpty(files)) {
            return diff();
        }

        return track()
        .then(diff)
        .then(setDiff)
        .then(untrack)
        .then(getDiff);
    });
};

Gittle.prototype.commit = function(name, email, msg, files) {
    files = files || [];

    var newIdentity = {
        name: name,
        email: email
    };

    var _author;
    var setAuthor = function(a) {
        _author = a;
    };
    var getAuthor = function() {
        return _author;
    };

    var setIdentity = _.partial(this.identify, newIdentity);

    var identity = this.identity;
    var identify = this.identify;

    var stage = this._stage_files.bind(this, files);
    var commit = Gittle.super_.prototype.commit.bind(this, msg);

    return identity()
    .then(function(author) {
        return setAuthor(author);
    }, function() {
        // Identity may fail depending on "git config"
        return setAuthor(newIdentity);
    })
    .then(function() {
        // Set newIdentity from args
        return setIdentity();
    })
    .then(function() {
        // Stage files
        return stage();
    })
    .then(function() {
        // Do commit with new identity
        return commit();
    })
    .then(function() {
        // Restore previous identity
        return identify(getAuthor());
    });
};

Gittle.prototype.current_branch = function() {
    return this.branch().get('name');
};

Gittle.prototype.commits_pending = function() {
    var that = this;
    return this.current_branch()
    .then(function(branch) {
        return that.commits('origin/'+branch+'..');
    });
};

// Exports
exports.Gittle = Gittle;
