// Requires
var Q = require('q');
var _ = require('underscore');
var inherits = require('util').inherits;

var Gift = require('gift/lib/repo');

var qPatchClass = require('./utils').qPatchClass;


function Gittle(path, bare) {
    bare = bare || false;
    Gittle.super_.call(this, path, bare);

    _.bindAll(this);
}
inherits(Gittle, qPatchClass(Gift, ['tree']));

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

// Exports
exports.Gittle = Gittle;