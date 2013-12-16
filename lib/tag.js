
var Actor, Commit, Ref, Tag, _, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('underscore');

Commit = require('./commit');

Actor = require('./actor');

Ref = require('./ref').Ref;

module.exports = Tag = (function(_super) {
  __extends(Tag, _super);

  function Tag() {
    _ref = Tag.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Tag.find_all = function(repo, callback) {
    return Ref.find_all(repo, "tag", Tag, callback);
  };

  Tag.prototype.message = function(callback) {
    return this.lazy(function(err, data) {
      if (err) {
        return callback(err);
      }
      return callback(null, data.message);
    });
  };

  Tag.prototype.tagger = function(callback) {
    return this.lazy(function(err, data) {
      if (err) {
        return callback(err);
      }
      return callback(null, data.tagger);
    });
  };

  Tag.prototype.tag_date = function(callback) {
    return this.lazy(function(err, data) {
      if (err) {
        return callback(err);
      }
      return callback(null, data.tag_date);
    });
  };

  Tag.prototype.lazy = function(callback) {
    var _this = this;
    if (this._lazy_data) {
      return callback(null, this._lazy_data);
    }
    return this.repo.git("cat-file", {}, ["tag", this.name], function(err, stdout, stderr) {
      var author, author_line, data, epoch, line, lines, m, message, _ref1;
      if (err) {
        return callback(err);
      }
      lines = stdout.split("\n");
      data = {};
      lines.shift();
      lines.shift();
      lines.shift();
      author_line = lines.shift();
      _ref1 = /^.+? (.*) (\d+) .*$/.exec(author_line), m = _ref1[0], author = _ref1[1], epoch = _ref1[2];
      data.tagger = Actor.from_string(author);
      data.tag_date = new Date(epoch);
      lines.shift();
      message = [];
      while (line = lines.shift()) {
        message.push(line);
      }
      data.message = message.join("\n");
      return callback(null, (_this._lazy_data = data));
    });
  };

  return Tag;

})(Ref);
