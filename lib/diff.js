var Blob, Diff;
Blob = require('./blob');

module.exports = Diff = (function() {
    function Diff(repo, a_path, b_path, a_blob, b_blob, a_mode, b_mode, new_file, deleted_file, diff, renamed_file, similarity_index) {
        this.repo = repo;
        this.a_path = a_path;
        this.b_path = b_path;
        this.a_mode = a_mode;
        this.b_mode = b_mode;
        this.new_file = new_file;
        this.deleted_file = deleted_file;
        this.diff = diff;
        this.renamed_file = renamed_file != null ? renamed_file : false;
        this.similarity_index = similarity_index != null ? similarity_index : 0;
        if (a_blob) {
            this.a_blob = new Blob(this.repo, {
                id: a_blob
            });
        }
        if (b_blob) {
            this.b_blob = new Blob(this.repo, {
                id: b_blob
            });
        }
    }

    Diff.prototype.toJSON = function() {
        return {
            a_path: this.a_path,
            b_path: this.b_path,
            a_mode: this.a_mode,
            b_mode: this.b_mode,
            new_file: this.new_file,
            deleted_file: this.deleted_file,
            diff: this.diff,
            renamed_file: this.renamed_file,
            similarity_index: this.similarity_index
        };
    };

    Diff.prototype.normalize =  function() {
        var diffHeader = [
            ["diff --git", "a/"+this.a_path, " b/"+this.b_path].join(' '),
            ["index", this.a_blob.id+".."+this.b_blob.id, this.b_mode].join(' '),
            ''
        ].join('\n');
        return {
            diff: diffHeader + this.diff,
            type: 'text',
            old: {
                path: this.a_path,
                mode: parseInt(this.a_mode || this.b_mode, 8),
                sha: this.a_blob.id
            },
            'new': {
                path: this.b_path,
                mode: parseInt(this.b_mode, 8),
                sha: this.b_blob.id
            }
        };
    };

    Diff.parse = function(repo, text) {
        var a_blob, a_mode, a_path, b_blob, b_mode, b_path, deleted_file, diff, diff_lines, diffs, lines, m, new_file, renamed_file, sim_index, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
        lines = text.split("\n");
        diffs = [];
        while (lines.length && lines[0]) {
            _ref = /^diff\s--git\sa\/(.+?)\sb\/(.+)$/.exec(lines.shift()), m = _ref[0], a_path = _ref[1], b_path = _ref[2];
            if (/^old mode/.test(lines[0])) {
                _ref1 = /^old mode (\d+)/.exec(lines.shift()), m = _ref1[0], a_mode = _ref1[1];
                _ref2 = /^new mode (\d+)/.exec(lines.shift()), m = _ref2[0], b_mode = _ref2[1];
            }
            if (!lines.length || /^diff --git/.test(lines[0])) {
                diffs.push(new Diff(repo, a_path, b_path, null, null, a_mode, b_mode, false, false, null));
                continue;
            }
            sim_index = 0;
            new_file = false;
            deleted_file = false;
            renamed_file = false;
            if (/^new file/.test(lines[0])) {
                _ref3 = /^new file mode (.+)$/.exec(lines.shift()), m = _ref3[0], b_mode = _ref3[1];
                a_mode = null;
                new_file = true;
            } else if (/^deleted file/.test(lines[0])) {
                _ref4 = /^deleted file mode (.+)$/.exec(lines.shift()), m = _ref4[0], a_mode = _ref4[1];
                b_mode = null;
                deleted_file = true;
            } else if (m = /^similarity index (\d+)\%/.exec(lines[0])) {
                sim_index = m[1].to_i;
                renamed_file = true;
                lines.shift();
                lines.shift();
            }
            _ref5 = /^index\s([0-9A-Fa-f]+)\.\.([0-9A-Fa-f]+)\s?(.+)?$/.exec(lines.shift()), m = _ref5[0], a_blob = _ref5[1], b_blob = _ref5[2], b_mode = _ref5[3];
            if (b_mode) {
                b_mode = b_mode.trim();
            }
            diff_lines = [];
            while (lines[0] && !/^diff/.test(lines[0])) {
                diff_lines.push(lines.shift());
            }
            diff = diff_lines.join("\n");
            diffs.push(new Diff(repo, a_path, b_path, a_blob, b_blob, a_mode, b_mode, new_file, deleted_file, diff, renamed_file, sim_index));
        }
        return diffs;
    };

    return Diff;
})();