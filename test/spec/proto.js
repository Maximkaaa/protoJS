'use strict';

describe('protoJS', function () {
    describe('inheritance', function() {

        var Class;
        beforeEach(function() {
            Class = function() {};
            proto(Class, {});
        });

        it ('should inherit from Object by default', function() {
            var obj = new Class();

            expect(obj instanceof Object).toBe(true);
            expect(obj instanceof Class).toBe(true);
        });

        it('should inherit from the _proto Class if specified', function() {
            var SubClass = function() {};
            proto(SubClass, {_proto: Class});
            var obj = new SubClass();

            expect(obj instanceof Object).toBe(true);
            expect(obj instanceof Class).toBe(true);
            expect(obj instanceof SubClass).toBe(true);
        });

        it('should inherit from the _proto object if specified', function() {
            var prototype = new Class();
            prototype.prop = 1;

            var SubClass = function() {};
            proto(SubClass, {_proto: prototype});
            var obj = new SubClass();

            expect(obj instanceof Class).toBe(true);
            expect(obj.prop).toBe(prototype.prop);
        });

    });

    describe('setting plain value properties', function() {

        var Class, props;
        beforeEach(function() {
            Class = function() {};
            props = {
                number: 1,
                text: 'abc',
                null: null,
                obj: {},
                array: []
            };
            proto(Class, props);
        });

        it('should set the properties, specified as plain values', function() {
            var obj = new Class();

            expect(obj.number).toBe(props.number);
            expect(obj.text).toBe(props.text);
            expect(obj.null).toBe(props.null);
            expect(obj.obj).toBe(props.obj);
            expect(obj.array).toBe(props.array);
        });

        it('should make the properties enumerable by default', function() {
            var obj = new Class();

            for (var i in obj) {
                expect(obj[i]).toBe(props[i]);
            }
        });

        it('should make the properties writable', function() {
            var obj = new Class();
            obj.number = 2;
            var obj1 = new Class();
            expect(obj1.number).toBe(1);
            expect(obj.number).toBe(2);
        });

    });

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
});