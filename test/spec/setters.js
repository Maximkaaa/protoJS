'use strict';

describe('getter/setter properties', function() {

    var Class, props, getterCalled, setterCalled;
    var getter = function() {
        getterCalled = true;
    };
    var setter = function() {
        setterCalled = true;
    };

    beforeEach(function() {
        Class = function() {};
        getterCalled = setterCalled = false;
        props = {
            p1: {
                get: getter,
                set: setter
            },
            p2: {
                set: null
            },
            p3: {
                default: 1,
                get: getter
            },
            p4: {
                default: 'abc',
                set: setter
            }
        };
        proto(Class, props);
    });

    it('should assign a getter/setter property if get or set options are given', function() {
        var obj = new Class();
        expect(obj.p1).toBe(undefined);
        expect(getterCalled).toBe(true);
        expect(setterCalled).toBe(false);

        obj.p1 = 1;
        expect(setterCalled).toBe(true);
    });

    it('should use an inner property with pre _ for default getters and setter', function() {
        var obj = new Class();
        expect(obj.p4).toBe('abc');
        obj._p4 = 1;
        expect(obj.p4).toBe(1);

        obj.p3 = 2;
        expect(obj._p3).toBe(2);
    });

    it('should make the getter/setter properties enumerable', function() {
        var obj = new Class();
        var keys = [];
        for (var i in obj) {
            keys.push(i);
        }
        expect(keys.length).toBe(4);
    });

    it('should make inner properties not enumerable', function() {
        var obj = new Class();
        obj.p3 = 2;
        var keys = [];
        for (var i in obj) {
            keys.push(i);
        }
        expect(keys.length).toBe(4);
        expect(keys.indexOf('_p3')).toBe(-1);
    });

    it('should make a property not writable if set is null', function() {
        var obj = new Class();
        expect(function() {obj.p2 = 1;}).toThrow();
    });

    it('should set property value to undefined if default value is not defined', function() {
        var obj = new Class();
        expect(obj.p1).toBe(undefined);
        expect(obj.p2).toBe(undefined);
    });
});