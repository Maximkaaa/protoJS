'use strict';

describe('setting methods', function() {

    var Class, props;
    beforeEach(function() {
        Class = function() {};
        props = {
            m1: function() {}
        };
        proto(Class, props);
    });

    it('should set the methods', function() {
        var obj = new Class();
        expect(obj.m1).toBe(props.m1);
    });

    it('should set the methods as not enumerable', function() {
        var obj = new Class();
        var keys = [];
        for (var i in obj) {
            keys.push(i);
        }
        expect(keys.length).toBe(0);
    });

    it('should set the methods as not writable', function() {
        expect(function() {Class.prototype.m1 = null;}).toThrow();
    });
});