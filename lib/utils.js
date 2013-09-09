// Requires
var Q = require('q');
var _ = require('underscore');
var inherits = require('util').inherits;


function qPatchClass(cls, methodExceptions) {
    // Methods not to patch
    methodExceptions = methodExceptions || [];

    var newCls = function newCls() {
        newCls.super_.apply(this, arguments);
    };
    inherits(newCls, cls);

    // Set name
    newCls.name = cls.name;

    _.methods(cls.prototype).forEach(function(method) {
        // Build new function
        newCls.prototype[method] = qPatchMethod(cls.prototype[method]);
    });

    return newCls;
}

function qPatchMethod(method) {
    var f = function() {
        var d = Q.defer();
        var args = _.toArray(arguments);

        // Add callback
        args.push(d.makeNodeResolver());

        // Call function
        method.apply(this, args);

        // Return promise
        return d.promise;
    };
    f.name = method.name;
    return f;
}


// Exports
exports.qPatchClass = qPatchClass;
