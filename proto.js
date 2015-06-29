(function() {
    'use strict';

    var proto = function(constructor, mixins, options) {
        if (arguments.length === 1) {
            options = constructor;
            constructor = function() {};
        } else if (arguments.length === 2) {
            options = mixins;
        } else {
            if (!(mixins instanceof Array)) {
                mixins = [mixins];
            }
        }

        if (options._proto) {
            if (options._proto instanceof Function) {
                constructor.prototype = new options._proto();
            } else {
                constructor.prototype = options._proto;
            }
        }

        if (mixins) {
            for (var i = 0; i < mixins.length; i++) {
                proto.mixin(constructor.prototype, mixins[i]);
            }
        }

        var keys = Object.keys(options);
        for (i = 0; i < keys.length; i++) {
            setProperty(constructor.prototype, keys[i], options[keys[i]]);
        }

        return constructor.prototype;
    };

    /**
     * Copies all methods from source object to target. Applicable only for methods!
     * @param target
     * @param source
     */
    proto.mixin = function(target, source) {
        var keys = Object.getOwnPropertyNames(source);
        for (var i = 0; i < keys.length; i++) {
            var desc = Object.getOwnPropertyDescriptor(source, keys[i]);
            if (desc.set || desc.get) {
                setFunc(target, keys[i], {get: desc.get || null, set: desc.set || null, default: source[keys[i]]});
            } else if (typeof source[keys[i]] === 'function' || desc.enumerable) {
                setProperty(target, keys[i], source[keys[i]]);
            }
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
        if (value.default !== undefined) setValue(obj, '_' + key, value.default, true);

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
            this['_' + key] = value;
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