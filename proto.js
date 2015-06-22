(function() {
    'use strict';

    var proto = function(options) {

        var constructor = function() {
            if (!(this instanceof constructor)) {
                return new options._construct();
            } else {
                options._construct.apply(this, arguments);
            }
        };

        if (options._proto) constructor.prototype = options._proto;
        if (options._mixin) {
            proto.mixin(constructor.prototype, options._mixin);
        }

        var keys = Object.keys(options);
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] !== '_construct' && keys[i] !== '_proto' && keys[i] !== '_mixin') {
                setProperty(constructor.prototype, keys[i], options[keys[i]]);
            }
        }

        return constructor;
    };

    /**
     * Copies all methods from source object to target. Applicable only for methods!
     * @param target
     * @param source
     */
    proto.mixin = function(target, source) {
        var keys = Object.keys(source);
        for (var i = 0; i < keys.length; i++) {
            setMethod(target, keys[i], source[keys[i]]);
        }
    };

    /**
     * Copies the properties from the options object to the object
     * @param {Object} obj - target object
     * @param {Object} options - source object
     */
    proto.init = function(obj, options) {
        var keys = Object.keys(options);
        for (var i = 0; i < keys.length; i++) {
            obj[keys[i]] = options[keys[i]];
        }
    };

    function setProperty(obj, key, value) {
        if (value instanceof Object) {
            if (value.set !== undefined || value.get !== undefined) {
                setFunc(obj, key, value);
            } else if (typeof value === 'function') {
                setMethod(obj, key, value);
            } else {
                setValue(obj, key, value);
            }
        } else {
            setValue(obj, key, value);
        }
    }

    function setFunc(obj, key, value) {
        if (value.default) setValue(obj, '_' + key, value.default, true);

        Object.defineProperty(obj, key, {
            get: value.get ? value.get : value.get !== null ? getGetter(key) : undefined,
            set: value.set ? value.set : value.set !== null ? getSetter(key) : undefined,
            enumerable: true
        });
    }

    function getGetter(key) {
        return function() {
            return this['_' + key];
        };
    }

    function getSetter(key) {
        return function(value) {
            if (!this.hasOwnProperty('_' + key)) setValue(this, '_' + key, null, true);
            this[' ' + key] = value;
        };
    }

    function setMethod(obj, key, value) {
        Object.defineProperty(obj, key, {value: value});
    }

    function setValue(obj, key, value, inner) {
        Object.defineProperty(obj, key, {value: value, enumerable: !inner, writable: true});
    }


    if (typeof define === 'function' && define.amd) {
        define(function() { return proto; });
    } else if (typeof module !== 'undefined') {
        module.exports = proto;
    } else {
        window.proto = proto;
    }

})();