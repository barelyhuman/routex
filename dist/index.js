#!/usr/bin/env node
module.exports = /******/ (function (modules, runtime) {
    // webpackBootstrap
    /******/ 'use strict'; // The module cache
    /******/ /******/ var installedModules = {}; // The require function
    /******/
    /******/ /******/ function __webpack_require__(moduleId) {
        /******/
        /******/ // Check if module is in cache
        /******/ if (installedModules[moduleId]) {
            /******/ return installedModules[moduleId].exports;
            /******/
        } // Create a new module (and put it into the cache)
        /******/ /******/ var module = (installedModules[moduleId] = {
            /******/ i: moduleId,
            /******/ l: false,
            /******/ exports: {},
            /******/
        }); // Execute the module function
        /******/
        /******/ /******/ var threw = true;
        /******/ try {
            /******/ modules[moduleId].call(
                module.exports,
                module,
                module.exports,
                __webpack_require__
            );
            /******/ threw = false;
            /******/
        } finally {
            /******/ if (threw) delete installedModules[moduleId];
            /******/
        } // Flag the module as loaded
        /******/
        /******/ /******/ module.l = true; // Return the exports of the module
        /******/
        /******/ /******/ return module.exports;
        /******/
    }
    /******/
    /******/
    /******/ __webpack_require__.ab = __dirname + '/'; // the startup function
    /******/
    /******/ /******/ function startup() {
        /******/ // Load entry module and return exports
        /******/ return __webpack_require__(964);
        /******/
    } // initialize runtime
    /******/ /******/ runtime(__webpack_require__); // run startup
    /******/
    /******/ /******/ return startup();
    /******/
})(
    /************************************************************************/
    /******/ {
        /***/ 22: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            const basePath = __webpack_require__(973);
            const path = __webpack_require__(622);
            const parseUrl = __webpack_require__(304);

            module.exports = async (availableRoutes, req, res) => {
                try {
                    const parsedRouteUrl = parseUrl(req.url);
                    let handlerPath = '';
                    let currentPointer = availableRoutes;

                    parsedRouteUrl.forEach((item) => {
                        if (!currentPointer[item]) {
                            const matchingKey = Object.keys(
                                currentPointer
                            ).find(
                                (key) =>
                                    currentPointer[key].params &&
                                    currentPointer[key].params.length > 0
                            );

                            if (matchingKey) {
                                currentPointer = currentPointer[matchingKey];
                                const key = matchingKey.replace(/[\[\]]/g, '');
                                req.params = {
                                    [key]: item,
                                };
                            } else {
                                currentPointer = null;
                                return;
                            }
                        } else {
                            currentPointer = currentPointer[item];
                        }

                        if (currentPointer) {
                            if (currentPointer.type === 'file') {
                                handlerPath += currentPointer.index;
                            } else {
                                handlerPath += item + '/';
                            }
                        }
                    });

                    if (!currentPointer || !currentPointer.type) {
                        res.statusCode = 404;
                        res.end();
                        return;
                    }

                    if (currentPointer.type === 'dir') {
                        if (currentPointer.index) {
                            handlerPath += currentPointer.index;
                        } else {
                            res.statusCode = 404;
                            res.end();
                            return;
                        }
                    }

                    let _handlerPath = path.join(basePath(), handlerPath);

                    const handler = require(_handlerPath);

                    return handler(req, res);
                } catch (err) {
                    console.error(err);
                    res.statusCode(500);
                    res.end();
                    throw err;
                }
            };

            /***/
        },

        /***/ 58: /***/ function (module) {
            module.exports = require('readline');

            /***/
        },

        /***/ 66: /***/ function (module) {
            module.exports = (dirs) => {
                const exists = dirs.find((item) => item === 'api');
                const valid = exists ? true : false;
                return { valid, path: exists };
            };

            /***/
        },

        /***/ 87: /***/ function (module) {
            module.exports = require('os');

            /***/
        },

        /***/ 90: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            'use strict';

            const ansiRegex = __webpack_require__(436);

            module.exports = (string) =>
                typeof string === 'string'
                    ? string.replace(ansiRegex(), '')
                    : string;

            /***/
        },

        /***/ 97: /***/ function (module) {
            var clone = (function () {
                'use strict';

                /**
                 * Clones (copies) an Object using deep copying.
                 *
                 * This function supports circular references by default, but if you are certain
                 * there are no circular references in your object, you can save some CPU time
                 * by calling clone(obj, false).
                 *
                 * Caution: if `circular` is false and `parent` contains circular references,
                 * your program may enter an infinite loop and crash.
                 *
                 * @param `parent` - the object to be cloned
                 * @param `circular` - set to true if the object to be cloned may contain
                 *    circular references. (optional - true by default)
                 * @param `depth` - set to a number if the object is only to be cloned to
                 *    a particular depth. (optional - defaults to Infinity)
                 * @param `prototype` - sets the prototype to be used when cloning an object.
                 *    (optional - defaults to parent prototype).
                 */
                function clone(parent, circular, depth, prototype) {
                    var filter;
                    if (typeof circular === 'object') {
                        depth = circular.depth;
                        prototype = circular.prototype;
                        filter = circular.filter;
                        circular = circular.circular;
                    }
                    // maintain two arrays for circular references, where corresponding parents
                    // and children have the same index
                    var allParents = [];
                    var allChildren = [];

                    var useBuffer = typeof Buffer != 'undefined';

                    if (typeof circular == 'undefined') circular = true;

                    if (typeof depth == 'undefined') depth = Infinity;

                    // recurse this function so we don't reset allParents and allChildren
                    function _clone(parent, depth) {
                        // cloning null always returns null
                        if (parent === null) return null;

                        if (depth == 0) return parent;

                        var child;
                        var proto;
                        if (typeof parent != 'object') {
                            return parent;
                        }

                        if (clone.__isArray(parent)) {
                            child = [];
                        } else if (clone.__isRegExp(parent)) {
                            child = new RegExp(
                                parent.source,
                                __getRegExpFlags(parent)
                            );
                            if (parent.lastIndex)
                                child.lastIndex = parent.lastIndex;
                        } else if (clone.__isDate(parent)) {
                            child = new Date(parent.getTime());
                        } else if (useBuffer && Buffer.isBuffer(parent)) {
                            if (Buffer.allocUnsafe) {
                                // Node.js >= 4.5.0
                                child = Buffer.allocUnsafe(parent.length);
                            } else {
                                // Older Node.js versions
                                child = new Buffer(parent.length);
                            }
                            parent.copy(child);
                            return child;
                        } else {
                            if (typeof prototype == 'undefined') {
                                proto = Object.getPrototypeOf(parent);
                                child = Object.create(proto);
                            } else {
                                child = Object.create(prototype);
                                proto = prototype;
                            }
                        }

                        if (circular) {
                            var index = allParents.indexOf(parent);

                            if (index != -1) {
                                return allChildren[index];
                            }
                            allParents.push(parent);
                            allChildren.push(child);
                        }

                        for (var i in parent) {
                            var attrs;
                            if (proto) {
                                attrs = Object.getOwnPropertyDescriptor(
                                    proto,
                                    i
                                );
                            }

                            if (attrs && attrs.set == null) {
                                continue;
                            }
                            child[i] = _clone(parent[i], depth - 1);
                        }

                        return child;
                    }

                    return _clone(parent, depth);
                }

                /**
                 * Simple flat clone using prototype, accepts only objects, usefull for property
                 * override on FLAT configuration object (no nested props).
                 *
                 * USE WITH CAUTION! This may not behave as you wish if you do not know how this
                 * works.
                 */
                clone.clonePrototype = function clonePrototype(parent) {
                    if (parent === null) return null;

                    var c = function () {};
                    c.prototype = parent;
                    return new c();
                };

                // private utility functions

                function __objToStr(o) {
                    return Object.prototype.toString.call(o);
                }
                clone.__objToStr = __objToStr;

                function __isDate(o) {
                    return (
                        typeof o === 'object' &&
                        __objToStr(o) === '[object Date]'
                    );
                }
                clone.__isDate = __isDate;

                function __isArray(o) {
                    return (
                        typeof o === 'object' &&
                        __objToStr(o) === '[object Array]'
                    );
                }
                clone.__isArray = __isArray;

                function __isRegExp(o) {
                    return (
                        typeof o === 'object' &&
                        __objToStr(o) === '[object RegExp]'
                    );
                }
                clone.__isRegExp = __isRegExp;

                function __getRegExpFlags(re) {
                    var flags = '';
                    if (re.global) flags += 'g';
                    if (re.ignoreCase) flags += 'i';
                    if (re.multiline) flags += 'm';
                    return flags;
                }
                clone.__getRegExpFlags = __getRegExpFlags;

                return clone;
            })();

            if (true && module.exports) {
                module.exports = clone;
            }

            /***/
        },

        /***/ 104: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            const basePath = __webpack_require__(973);
            const fs = __webpack_require__(747);
            const path = __webpack_require__(622);

            module.exports = async () => {
                try {
                    const creationPath = path.join(basePath(), '.route');
                    const exists = await new Promise((resolve, reject) => {
                        fs.stat(creationPath, (err, stat) => {
                            if (
                                (err && err.code === 'ENOENT') ||
                                (err && err.code === 'ENOTDIR')
                            ) {
                                resolve(false);
                            }
                            return resolve(true);
                        });
                    });

                    if (exists) {
                        return creationPath;
                    } else {
                        await new Promise((resolve, reject) => {
                            fs.mkdir(creationPath, (err, done) => {
                                if (err) reject(err);
                                resolve(done);
                            });
                        });
                    }

                    return creationPath;
                } catch (err) {
                    console.error(err);
                    throw err;
                }
            };

            /***/
        },

        /***/ 116: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            const basePath = __webpack_require__(973);
            const fs = __webpack_require__(747);
            const path = __webpack_require__(622);
            const checkApiDir = __webpack_require__(66);
            const processDirectories = __webpack_require__(239);

            module.exports = () => {
                fs.readdir(basePath(), function (err, dirs) {
                    if (err) throw err;
                    const apiDirExists = checkApiDir(dirs);
                    if (!apiDirExists.valid) {
                        throw new Error('cannot find an `api` directory');
                    }
                    const processingPath = path.join(basePath());
                    return processDirectories(processingPath);
                });
            };

            /***/
        },

        /***/ 118: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            var Stream = __webpack_require__(413);

            module.exports = MuteStream;

            // var out = new MuteStream(process.stdout)
            // argument auto-pipes
            function MuteStream(opts) {
                Stream.apply(this);
                opts = opts || {};
                this.writable = this.readable = true;
                this.muted = false;
                this.on('pipe', this._onpipe);
                this.replace = opts.replace;

                // For readline-type situations
                // This much at the start of a line being redrawn after a ctrl char
                // is seen (such as backspace) won't be redrawn as the replacement
                this._prompt = opts.prompt || null;
                this._hadControl = false;
            }

            MuteStream.prototype = Object.create(Stream.prototype);

            Object.defineProperty(MuteStream.prototype, 'constructor', {
                value: MuteStream,
                enumerable: false,
            });

            MuteStream.prototype.mute = function () {
                this.muted = true;
            };

            MuteStream.prototype.unmute = function () {
                this.muted = false;
            };

            Object.defineProperty(MuteStream.prototype, '_onpipe', {
                value: onPipe,
                enumerable: false,
                writable: true,
                configurable: true,
            });

            function onPipe(src) {
                this._src = src;
            }

            Object.defineProperty(MuteStream.prototype, 'isTTY', {
                get: getIsTTY,
                set: setIsTTY,
                enumerable: true,
                configurable: true,
            });

            function getIsTTY() {
                return this._dest
                    ? this._dest.isTTY
                    : this._src
                    ? this._src.isTTY
                    : false;
            }

            // basically just get replace the getter/setter with a regular value
            function setIsTTY(isTTY) {
                Object.defineProperty(this, 'isTTY', {
                    value: isTTY,
                    enumerable: true,
                    writable: true,
                    configurable: true,
                });
            }

            Object.defineProperty(MuteStream.prototype, 'rows', {
                get: function () {
                    return this._dest
                        ? this._dest.rows
                        : this._src
                        ? this._src.rows
                        : undefined;
                },
                enumerable: true,
                configurable: true,
            });

            Object.defineProperty(MuteStream.prototype, 'columns', {
                get: function () {
                    return this._dest
                        ? this._dest.columns
                        : this._src
                        ? this._src.columns
                        : undefined;
                },
                enumerable: true,
                configurable: true,
            });

            MuteStream.prototype.pipe = function (dest, options) {
                this._dest = dest;
                return Stream.prototype.pipe.call(this, dest, options);
            };

            MuteStream.prototype.pause = function () {
                if (this._src) return this._src.pause();
            };

            MuteStream.prototype.resume = function () {
                if (this._src) return this._src.resume();
            };

            MuteStream.prototype.write = function (c) {
                if (this.muted) {
                    if (!this.replace) return true;
                    if (c.match(/^\u001b/)) {
                        if (c.indexOf(this._prompt) === 0) {
                            c = c.substr(this._prompt.length);
                            c = c.replace(/./g, this.replace);
                            c = this._prompt + c;
                        }
                        this._hadControl = true;
                        return this.emit('data', c);
                    } else {
                        if (
                            this._prompt &&
                            this._hadControl &&
                            c.indexOf(this._prompt) === 0
                        ) {
                            this._hadControl = false;
                            this.emit('data', this._prompt);
                            c = c.substr(this._prompt.length);
                        }
                        c = c.toString().replace(/./g, this.replace);
                    }
                }
                this.emit('data', c);
            };

            MuteStream.prototype.end = function (c) {
                if (this.muted) {
                    if (c && this.replace) {
                        c = c.toString().replace(/./g, this.replace);
                    } else {
                        c = null;
                    }
                }
                if (c) this.emit('data', c);
                this.emit('end');
            };

            function proxy(fn) {
                return function () {
                    var d = this._dest;
                    var s = this._src;
                    if (d && d[fn]) d[fn].apply(d, arguments);
                    if (s && s[fn]) s[fn].apply(s, arguments);
                };
            }

            MuteStream.prototype.destroy = proxy('destroy');
            MuteStream.prototype.destroySoon = proxy('destroySoon');
            MuteStream.prototype.close = proxy('close');

            /***/
        },

        /***/ 138: /***/ function (module) {
            'use strict';

            var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

            module.exports = function (str) {
                if (typeof str !== 'string') {
                    throw new TypeError('Expected a string');
                }

                return str.replace(matchOperatorsRe, '\\$&');
            };

            /***/
        },

        /***/ 168: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            const fs = __webpack_require__(747).promises;
            const path = __webpack_require__(622);

            module.exports = async (directory) => {
                try {
                    const routeTree = {};

                    let currentPointer = routeTree;

                    await processDirectory(directory, 'api', currentPointer);

                    return routeTree;
                } catch (err) {
                    console.error(err);
                    throw err;
                }
            };

            async function processDirectory(currPath, dir, pointer) {
                try {
                    const pathToCheck = path.join(currPath, dir);
                    const pathStat = await fs.stat(pathToCheck);
                    if (pathStat.isDirectory()) {
                        const dirContent = await fs.readdir(pathToCheck);
                        const treeMods = dirContent.map(async (fileRecord) => {
                            const nextPathToCheck = path.join(
                                pathToCheck,
                                fileRecord
                            );
                            const nextFile = await fs.stat(nextPathToCheck);
                            const nextPointer =
                                pointer[dir] ||
                                (pointer[dir] = {
                                    type: 'dir',
                                });

                            if (nextFile.isDirectory()) {
                                await processDirectory(
                                    pathToCheck,
                                    fileRecord,
                                    nextPointer
                                );
                            } else if (nextFile.isFile()) {
                                processFile(fileRecord, nextPointer);
                            }
                            return Promise.resolve();
                        });

                        await Promise.all(treeMods);
                    } else if (pathStat.isFile()) {
                        processFile(dir, pointer);
                    }
                } catch (err) {
                    console.error(err);
                    throw err;
                }
            }

            function processFile(file, pointer) {
                const paramRegex = /^\[(\w+)\].js$/;
                if (paramRegex.test(file)) {
                    const matchingParams = file.match(paramRegex);
                    const param = matchingParams[1];
                    const noExt = file.replace('.js', '');
                    const valuesInsertion = {
                        type: 'file',
                        params: [param],
                        index: file,
                    };
                    pointer[noExt] = valuesInsertion;
                } else if (file === 'index.js') {
                    pointer.type = 'dir';
                    pointer.index = 'index.js';
                } else {
                    const noExt = file.replace('.js', '');
                    const valuesInsertion = {
                        type: 'file',
                        index: file,
                    };
                    pointer[noExt] = valuesInsertion;
                }
            }

            /***/
        },

        /***/ 179: /***/ function (module) {
            'use strict';

            module.exports = ({ stream = process.stdout } = {}) => {
                return Boolean(
                    stream &&
                        stream.isTTY &&
                        process.env.TERM !== 'dumb' &&
                        !('CI' in process.env)
                );
            };

            /***/
        },

        /***/ 239: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            const fs = __webpack_require__(747);
            const path = __webpack_require__(622);
            const createRouteDir = __webpack_require__(104);
            const ora = __webpack_require__(937);
            const createAvailableRoutes = __webpack_require__(168);

            module.exports = async (directory) => {
                const spinner = ora('Compiling...').start();
                try {
                    const availableRoutesTree = await createAvailableRoutes(
                        directory
                    );

                    const routePath = await createRouteDir();

                    await new Promise((resolve, reject) => {
                        fs.writeFile(
                            path.join(routePath, 'routes.json'),
                            JSON.stringify(availableRoutesTree),
                            (err, done) => {
                                if (err) reject(err);
                                resolve(done);
                            }
                        );
                    });

                    setTimeout(() => {
                        spinner.color = 'green';
                        spinner.text = 'Compiled';
                        spinner.succeed();
                    }, 1000);
                } catch (err) {
                    spinner.color = 'red';
                    spinner.text = 'Failed';
                    spinner.fail();
                    console.error(err);
                    throw err;
                }
            };

            /***/
        },

        /***/ 240: /***/ function (module) {
            'use strict';

            module.exports = {
                aliceblue: [240, 248, 255],
                antiquewhite: [250, 235, 215],
                aqua: [0, 255, 255],
                aquamarine: [127, 255, 212],
                azure: [240, 255, 255],
                beige: [245, 245, 220],
                bisque: [255, 228, 196],
                black: [0, 0, 0],
                blanchedalmond: [255, 235, 205],
                blue: [0, 0, 255],
                blueviolet: [138, 43, 226],
                brown: [165, 42, 42],
                burlywood: [222, 184, 135],
                cadetblue: [95, 158, 160],
                chartreuse: [127, 255, 0],
                chocolate: [210, 105, 30],
                coral: [255, 127, 80],
                cornflowerblue: [100, 149, 237],
                cornsilk: [255, 248, 220],
                crimson: [220, 20, 60],
                cyan: [0, 255, 255],
                darkblue: [0, 0, 139],
                darkcyan: [0, 139, 139],
                darkgoldenrod: [184, 134, 11],
                darkgray: [169, 169, 169],
                darkgreen: [0, 100, 0],
                darkgrey: [169, 169, 169],
                darkkhaki: [189, 183, 107],
                darkmagenta: [139, 0, 139],
                darkolivegreen: [85, 107, 47],
                darkorange: [255, 140, 0],
                darkorchid: [153, 50, 204],
                darkred: [139, 0, 0],
                darksalmon: [233, 150, 122],
                darkseagreen: [143, 188, 143],
                darkslateblue: [72, 61, 139],
                darkslategray: [47, 79, 79],
                darkslategrey: [47, 79, 79],
                darkturquoise: [0, 206, 209],
                darkviolet: [148, 0, 211],
                deeppink: [255, 20, 147],
                deepskyblue: [0, 191, 255],
                dimgray: [105, 105, 105],
                dimgrey: [105, 105, 105],
                dodgerblue: [30, 144, 255],
                firebrick: [178, 34, 34],
                floralwhite: [255, 250, 240],
                forestgreen: [34, 139, 34],
                fuchsia: [255, 0, 255],
                gainsboro: [220, 220, 220],
                ghostwhite: [248, 248, 255],
                gold: [255, 215, 0],
                goldenrod: [218, 165, 32],
                gray: [128, 128, 128],
                green: [0, 128, 0],
                greenyellow: [173, 255, 47],
                grey: [128, 128, 128],
                honeydew: [240, 255, 240],
                hotpink: [255, 105, 180],
                indianred: [205, 92, 92],
                indigo: [75, 0, 130],
                ivory: [255, 255, 240],
                khaki: [240, 230, 140],
                lavender: [230, 230, 250],
                lavenderblush: [255, 240, 245],
                lawngreen: [124, 252, 0],
                lemonchiffon: [255, 250, 205],
                lightblue: [173, 216, 230],
                lightcoral: [240, 128, 128],
                lightcyan: [224, 255, 255],
                lightgoldenrodyellow: [250, 250, 210],
                lightgray: [211, 211, 211],
                lightgreen: [144, 238, 144],
                lightgrey: [211, 211, 211],
                lightpink: [255, 182, 193],
                lightsalmon: [255, 160, 122],
                lightseagreen: [32, 178, 170],
                lightskyblue: [135, 206, 250],
                lightslategray: [119, 136, 153],
                lightslategrey: [119, 136, 153],
                lightsteelblue: [176, 196, 222],
                lightyellow: [255, 255, 224],
                lime: [0, 255, 0],
                limegreen: [50, 205, 50],
                linen: [250, 240, 230],
                magenta: [255, 0, 255],
                maroon: [128, 0, 0],
                mediumaquamarine: [102, 205, 170],
                mediumblue: [0, 0, 205],
                mediumorchid: [186, 85, 211],
                mediumpurple: [147, 112, 219],
                mediumseagreen: [60, 179, 113],
                mediumslateblue: [123, 104, 238],
                mediumspringgreen: [0, 250, 154],
                mediumturquoise: [72, 209, 204],
                mediumvioletred: [199, 21, 133],
                midnightblue: [25, 25, 112],
                mintcream: [245, 255, 250],
                mistyrose: [255, 228, 225],
                moccasin: [255, 228, 181],
                navajowhite: [255, 222, 173],
                navy: [0, 0, 128],
                oldlace: [253, 245, 230],
                olive: [128, 128, 0],
                olivedrab: [107, 142, 35],
                orange: [255, 165, 0],
                orangered: [255, 69, 0],
                orchid: [218, 112, 214],
                palegoldenrod: [238, 232, 170],
                palegreen: [152, 251, 152],
                paleturquoise: [175, 238, 238],
                palevioletred: [219, 112, 147],
                papayawhip: [255, 239, 213],
                peachpuff: [255, 218, 185],
                peru: [205, 133, 63],
                pink: [255, 192, 203],
                plum: [221, 160, 221],
                powderblue: [176, 224, 230],
                purple: [128, 0, 128],
                rebeccapurple: [102, 51, 153],
                red: [255, 0, 0],
                rosybrown: [188, 143, 143],
                royalblue: [65, 105, 225],
                saddlebrown: [139, 69, 19],
                salmon: [250, 128, 114],
                sandybrown: [244, 164, 96],
                seagreen: [46, 139, 87],
                seashell: [255, 245, 238],
                sienna: [160, 82, 45],
                silver: [192, 192, 192],
                skyblue: [135, 206, 235],
                slateblue: [106, 90, 205],
                slategray: [112, 128, 144],
                slategrey: [112, 128, 144],
                snow: [255, 250, 250],
                springgreen: [0, 255, 127],
                steelblue: [70, 130, 180],
                tan: [210, 180, 140],
                teal: [0, 128, 128],
                thistle: [216, 191, 216],
                tomato: [255, 99, 71],
                turquoise: [64, 224, 208],
                violet: [238, 130, 238],
                wheat: [245, 222, 179],
                white: [255, 255, 255],
                whitesmoke: [245, 245, 245],
                yellow: [255, 255, 0],
                yellowgreen: [154, 205, 50],
            };

            /***/
        },

        /***/ 247: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            'use strict';

            const os = __webpack_require__(87);
            const tty = __webpack_require__(867);
            const hasFlag = __webpack_require__(364);

            const { env } = process;

            let forceColor;
            if (
                hasFlag('no-color') ||
                hasFlag('no-colors') ||
                hasFlag('color=false') ||
                hasFlag('color=never')
            ) {
                forceColor = 0;
            } else if (
                hasFlag('color') ||
                hasFlag('colors') ||
                hasFlag('color=true') ||
                hasFlag('color=always')
            ) {
                forceColor = 1;
            }

            if ('FORCE_COLOR' in env) {
                if (env.FORCE_COLOR === 'true') {
                    forceColor = 1;
                } else if (env.FORCE_COLOR === 'false') {
                    forceColor = 0;
                } else {
                    forceColor =
                        env.FORCE_COLOR.length === 0
                            ? 1
                            : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
                }
            }

            function translateLevel(level) {
                if (level === 0) {
                    return false;
                }

                return {
                    level,
                    hasBasic: true,
                    has256: level >= 2,
                    has16m: level >= 3,
                };
            }

            function supportsColor(haveStream, streamIsTTY) {
                if (forceColor === 0) {
                    return 0;
                }

                if (
                    hasFlag('color=16m') ||
                    hasFlag('color=full') ||
                    hasFlag('color=truecolor')
                ) {
                    return 3;
                }

                if (hasFlag('color=256')) {
                    return 2;
                }

                if (haveStream && !streamIsTTY && forceColor === undefined) {
                    return 0;
                }

                const min = forceColor || 0;

                if (env.TERM === 'dumb') {
                    return min;
                }

                if (process.platform === 'win32') {
                    // Windows 10 build 10586 is the first Windows release that supports 256 colors.
                    // Windows 10 build 14931 is the first release that supports 16m/TrueColor.
                    const osRelease = os.release().split('.');
                    if (
                        Number(osRelease[0]) >= 10 &&
                        Number(osRelease[2]) >= 10586
                    ) {
                        return Number(osRelease[2]) >= 14931 ? 3 : 2;
                    }

                    return 1;
                }

                if ('CI' in env) {
                    if (
                        ['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(
                            (sign) => sign in env
                        ) ||
                        env.CI_NAME === 'codeship'
                    ) {
                        return 1;
                    }

                    return min;
                }

                if ('TEAMCITY_VERSION' in env) {
                    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(
                        env.TEAMCITY_VERSION
                    )
                        ? 1
                        : 0;
                }

                if ('GITHUB_ACTIONS' in env) {
                    return 1;
                }

                if (env.COLORTERM === 'truecolor') {
                    return 3;
                }

                if ('TERM_PROGRAM' in env) {
                    const version = parseInt(
                        (env.TERM_PROGRAM_VERSION || '').split('.')[0],
                        10
                    );

                    switch (env.TERM_PROGRAM) {
                        case 'iTerm.app':
                            return version >= 3 ? 3 : 2;
                        case 'Apple_Terminal':
                            return 2;
                        // No default
                    }
                }

                if (/-256(color)?$/i.test(env.TERM)) {
                    return 2;
                }

                if (
                    /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(
                        env.TERM
                    )
                ) {
                    return 1;
                }

                if ('COLORTERM' in env) {
                    return 1;
                }

                return min;
            }

            function getSupportLevel(stream) {
                const level = supportsColor(stream, stream && stream.isTTY);
                return translateLevel(level);
            }

            module.exports = {
                supportsColor: getSupportLevel,
                stdout: translateLevel(supportsColor(true, tty.isatty(1))),
                stderr: translateLevel(supportsColor(true, tty.isatty(2))),
            };

            /***/
        },

        /***/ 260: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            const conversions = __webpack_require__(600);

            /*
	This function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

            function buildGraph() {
                const graph = {};
                // https://jsperf.com/object-keys-vs-for-in-with-closure/3
                const models = Object.keys(conversions);

                for (let len = models.length, i = 0; i < len; i++) {
                    graph[models[i]] = {
                        // http://jsperf.com/1-vs-infinity
                        // micro-opt, but this is simple.
                        distance: -1,
                        parent: null,
                    };
                }

                return graph;
            }

            // https://en.wikipedia.org/wiki/Breadth-first_search
            function deriveBFS(fromModel) {
                const graph = buildGraph();
                const queue = [fromModel]; // Unshift -> queue -> pop

                graph[fromModel].distance = 0;

                while (queue.length) {
                    const current = queue.pop();
                    const adjacents = Object.keys(conversions[current]);

                    for (let len = adjacents.length, i = 0; i < len; i++) {
                        const adjacent = adjacents[i];
                        const node = graph[adjacent];

                        if (node.distance === -1) {
                            node.distance = graph[current].distance + 1;
                            node.parent = current;
                            queue.unshift(adjacent);
                        }
                    }
                }

                return graph;
            }

            function link(from, to) {
                return function (args) {
                    return to(from(args));
                };
            }

            function wrapConversion(toModel, graph) {
                const path = [graph[toModel].parent, toModel];
                let fn = conversions[graph[toModel].parent][toModel];

                let cur = graph[toModel].parent;
                while (graph[cur].parent) {
                    path.unshift(graph[cur].parent);
                    fn = link(conversions[graph[cur].parent][cur], fn);
                    cur = graph[cur].parent;
                }

                fn.conversion = path;
                return fn;
            }

            module.exports = function (fromModel) {
                const graph = deriveBFS(fromModel);
                const conversion = {};

                const models = Object.keys(graph);
                for (let len = models.length, i = 0; i < len; i++) {
                    const toModel = models[i];
                    const node = graph[toModel];

                    if (node.parent === null) {
                        // No possible conversion, or this node is the source model.
                        continue;
                    }

                    conversion[toModel] = wrapConversion(toModel, graph);
                }

                return conversion;
            };

            /***/
        },

        /***/ 275: /***/ function (
            __unusedmodule,
            exports,
            __webpack_require__
        ) {
            'use strict';

            const restoreCursor = __webpack_require__(599);

            let isHidden = false;

            exports.show = (writableStream = process.stderr) => {
                if (!writableStream.isTTY) {
                    return;
                }

                isHidden = false;
                writableStream.write('\u001B[?25h');
            };

            exports.hide = (writableStream = process.stderr) => {
                if (!writableStream.isTTY) {
                    return;
                }

                restoreCursor();
                isHidden = true;
                writableStream.write('\u001B[?25l');
            };

            exports.toggle = (force, writableStream) => {
                if (force !== undefined) {
                    isHidden = force;
                }

                if (isHidden) {
                    exports.show(writableStream);
                } else {
                    exports.hide(writableStream);
                }
            };

            /***/
        },

        /***/ 304: /***/ function (module) {
            module.exports = (url) => {
                const tokens = url.split('/').filter((item) => item);
                return tokens;
            };

            /***/
        },

        /***/ 345: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            /* MIT license */
            var cssKeywords = __webpack_require__(240);

            // NOTE: conversions should only return primitive values (i.e. arrays, or
            //       values that give correct `typeof` results).
            //       do not use box values types (i.e. Number(), String(), etc.)

            var reverseKeywords = {};
            for (var key in cssKeywords) {
                if (cssKeywords.hasOwnProperty(key)) {
                    reverseKeywords[cssKeywords[key]] = key;
                }
            }

            var convert = (module.exports = {
                rgb: { channels: 3, labels: 'rgb' },
                hsl: { channels: 3, labels: 'hsl' },
                hsv: { channels: 3, labels: 'hsv' },
                hwb: { channels: 3, labels: 'hwb' },
                cmyk: { channels: 4, labels: 'cmyk' },
                xyz: { channels: 3, labels: 'xyz' },
                lab: { channels: 3, labels: 'lab' },
                lch: { channels: 3, labels: 'lch' },
                hex: { channels: 1, labels: ['hex'] },
                keyword: { channels: 1, labels: ['keyword'] },
                ansi16: { channels: 1, labels: ['ansi16'] },
                ansi256: { channels: 1, labels: ['ansi256'] },
                hcg: { channels: 3, labels: ['h', 'c', 'g'] },
                apple: { channels: 3, labels: ['r16', 'g16', 'b16'] },
                gray: { channels: 1, labels: ['gray'] },
            });

            // hide .channels and .labels properties
            for (var model in convert) {
                if (convert.hasOwnProperty(model)) {
                    if (!('channels' in convert[model])) {
                        throw new Error('missing channels property: ' + model);
                    }

                    if (!('labels' in convert[model])) {
                        throw new Error(
                            'missing channel labels property: ' + model
                        );
                    }

                    if (
                        convert[model].labels.length !== convert[model].channels
                    ) {
                        throw new Error(
                            'channel and label counts mismatch: ' + model
                        );
                    }

                    var channels = convert[model].channels;
                    var labels = convert[model].labels;
                    delete convert[model].channels;
                    delete convert[model].labels;
                    Object.defineProperty(convert[model], 'channels', {
                        value: channels,
                    });
                    Object.defineProperty(convert[model], 'labels', {
                        value: labels,
                    });
                }
            }

            convert.rgb.hsl = function (rgb) {
                var r = rgb[0] / 255;
                var g = rgb[1] / 255;
                var b = rgb[2] / 255;
                var min = Math.min(r, g, b);
                var max = Math.max(r, g, b);
                var delta = max - min;
                var h;
                var s;
                var l;

                if (max === min) {
                    h = 0;
                } else if (r === max) {
                    h = (g - b) / delta;
                } else if (g === max) {
                    h = 2 + (b - r) / delta;
                } else if (b === max) {
                    h = 4 + (r - g) / delta;
                }

                h = Math.min(h * 60, 360);

                if (h < 0) {
                    h += 360;
                }

                l = (min + max) / 2;

                if (max === min) {
                    s = 0;
                } else if (l <= 0.5) {
                    s = delta / (max + min);
                } else {
                    s = delta / (2 - max - min);
                }

                return [h, s * 100, l * 100];
            };

            convert.rgb.hsv = function (rgb) {
                var rdif;
                var gdif;
                var bdif;
                var h;
                var s;

                var r = rgb[0] / 255;
                var g = rgb[1] / 255;
                var b = rgb[2] / 255;
                var v = Math.max(r, g, b);
                var diff = v - Math.min(r, g, b);
                var diffc = function (c) {
                    return (v - c) / 6 / diff + 1 / 2;
                };

                if (diff === 0) {
                    h = s = 0;
                } else {
                    s = diff / v;
                    rdif = diffc(r);
                    gdif = diffc(g);
                    bdif = diffc(b);

                    if (r === v) {
                        h = bdif - gdif;
                    } else if (g === v) {
                        h = 1 / 3 + rdif - bdif;
                    } else if (b === v) {
                        h = 2 / 3 + gdif - rdif;
                    }
                    if (h < 0) {
                        h += 1;
                    } else if (h > 1) {
                        h -= 1;
                    }
                }

                return [h * 360, s * 100, v * 100];
            };

            convert.rgb.hwb = function (rgb) {
                var r = rgb[0];
                var g = rgb[1];
                var b = rgb[2];
                var h = convert.rgb.hsl(rgb)[0];
                var w = (1 / 255) * Math.min(r, Math.min(g, b));

                b = 1 - (1 / 255) * Math.max(r, Math.max(g, b));

                return [h, w * 100, b * 100];
            };

            convert.rgb.cmyk = function (rgb) {
                var r = rgb[0] / 255;
                var g = rgb[1] / 255;
                var b = rgb[2] / 255;
                var c;
                var m;
                var y;
                var k;

                k = Math.min(1 - r, 1 - g, 1 - b);
                c = (1 - r - k) / (1 - k) || 0;
                m = (1 - g - k) / (1 - k) || 0;
                y = (1 - b - k) / (1 - k) || 0;

                return [c * 100, m * 100, y * 100, k * 100];
            };

            /**
             * See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
             * */
            function comparativeDistance(x, y) {
                return (
                    Math.pow(x[0] - y[0], 2) +
                    Math.pow(x[1] - y[1], 2) +
                    Math.pow(x[2] - y[2], 2)
                );
            }

            convert.rgb.keyword = function (rgb) {
                var reversed = reverseKeywords[rgb];
                if (reversed) {
                    return reversed;
                }

                var currentClosestDistance = Infinity;
                var currentClosestKeyword;

                for (var keyword in cssKeywords) {
                    if (cssKeywords.hasOwnProperty(keyword)) {
                        var value = cssKeywords[keyword];

                        // Compute comparative distance
                        var distance = comparativeDistance(rgb, value);

                        // Check if its less, if so set as closest
                        if (distance < currentClosestDistance) {
                            currentClosestDistance = distance;
                            currentClosestKeyword = keyword;
                        }
                    }
                }

                return currentClosestKeyword;
            };

            convert.keyword.rgb = function (keyword) {
                return cssKeywords[keyword];
            };

            convert.rgb.xyz = function (rgb) {
                var r = rgb[0] / 255;
                var g = rgb[1] / 255;
                var b = rgb[2] / 255;

                // assume sRGB
                r =
                    r > 0.04045
                        ? Math.pow((r + 0.055) / 1.055, 2.4)
                        : r / 12.92;
                g =
                    g > 0.04045
                        ? Math.pow((g + 0.055) / 1.055, 2.4)
                        : g / 12.92;
                b =
                    b > 0.04045
                        ? Math.pow((b + 0.055) / 1.055, 2.4)
                        : b / 12.92;

                var x = r * 0.4124 + g * 0.3576 + b * 0.1805;
                var y = r * 0.2126 + g * 0.7152 + b * 0.0722;
                var z = r * 0.0193 + g * 0.1192 + b * 0.9505;

                return [x * 100, y * 100, z * 100];
            };

            convert.rgb.lab = function (rgb) {
                var xyz = convert.rgb.xyz(rgb);
                var x = xyz[0];
                var y = xyz[1];
                var z = xyz[2];
                var l;
                var a;
                var b;

                x /= 95.047;
                y /= 100;
                z /= 108.883;

                x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
                y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
                z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

                l = 116 * y - 16;
                a = 500 * (x - y);
                b = 200 * (y - z);

                return [l, a, b];
            };

            convert.hsl.rgb = function (hsl) {
                var h = hsl[0] / 360;
                var s = hsl[1] / 100;
                var l = hsl[2] / 100;
                var t1;
                var t2;
                var t3;
                var rgb;
                var val;

                if (s === 0) {
                    val = l * 255;
                    return [val, val, val];
                }

                if (l < 0.5) {
                    t2 = l * (1 + s);
                } else {
                    t2 = l + s - l * s;
                }

                t1 = 2 * l - t2;

                rgb = [0, 0, 0];
                for (var i = 0; i < 3; i++) {
                    t3 = h + (1 / 3) * -(i - 1);
                    if (t3 < 0) {
                        t3++;
                    }
                    if (t3 > 1) {
                        t3--;
                    }

                    if (6 * t3 < 1) {
                        val = t1 + (t2 - t1) * 6 * t3;
                    } else if (2 * t3 < 1) {
                        val = t2;
                    } else if (3 * t3 < 2) {
                        val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
                    } else {
                        val = t1;
                    }

                    rgb[i] = val * 255;
                }

                return rgb;
            };

            convert.hsl.hsv = function (hsl) {
                var h = hsl[0];
                var s = hsl[1] / 100;
                var l = hsl[2] / 100;
                var smin = s;
                var lmin = Math.max(l, 0.01);
                var sv;
                var v;

                l *= 2;
                s *= l <= 1 ? l : 2 - l;
                smin *= lmin <= 1 ? lmin : 2 - lmin;
                v = (l + s) / 2;
                sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

                return [h, sv * 100, v * 100];
            };

            convert.hsv.rgb = function (hsv) {
                var h = hsv[0] / 60;
                var s = hsv[1] / 100;
                var v = hsv[2] / 100;
                var hi = Math.floor(h) % 6;

                var f = h - Math.floor(h);
                var p = 255 * v * (1 - s);
                var q = 255 * v * (1 - s * f);
                var t = 255 * v * (1 - s * (1 - f));
                v *= 255;

                switch (hi) {
                    case 0:
                        return [v, t, p];
                    case 1:
                        return [q, v, p];
                    case 2:
                        return [p, v, t];
                    case 3:
                        return [p, q, v];
                    case 4:
                        return [t, p, v];
                    case 5:
                        return [v, p, q];
                }
            };

            convert.hsv.hsl = function (hsv) {
                var h = hsv[0];
                var s = hsv[1] / 100;
                var v = hsv[2] / 100;
                var vmin = Math.max(v, 0.01);
                var lmin;
                var sl;
                var l;

                l = (2 - s) * v;
                lmin = (2 - s) * vmin;
                sl = s * vmin;
                sl /= lmin <= 1 ? lmin : 2 - lmin;
                sl = sl || 0;
                l /= 2;

                return [h, sl * 100, l * 100];
            };

            // http://dev.w3.org/csswg/css-color/#hwb-to-rgb
            convert.hwb.rgb = function (hwb) {
                var h = hwb[0] / 360;
                var wh = hwb[1] / 100;
                var bl = hwb[2] / 100;
                var ratio = wh + bl;
                var i;
                var v;
                var f;
                var n;

                // wh + bl cant be > 1
                if (ratio > 1) {
                    wh /= ratio;
                    bl /= ratio;
                }

                i = Math.floor(6 * h);
                v = 1 - bl;
                f = 6 * h - i;

                if ((i & 0x01) !== 0) {
                    f = 1 - f;
                }

                n = wh + f * (v - wh); // linear interpolation

                var r;
                var g;
                var b;
                switch (i) {
                    default:
                    case 6:
                    case 0:
                        r = v;
                        g = n;
                        b = wh;
                        break;
                    case 1:
                        r = n;
                        g = v;
                        b = wh;
                        break;
                    case 2:
                        r = wh;
                        g = v;
                        b = n;
                        break;
                    case 3:
                        r = wh;
                        g = n;
                        b = v;
                        break;
                    case 4:
                        r = n;
                        g = wh;
                        b = v;
                        break;
                    case 5:
                        r = v;
                        g = wh;
                        b = n;
                        break;
                }

                return [r * 255, g * 255, b * 255];
            };

            convert.cmyk.rgb = function (cmyk) {
                var c = cmyk[0] / 100;
                var m = cmyk[1] / 100;
                var y = cmyk[2] / 100;
                var k = cmyk[3] / 100;
                var r;
                var g;
                var b;

                r = 1 - Math.min(1, c * (1 - k) + k);
                g = 1 - Math.min(1, m * (1 - k) + k);
                b = 1 - Math.min(1, y * (1 - k) + k);

                return [r * 255, g * 255, b * 255];
            };

            convert.xyz.rgb = function (xyz) {
                var x = xyz[0] / 100;
                var y = xyz[1] / 100;
                var z = xyz[2] / 100;
                var r;
                var g;
                var b;

                r = x * 3.2406 + y * -1.5372 + z * -0.4986;
                g = x * -0.9689 + y * 1.8758 + z * 0.0415;
                b = x * 0.0557 + y * -0.204 + z * 1.057;

                // assume sRGB
                r =
                    r > 0.0031308
                        ? 1.055 * Math.pow(r, 1.0 / 2.4) - 0.055
                        : r * 12.92;

                g =
                    g > 0.0031308
                        ? 1.055 * Math.pow(g, 1.0 / 2.4) - 0.055
                        : g * 12.92;

                b =
                    b > 0.0031308
                        ? 1.055 * Math.pow(b, 1.0 / 2.4) - 0.055
                        : b * 12.92;

                r = Math.min(Math.max(0, r), 1);
                g = Math.min(Math.max(0, g), 1);
                b = Math.min(Math.max(0, b), 1);

                return [r * 255, g * 255, b * 255];
            };

            convert.xyz.lab = function (xyz) {
                var x = xyz[0];
                var y = xyz[1];
                var z = xyz[2];
                var l;
                var a;
                var b;

                x /= 95.047;
                y /= 100;
                z /= 108.883;

                x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
                y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
                z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

                l = 116 * y - 16;
                a = 500 * (x - y);
                b = 200 * (y - z);

                return [l, a, b];
            };

            convert.lab.xyz = function (lab) {
                var l = lab[0];
                var a = lab[1];
                var b = lab[2];
                var x;
                var y;
                var z;

                y = (l + 16) / 116;
                x = a / 500 + y;
                z = y - b / 200;

                var y2 = Math.pow(y, 3);
                var x2 = Math.pow(x, 3);
                var z2 = Math.pow(z, 3);
                y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
                x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
                z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

                x *= 95.047;
                y *= 100;
                z *= 108.883;

                return [x, y, z];
            };

            convert.lab.lch = function (lab) {
                var l = lab[0];
                var a = lab[1];
                var b = lab[2];
                var hr;
                var h;
                var c;

                hr = Math.atan2(b, a);
                h = (hr * 360) / 2 / Math.PI;

                if (h < 0) {
                    h += 360;
                }

                c = Math.sqrt(a * a + b * b);

                return [l, c, h];
            };

            convert.lch.lab = function (lch) {
                var l = lch[0];
                var c = lch[1];
                var h = lch[2];
                var a;
                var b;
                var hr;

                hr = (h / 360) * 2 * Math.PI;
                a = c * Math.cos(hr);
                b = c * Math.sin(hr);

                return [l, a, b];
            };

            convert.rgb.ansi16 = function (args) {
                var r = args[0];
                var g = args[1];
                var b = args[2];
                var value =
                    1 in arguments ? arguments[1] : convert.rgb.hsv(args)[2]; // hsv -> ansi16 optimization

                value = Math.round(value / 50);

                if (value === 0) {
                    return 30;
                }

                var ansi =
                    30 +
                    ((Math.round(b / 255) << 2) |
                        (Math.round(g / 255) << 1) |
                        Math.round(r / 255));

                if (value === 2) {
                    ansi += 60;
                }

                return ansi;
            };

            convert.hsv.ansi16 = function (args) {
                // optimization here; we already know the value and don't need to get
                // it converted for us.
                return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
            };

            convert.rgb.ansi256 = function (args) {
                var r = args[0];
                var g = args[1];
                var b = args[2];

                // we use the extended greyscale palette here, with the exception of
                // black and white. normal palette only has 4 greyscale shades.
                if (r === g && g === b) {
                    if (r < 8) {
                        return 16;
                    }

                    if (r > 248) {
                        return 231;
                    }

                    return Math.round(((r - 8) / 247) * 24) + 232;
                }

                var ansi =
                    16 +
                    36 * Math.round((r / 255) * 5) +
                    6 * Math.round((g / 255) * 5) +
                    Math.round((b / 255) * 5);

                return ansi;
            };

            convert.ansi16.rgb = function (args) {
                var color = args % 10;

                // handle greyscale
                if (color === 0 || color === 7) {
                    if (args > 50) {
                        color += 3.5;
                    }

                    color = (color / 10.5) * 255;

                    return [color, color, color];
                }

                var mult = (~~(args > 50) + 1) * 0.5;
                var r = (color & 1) * mult * 255;
                var g = ((color >> 1) & 1) * mult * 255;
                var b = ((color >> 2) & 1) * mult * 255;

                return [r, g, b];
            };

            convert.ansi256.rgb = function (args) {
                // handle greyscale
                if (args >= 232) {
                    var c = (args - 232) * 10 + 8;
                    return [c, c, c];
                }

                args -= 16;

                var rem;
                var r = (Math.floor(args / 36) / 5) * 255;
                var g = (Math.floor((rem = args % 36) / 6) / 5) * 255;
                var b = ((rem % 6) / 5) * 255;

                return [r, g, b];
            };

            convert.rgb.hex = function (args) {
                var integer =
                    ((Math.round(args[0]) & 0xff) << 16) +
                    ((Math.round(args[1]) & 0xff) << 8) +
                    (Math.round(args[2]) & 0xff);

                var string = integer.toString(16).toUpperCase();
                return '000000'.substring(string.length) + string;
            };

            convert.hex.rgb = function (args) {
                var match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
                if (!match) {
                    return [0, 0, 0];
                }

                var colorString = match[0];

                if (match[0].length === 3) {
                    colorString = colorString
                        .split('')
                        .map(function (char) {
                            return char + char;
                        })
                        .join('');
                }

                var integer = parseInt(colorString, 16);
                var r = (integer >> 16) & 0xff;
                var g = (integer >> 8) & 0xff;
                var b = integer & 0xff;

                return [r, g, b];
            };

            convert.rgb.hcg = function (rgb) {
                var r = rgb[0] / 255;
                var g = rgb[1] / 255;
                var b = rgb[2] / 255;
                var max = Math.max(Math.max(r, g), b);
                var min = Math.min(Math.min(r, g), b);
                var chroma = max - min;
                var grayscale;
                var hue;

                if (chroma < 1) {
                    grayscale = min / (1 - chroma);
                } else {
                    grayscale = 0;
                }

                if (chroma <= 0) {
                    hue = 0;
                } else if (max === r) {
                    hue = ((g - b) / chroma) % 6;
                } else if (max === g) {
                    hue = 2 + (b - r) / chroma;
                } else {
                    hue = 4 + (r - g) / chroma + 4;
                }

                hue /= 6;
                hue %= 1;

                return [hue * 360, chroma * 100, grayscale * 100];
            };

            convert.hsl.hcg = function (hsl) {
                var s = hsl[1] / 100;
                var l = hsl[2] / 100;
                var c = 1;
                var f = 0;

                if (l < 0.5) {
                    c = 2.0 * s * l;
                } else {
                    c = 2.0 * s * (1.0 - l);
                }

                if (c < 1.0) {
                    f = (l - 0.5 * c) / (1.0 - c);
                }

                return [hsl[0], c * 100, f * 100];
            };

            convert.hsv.hcg = function (hsv) {
                var s = hsv[1] / 100;
                var v = hsv[2] / 100;

                var c = s * v;
                var f = 0;

                if (c < 1.0) {
                    f = (v - c) / (1 - c);
                }

                return [hsv[0], c * 100, f * 100];
            };

            convert.hcg.rgb = function (hcg) {
                var h = hcg[0] / 360;
                var c = hcg[1] / 100;
                var g = hcg[2] / 100;

                if (c === 0.0) {
                    return [g * 255, g * 255, g * 255];
                }

                var pure = [0, 0, 0];
                var hi = (h % 1) * 6;
                var v = hi % 1;
                var w = 1 - v;
                var mg = 0;

                switch (Math.floor(hi)) {
                    case 0:
                        pure[0] = 1;
                        pure[1] = v;
                        pure[2] = 0;
                        break;
                    case 1:
                        pure[0] = w;
                        pure[1] = 1;
                        pure[2] = 0;
                        break;
                    case 2:
                        pure[0] = 0;
                        pure[1] = 1;
                        pure[2] = v;
                        break;
                    case 3:
                        pure[0] = 0;
                        pure[1] = w;
                        pure[2] = 1;
                        break;
                    case 4:
                        pure[0] = v;
                        pure[1] = 0;
                        pure[2] = 1;
                        break;
                    default:
                        pure[0] = 1;
                        pure[1] = 0;
                        pure[2] = w;
                }

                mg = (1.0 - c) * g;

                return [
                    (c * pure[0] + mg) * 255,
                    (c * pure[1] + mg) * 255,
                    (c * pure[2] + mg) * 255,
                ];
            };

            convert.hcg.hsv = function (hcg) {
                var c = hcg[1] / 100;
                var g = hcg[2] / 100;

                var v = c + g * (1.0 - c);
                var f = 0;

                if (v > 0.0) {
                    f = c / v;
                }

                return [hcg[0], f * 100, v * 100];
            };

            convert.hcg.hsl = function (hcg) {
                var c = hcg[1] / 100;
                var g = hcg[2] / 100;

                var l = g * (1.0 - c) + 0.5 * c;
                var s = 0;

                if (l > 0.0 && l < 0.5) {
                    s = c / (2 * l);
                } else if (l >= 0.5 && l < 1.0) {
                    s = c / (2 * (1 - l));
                }

                return [hcg[0], s * 100, l * 100];
            };

            convert.hcg.hwb = function (hcg) {
                var c = hcg[1] / 100;
                var g = hcg[2] / 100;
                var v = c + g * (1.0 - c);
                return [hcg[0], (v - c) * 100, (1 - v) * 100];
            };

            convert.hwb.hcg = function (hwb) {
                var w = hwb[1] / 100;
                var b = hwb[2] / 100;
                var v = 1 - b;
                var c = v - w;
                var g = 0;

                if (c < 1) {
                    g = (v - c) / (1 - c);
                }

                return [hwb[0], c * 100, g * 100];
            };

            convert.apple.rgb = function (apple) {
                return [
                    (apple[0] / 65535) * 255,
                    (apple[1] / 65535) * 255,
                    (apple[2] / 65535) * 255,
                ];
            };

            convert.rgb.apple = function (rgb) {
                return [
                    (rgb[0] / 255) * 65535,
                    (rgb[1] / 255) * 65535,
                    (rgb[2] / 255) * 65535,
                ];
            };

            convert.gray.rgb = function (args) {
                return [
                    (args[0] / 100) * 255,
                    (args[0] / 100) * 255,
                    (args[0] / 100) * 255,
                ];
            };

            convert.gray.hsl = convert.gray.hsv = function (args) {
                return [0, 0, args[0]];
            };

            convert.gray.hwb = function (gray) {
                return [0, 100, gray[0]];
            };

            convert.gray.cmyk = function (gray) {
                return [0, 0, 0, gray[0]];
            };

            convert.gray.lab = function (gray) {
                return [gray[0], 0, 0];
            };

            convert.gray.hex = function (gray) {
                var val = Math.round((gray[0] / 100) * 255) & 0xff;
                var integer = (val << 16) + (val << 8) + val;

                var string = integer.toString(16).toUpperCase();
                return '000000'.substring(string.length) + string;
            };

            convert.rgb.gray = function (rgb) {
                var val = (rgb[0] + rgb[1] + rgb[2]) / 3;
                return [(val / 255) * 100];
            };

            /***/
        },

        /***/ 357: /***/ function (module) {
            module.exports = require('assert');

            /***/
        },

        /***/ 364: /***/ function (module) {
            'use strict';

            module.exports = (flag, argv = process.argv) => {
                const prefix = flag.startsWith('-')
                    ? ''
                    : flag.length === 1
                    ? '-'
                    : '--';
                const position = argv.indexOf(prefix + flag);
                const terminatorPosition = argv.indexOf('--');
                return (
                    position !== -1 &&
                    (terminatorPosition === -1 || position < terminatorPosition)
                );
            };

            /***/
        },

        /***/ 379: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            'use strict';

            const escapeStringRegexp = __webpack_require__(138);
            const ansiStyles = __webpack_require__(894);
            const stdoutColor = __webpack_require__(927).stdout;

            const template = __webpack_require__(575);

            const isSimpleWindowsTerm =
                process.platform === 'win32' &&
                !(process.env.TERM || '').toLowerCase().startsWith('xterm');

            // `supportsColor.level` → `ansiStyles.color[name]` mapping
            const levelMapping = ['ansi', 'ansi', 'ansi256', 'ansi16m'];

            // `color-convert` models to exclude from the Chalk API due to conflicts and such
            const skipModels = new Set(['gray']);

            const styles = Object.create(null);

            function applyOptions(obj, options) {
                options = options || {};

                // Detect level if not set manually
                const scLevel = stdoutColor ? stdoutColor.level : 0;
                obj.level =
                    options.level === undefined ? scLevel : options.level;
                obj.enabled =
                    'enabled' in options ? options.enabled : obj.level > 0;
            }

            function Chalk(options) {
                // We check for this.template here since calling `chalk.constructor()`
                // by itself will have a `this` of a previously constructed chalk object
                if (!this || !(this instanceof Chalk) || this.template) {
                    const chalk = {};
                    applyOptions(chalk, options);

                    chalk.template = function () {
                        const args = [].slice.call(arguments);
                        return chalkTag.apply(
                            null,
                            [chalk.template].concat(args)
                        );
                    };

                    Object.setPrototypeOf(chalk, Chalk.prototype);
                    Object.setPrototypeOf(chalk.template, chalk);

                    chalk.template.constructor = Chalk;

                    return chalk.template;
                }

                applyOptions(this, options);
            }

            // Use bright blue on Windows as the normal blue color is illegible
            if (isSimpleWindowsTerm) {
                ansiStyles.blue.open = '\u001B[94m';
            }

            for (const key of Object.keys(ansiStyles)) {
                ansiStyles[key].closeRe = new RegExp(
                    escapeStringRegexp(ansiStyles[key].close),
                    'g'
                );

                styles[key] = {
                    get() {
                        const codes = ansiStyles[key];
                        return build.call(
                            this,
                            this._styles ? this._styles.concat(codes) : [codes],
                            this._empty,
                            key
                        );
                    },
                };
            }

            styles.visible = {
                get() {
                    return build.call(
                        this,
                        this._styles || [],
                        true,
                        'visible'
                    );
                },
            };

            ansiStyles.color.closeRe = new RegExp(
                escapeStringRegexp(ansiStyles.color.close),
                'g'
            );
            for (const model of Object.keys(ansiStyles.color.ansi)) {
                if (skipModels.has(model)) {
                    continue;
                }

                styles[model] = {
                    get() {
                        const level = this.level;
                        return function () {
                            const open = ansiStyles.color[levelMapping[level]][
                                model
                            ].apply(null, arguments);
                            const codes = {
                                open,
                                close: ansiStyles.color.close,
                                closeRe: ansiStyles.color.closeRe,
                            };
                            return build.call(
                                this,
                                this._styles
                                    ? this._styles.concat(codes)
                                    : [codes],
                                this._empty,
                                model
                            );
                        };
                    },
                };
            }

            ansiStyles.bgColor.closeRe = new RegExp(
                escapeStringRegexp(ansiStyles.bgColor.close),
                'g'
            );
            for (const model of Object.keys(ansiStyles.bgColor.ansi)) {
                if (skipModels.has(model)) {
                    continue;
                }

                const bgModel = 'bg' + model[0].toUpperCase() + model.slice(1);
                styles[bgModel] = {
                    get() {
                        const level = this.level;
                        return function () {
                            const open = ansiStyles.bgColor[
                                levelMapping[level]
                            ][model].apply(null, arguments);
                            const codes = {
                                open,
                                close: ansiStyles.bgColor.close,
                                closeRe: ansiStyles.bgColor.closeRe,
                            };
                            return build.call(
                                this,
                                this._styles
                                    ? this._styles.concat(codes)
                                    : [codes],
                                this._empty,
                                model
                            );
                        };
                    },
                };
            }

            const proto = Object.defineProperties(() => {}, styles);

            function build(_styles, _empty, key) {
                const builder = function () {
                    return applyStyle.apply(builder, arguments);
                };

                builder._styles = _styles;
                builder._empty = _empty;

                const self = this;

                Object.defineProperty(builder, 'level', {
                    enumerable: true,
                    get() {
                        return self.level;
                    },
                    set(level) {
                        self.level = level;
                    },
                });

                Object.defineProperty(builder, 'enabled', {
                    enumerable: true,
                    get() {
                        return self.enabled;
                    },
                    set(enabled) {
                        self.enabled = enabled;
                    },
                });

                // See below for fix regarding invisible grey/dim combination on Windows
                builder.hasGrey =
                    this.hasGrey || key === 'gray' || key === 'grey';

                // `__proto__` is used because we must return a function, but there is
                // no way to create a function with a different prototype
                builder.__proto__ = proto; // eslint-disable-line no-proto

                return builder;
            }

            function applyStyle() {
                // Support varags, but simply cast to string in case there's only one arg
                const args = arguments;
                const argsLen = args.length;
                let str = String(arguments[0]);

                if (argsLen === 0) {
                    return '';
                }

                if (argsLen > 1) {
                    // Don't slice `arguments`, it prevents V8 optimizations
                    for (let a = 1; a < argsLen; a++) {
                        str += ' ' + args[a];
                    }
                }

                if (!this.enabled || this.level <= 0 || !str) {
                    return this._empty ? '' : str;
                }

                // Turns out that on Windows dimmed gray text becomes invisible in cmd.exe,
                // see https://github.com/chalk/chalk/issues/58
                // If we're on Windows and we're dealing with a gray color, temporarily make 'dim' a noop.
                const originalDim = ansiStyles.dim.open;
                if (isSimpleWindowsTerm && this.hasGrey) {
                    ansiStyles.dim.open = '';
                }

                for (const code of this._styles.slice().reverse()) {
                    // Replace any instances already present with a re-opening code
                    // otherwise only the part of the string until said closing code
                    // will be colored, and the rest will simply be 'plain'.
                    str =
                        code.open +
                        str.replace(code.closeRe, code.open) +
                        code.close;

                    // Close the styling before a linebreak and reopen
                    // after next line to fix a bleed issue on macOS
                    // https://github.com/chalk/chalk/pull/92
                    str = str.replace(/\r?\n/g, `${code.close}$&${code.open}`);
                }

                // Reset the original `dim` if we changed it to work around the Windows dimmed gray issue
                ansiStyles.dim.open = originalDim;

                return str;
            }

            function chalkTag(chalk, strings) {
                if (!Array.isArray(strings)) {
                    // If chalk() was called by itself or with a string,
                    // return the string itself as a string.
                    return [].slice.call(arguments, 1).join(' ');
                }

                const args = [].slice.call(arguments, 2);
                const parts = [strings.raw[0]];

                for (let i = 1; i < strings.length; i++) {
                    parts.push(String(args[i - 1]).replace(/[{}\\]/g, '\\$&'));
                    parts.push(String(strings.raw[i]));
                }

                return template(chalk, parts.join(''));
            }

            Object.defineProperties(Chalk.prototype, styles);

            module.exports = Chalk(); // eslint-disable-line new-cap
            module.exports.supportsColor = stdoutColor;
            module.exports.default = module.exports; // For TypeScript

            /***/
        },

        /***/ 403: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            'use strict';

            const spinners = Object.assign({}, __webpack_require__(668));

            module.exports = spinners;
            // TODO: Remove this for the next major release
            module.exports.default = spinners;

            /***/
        },

        /***/ 413: /***/ function (module) {
            module.exports = require('stream');

            /***/
        },

        /***/ 436: /***/ function (module) {
            'use strict';

            module.exports = ({ onlyFirst = false } = {}) => {
                const pattern = [
                    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
                    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))',
                ].join('|');

                return new RegExp(pattern, onlyFirst ? undefined : 'g');
            };

            /***/
        },

        /***/ 497: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            // Note: since nyc uses this module to output coverage, any lines
            // that are in the direct sync flow of nyc's outputCoverage are
            // ignored, since we can never get coverage for them.
            var assert = __webpack_require__(357);
            var signals = __webpack_require__(654);
            var isWin = /^win/i.test(process.platform);

            var EE = __webpack_require__(614);
            /* istanbul ignore if */
            if (typeof EE !== 'function') {
                EE = EE.EventEmitter;
            }

            var emitter;
            if (process.__signal_exit_emitter__) {
                emitter = process.__signal_exit_emitter__;
            } else {
                emitter = process.__signal_exit_emitter__ = new EE();
                emitter.count = 0;
                emitter.emitted = {};
            }

            // Because this emitter is a global, we have to check to see if a
            // previous version of this library failed to enable infinite listeners.
            // I know what you're about to say.  But literally everything about
            // signal-exit is a compromise with evil.  Get used to it.
            if (!emitter.infinite) {
                emitter.setMaxListeners(Infinity);
                emitter.infinite = true;
            }

            module.exports = function (cb, opts) {
                assert.equal(
                    typeof cb,
                    'function',
                    'a callback must be provided for exit handler'
                );

                if (loaded === false) {
                    load();
                }

                var ev = 'exit';
                if (opts && opts.alwaysLast) {
                    ev = 'afterexit';
                }

                var remove = function () {
                    emitter.removeListener(ev, cb);
                    if (
                        emitter.listeners('exit').length === 0 &&
                        emitter.listeners('afterexit').length === 0
                    ) {
                        unload();
                    }
                };
                emitter.on(ev, cb);

                return remove;
            };

            module.exports.unload = unload;
            function unload() {
                if (!loaded) {
                    return;
                }
                loaded = false;

                signals.forEach(function (sig) {
                    try {
                        process.removeListener(sig, sigListeners[sig]);
                    } catch (er) {}
                });
                process.emit = originalProcessEmit;
                process.reallyExit = originalProcessReallyExit;
                emitter.count -= 1;
            }

            function emit(event, code, signal) {
                if (emitter.emitted[event]) {
                    return;
                }
                emitter.emitted[event] = true;
                emitter.emit(event, code, signal);
            }

            // { <signal>: <listener fn>, ... }
            var sigListeners = {};
            signals.forEach(function (sig) {
                sigListeners[sig] = function listener() {
                    // If there are no other listeners, an exit is coming!
                    // Simplest way: remove us and then re-send the signal.
                    // We know that this will kill the process, so we can
                    // safely emit now.
                    var listeners = process.listeners(sig);
                    if (listeners.length === emitter.count) {
                        unload();
                        emit('exit', null, sig);
                        /* istanbul ignore next */
                        emit('afterexit', null, sig);
                        /* istanbul ignore next */
                        if (isWin && sig === 'SIGHUP') {
                            // "SIGHUP" throws an `ENOSYS` error on Windows,
                            // so use a supported signal instead
                            sig = 'SIGINT';
                        }
                        process.kill(process.pid, sig);
                    }
                };
            });

            module.exports.signals = function () {
                return signals;
            };

            module.exports.load = load;

            var loaded = false;

            function load() {
                if (loaded) {
                    return;
                }
                loaded = true;

                // This is the number of onSignalExit's that are in play.
                // It's important so that we can count the correct number of
                // listeners on signals, and don't wait for the other one to
                // handle it instead of us.
                emitter.count += 1;

                signals = signals.filter(function (sig) {
                    try {
                        process.on(sig, sigListeners[sig]);
                        return true;
                    } catch (er) {
                        return false;
                    }
                });

                process.emit = processEmit;
                process.reallyExit = processReallyExit;
            }

            var originalProcessReallyExit = process.reallyExit;
            function processReallyExit(code) {
                process.exitCode = code || 0;
                emit('exit', process.exitCode, null);
                /* istanbul ignore next */
                emit('afterexit', process.exitCode, null);
                /* istanbul ignore next */
                originalProcessReallyExit.call(process, process.exitCode);
            }

            var originalProcessEmit = process.emit;
            function processEmit(ev, arg) {
                if (ev === 'exit') {
                    if (arg !== undefined) {
                        process.exitCode = arg;
                    }
                    var ret = originalProcessEmit.apply(this, arguments);
                    emit('exit', process.exitCode, null);
                    /* istanbul ignore next */
                    emit('afterexit', process.exitCode, null);
                    return ret;
                } else {
                    return originalProcessEmit.apply(this, arguments);
                }
            }

            /***/
        },

        /***/ 544: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            const router = __webpack_require__(22);
            const getAvailableRoutes = __webpack_require__(917);

            module.exports = async (req, res) => {
                try {
                    const availableRoutes = await getAvailableRoutes();

                    return router(availableRoutes, req, res);
                } catch (err) {
                    console.error(err);
                    throw err;
                }
            };

            /***/
        },

        /***/ 575: /***/ function (module) {
            'use strict';

            const TEMPLATE_REGEX = /(?:\\(u[a-f\d]{4}|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
            const STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
            const STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
            const ESCAPE_REGEX = /\\(u[a-f\d]{4}|x[a-f\d]{2}|.)|([^\\])/gi;

            const ESCAPES = new Map([
                ['n', '\n'],
                ['r', '\r'],
                ['t', '\t'],
                ['b', '\b'],
                ['f', '\f'],
                ['v', '\v'],
                ['0', '\0'],
                ['\\', '\\'],
                ['e', '\u001B'],
                ['a', '\u0007'],
            ]);

            function unescape(c) {
                if (
                    (c[0] === 'u' && c.length === 5) ||
                    (c[0] === 'x' && c.length === 3)
                ) {
                    return String.fromCharCode(parseInt(c.slice(1), 16));
                }

                return ESCAPES.get(c) || c;
            }

            function parseArguments(name, args) {
                const results = [];
                const chunks = args.trim().split(/\s*,\s*/g);
                let matches;

                for (const chunk of chunks) {
                    if (!isNaN(chunk)) {
                        results.push(Number(chunk));
                    } else if ((matches = chunk.match(STRING_REGEX))) {
                        results.push(
                            matches[2].replace(ESCAPE_REGEX, (m, escape, chr) =>
                                escape ? unescape(escape) : chr
                            )
                        );
                    } else {
                        throw new Error(
                            `Invalid Chalk template style argument: ${chunk} (in style '${name}')`
                        );
                    }
                }

                return results;
            }

            function parseStyle(style) {
                STYLE_REGEX.lastIndex = 0;

                const results = [];
                let matches;

                while ((matches = STYLE_REGEX.exec(style)) !== null) {
                    const name = matches[1];

                    if (matches[2]) {
                        const args = parseArguments(name, matches[2]);
                        results.push([name].concat(args));
                    } else {
                        results.push([name]);
                    }
                }

                return results;
            }

            function buildStyle(chalk, styles) {
                const enabled = {};

                for (const layer of styles) {
                    for (const style of layer.styles) {
                        enabled[style[0]] = layer.inverse
                            ? null
                            : style.slice(1);
                    }
                }

                let current = chalk;
                for (const styleName of Object.keys(enabled)) {
                    if (Array.isArray(enabled[styleName])) {
                        if (!(styleName in current)) {
                            throw new Error(
                                `Unknown Chalk style: ${styleName}`
                            );
                        }

                        if (enabled[styleName].length > 0) {
                            current = current[styleName].apply(
                                current,
                                enabled[styleName]
                            );
                        } else {
                            current = current[styleName];
                        }
                    }
                }

                return current;
            }

            module.exports = (chalk, tmp) => {
                const styles = [];
                const chunks = [];
                let chunk = [];

                // eslint-disable-next-line max-params
                tmp.replace(
                    TEMPLATE_REGEX,
                    (m, escapeChar, inverse, style, close, chr) => {
                        if (escapeChar) {
                            chunk.push(unescape(escapeChar));
                        } else if (style) {
                            const str = chunk.join('');
                            chunk = [];
                            chunks.push(
                                styles.length === 0
                                    ? str
                                    : buildStyle(chalk, styles)(str)
                            );
                            styles.push({ inverse, styles: parseStyle(style) });
                        } else if (close) {
                            if (styles.length === 0) {
                                throw new Error(
                                    'Found extraneous } in Chalk template literal'
                                );
                            }

                            chunks.push(
                                buildStyle(chalk, styles)(chunk.join(''))
                            );
                            chunk = [];
                            styles.pop();
                        } else {
                            chunk.push(chr);
                        }
                    }
                );

                chunks.push(chunk.join(''));

                if (styles.length > 0) {
                    const errMsg = `Chalk template literal is missing ${
                        styles.length
                    } closing bracket${styles.length === 1 ? '' : 's'} (\`}\`)`;
                    throw new Error(errMsg);
                }

                return chunks.join('');
            };

            /***/
        },

        /***/ 586: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            var conversions = __webpack_require__(345);
            var route = __webpack_require__(877);

            var convert = {};

            var models = Object.keys(conversions);

            function wrapRaw(fn) {
                var wrappedFn = function (args) {
                    if (args === undefined || args === null) {
                        return args;
                    }

                    if (arguments.length > 1) {
                        args = Array.prototype.slice.call(arguments);
                    }

                    return fn(args);
                };

                // preserve .conversion property if there is one
                if ('conversion' in fn) {
                    wrappedFn.conversion = fn.conversion;
                }

                return wrappedFn;
            }

            function wrapRounded(fn) {
                var wrappedFn = function (args) {
                    if (args === undefined || args === null) {
                        return args;
                    }

                    if (arguments.length > 1) {
                        args = Array.prototype.slice.call(arguments);
                    }

                    var result = fn(args);

                    // we're assuming the result is an array here.
                    // see notice in conversions.js; don't use box types
                    // in conversion functions.
                    if (typeof result === 'object') {
                        for (var len = result.length, i = 0; i < len; i++) {
                            result[i] = Math.round(result[i]);
                        }
                    }

                    return result;
                };

                // preserve .conversion property if there is one
                if ('conversion' in fn) {
                    wrappedFn.conversion = fn.conversion;
                }

                return wrappedFn;
            }

            models.forEach(function (fromModel) {
                convert[fromModel] = {};

                Object.defineProperty(convert[fromModel], 'channels', {
                    value: conversions[fromModel].channels,
                });
                Object.defineProperty(convert[fromModel], 'labels', {
                    value: conversions[fromModel].labels,
                });

                var routes = route(fromModel);
                var routeModels = Object.keys(routes);

                routeModels.forEach(function (toModel) {
                    var fn = routes[toModel];

                    convert[fromModel][toModel] = wrapRounded(fn);
                    convert[fromModel][toModel].raw = wrapRaw(fn);
                });
            });

            module.exports = convert;

            /***/
        },

        /***/ 592: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            const conversions = __webpack_require__(600);
            const route = __webpack_require__(260);

            const convert = {};

            const models = Object.keys(conversions);

            function wrapRaw(fn) {
                const wrappedFn = function (...args) {
                    const arg0 = args[0];
                    if (arg0 === undefined || arg0 === null) {
                        return arg0;
                    }

                    if (arg0.length > 1) {
                        args = arg0;
                    }

                    return fn(args);
                };

                // Preserve .conversion property if there is one
                if ('conversion' in fn) {
                    wrappedFn.conversion = fn.conversion;
                }

                return wrappedFn;
            }

            function wrapRounded(fn) {
                const wrappedFn = function (...args) {
                    const arg0 = args[0];

                    if (arg0 === undefined || arg0 === null) {
                        return arg0;
                    }

                    if (arg0.length > 1) {
                        args = arg0;
                    }

                    const result = fn(args);

                    // We're assuming the result is an array here.
                    // see notice in conversions.js; don't use box types
                    // in conversion functions.
                    if (typeof result === 'object') {
                        for (let len = result.length, i = 0; i < len; i++) {
                            result[i] = Math.round(result[i]);
                        }
                    }

                    return result;
                };

                // Preserve .conversion property if there is one
                if ('conversion' in fn) {
                    wrappedFn.conversion = fn.conversion;
                }

                return wrappedFn;
            }

            models.forEach((fromModel) => {
                convert[fromModel] = {};

                Object.defineProperty(convert[fromModel], 'channels', {
                    value: conversions[fromModel].channels,
                });
                Object.defineProperty(convert[fromModel], 'labels', {
                    value: conversions[fromModel].labels,
                });

                const routes = route(fromModel);
                const routeModels = Object.keys(routes);

                routeModels.forEach((toModel) => {
                    const fn = routes[toModel];

                    convert[fromModel][toModel] = wrapRounded(fn);
                    convert[fromModel][toModel].raw = wrapRaw(fn);
                });
            });

            module.exports = convert;

            /***/
        },

        /***/ 598: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            'use strict';

            const chalk = __webpack_require__(379);

            const isSupported =
                process.platform !== 'win32' ||
                process.env.CI ||
                process.env.TERM === 'xterm-256color';

            const main = {
                info: chalk.blue('ℹ'),
                success: chalk.green('✔'),
                warning: chalk.yellow('⚠'),
                error: chalk.red('✖'),
            };

            const fallbacks = {
                info: chalk.blue('i'),
                success: chalk.green('√'),
                warning: chalk.yellow('‼'),
                error: chalk.red('×'),
            };

            module.exports = isSupported ? main : fallbacks;

            /***/
        },

        /***/ 599: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            'use strict';

            const onetime = __webpack_require__(723);
            const signalExit = __webpack_require__(497);

            module.exports = onetime(() => {
                signalExit(
                    () => {
                        process.stderr.write('\u001B[?25h');
                    },
                    { alwaysLast: true }
                );
            });

            /***/
        },

        /***/ 600: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            /* MIT license */
            /* eslint-disable no-mixed-operators */
            const cssKeywords = __webpack_require__(885);

            // NOTE: conversions should only return primitive values (i.e. arrays, or
            //       values that give correct `typeof` results).
            //       do not use box values types (i.e. Number(), String(), etc.)

            const reverseKeywords = {};
            for (const key of Object.keys(cssKeywords)) {
                reverseKeywords[cssKeywords[key]] = key;
            }

            const convert = {
                rgb: { channels: 3, labels: 'rgb' },
                hsl: { channels: 3, labels: 'hsl' },
                hsv: { channels: 3, labels: 'hsv' },
                hwb: { channels: 3, labels: 'hwb' },
                cmyk: { channels: 4, labels: 'cmyk' },
                xyz: { channels: 3, labels: 'xyz' },
                lab: { channels: 3, labels: 'lab' },
                lch: { channels: 3, labels: 'lch' },
                hex: { channels: 1, labels: ['hex'] },
                keyword: { channels: 1, labels: ['keyword'] },
                ansi16: { channels: 1, labels: ['ansi16'] },
                ansi256: { channels: 1, labels: ['ansi256'] },
                hcg: { channels: 3, labels: ['h', 'c', 'g'] },
                apple: { channels: 3, labels: ['r16', 'g16', 'b16'] },
                gray: { channels: 1, labels: ['gray'] },
            };

            module.exports = convert;

            // Hide .channels and .labels properties
            for (const model of Object.keys(convert)) {
                if (!('channels' in convert[model])) {
                    throw new Error('missing channels property: ' + model);
                }

                if (!('labels' in convert[model])) {
                    throw new Error(
                        'missing channel labels property: ' + model
                    );
                }

                if (convert[model].labels.length !== convert[model].channels) {
                    throw new Error(
                        'channel and label counts mismatch: ' + model
                    );
                }

                const { channels, labels } = convert[model];
                delete convert[model].channels;
                delete convert[model].labels;
                Object.defineProperty(convert[model], 'channels', {
                    value: channels,
                });
                Object.defineProperty(convert[model], 'labels', {
                    value: labels,
                });
            }

            convert.rgb.hsl = function (rgb) {
                const r = rgb[0] / 255;
                const g = rgb[1] / 255;
                const b = rgb[2] / 255;
                const min = Math.min(r, g, b);
                const max = Math.max(r, g, b);
                const delta = max - min;
                let h;
                let s;

                if (max === min) {
                    h = 0;
                } else if (r === max) {
                    h = (g - b) / delta;
                } else if (g === max) {
                    h = 2 + (b - r) / delta;
                } else if (b === max) {
                    h = 4 + (r - g) / delta;
                }

                h = Math.min(h * 60, 360);

                if (h < 0) {
                    h += 360;
                }

                const l = (min + max) / 2;

                if (max === min) {
                    s = 0;
                } else if (l <= 0.5) {
                    s = delta / (max + min);
                } else {
                    s = delta / (2 - max - min);
                }

                return [h, s * 100, l * 100];
            };

            convert.rgb.hsv = function (rgb) {
                let rdif;
                let gdif;
                let bdif;
                let h;
                let s;

                const r = rgb[0] / 255;
                const g = rgb[1] / 255;
                const b = rgb[2] / 255;
                const v = Math.max(r, g, b);
                const diff = v - Math.min(r, g, b);
                const diffc = function (c) {
                    return (v - c) / 6 / diff + 1 / 2;
                };

                if (diff === 0) {
                    h = 0;
                    s = 0;
                } else {
                    s = diff / v;
                    rdif = diffc(r);
                    gdif = diffc(g);
                    bdif = diffc(b);

                    if (r === v) {
                        h = bdif - gdif;
                    } else if (g === v) {
                        h = 1 / 3 + rdif - bdif;
                    } else if (b === v) {
                        h = 2 / 3 + gdif - rdif;
                    }

                    if (h < 0) {
                        h += 1;
                    } else if (h > 1) {
                        h -= 1;
                    }
                }

                return [h * 360, s * 100, v * 100];
            };

            convert.rgb.hwb = function (rgb) {
                const r = rgb[0];
                const g = rgb[1];
                let b = rgb[2];
                const h = convert.rgb.hsl(rgb)[0];
                const w = (1 / 255) * Math.min(r, Math.min(g, b));

                b = 1 - (1 / 255) * Math.max(r, Math.max(g, b));

                return [h, w * 100, b * 100];
            };

            convert.rgb.cmyk = function (rgb) {
                const r = rgb[0] / 255;
                const g = rgb[1] / 255;
                const b = rgb[2] / 255;

                const k = Math.min(1 - r, 1 - g, 1 - b);
                const c = (1 - r - k) / (1 - k) || 0;
                const m = (1 - g - k) / (1 - k) || 0;
                const y = (1 - b - k) / (1 - k) || 0;

                return [c * 100, m * 100, y * 100, k * 100];
            };

            function comparativeDistance(x, y) {
                /*
		See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
	*/
                return (
                    (x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2 + (x[2] - y[2]) ** 2
                );
            }

            convert.rgb.keyword = function (rgb) {
                const reversed = reverseKeywords[rgb];
                if (reversed) {
                    return reversed;
                }

                let currentClosestDistance = Infinity;
                let currentClosestKeyword;

                for (const keyword of Object.keys(cssKeywords)) {
                    const value = cssKeywords[keyword];

                    // Compute comparative distance
                    const distance = comparativeDistance(rgb, value);

                    // Check if its less, if so set as closest
                    if (distance < currentClosestDistance) {
                        currentClosestDistance = distance;
                        currentClosestKeyword = keyword;
                    }
                }

                return currentClosestKeyword;
            };

            convert.keyword.rgb = function (keyword) {
                return cssKeywords[keyword];
            };

            convert.rgb.xyz = function (rgb) {
                let r = rgb[0] / 255;
                let g = rgb[1] / 255;
                let b = rgb[2] / 255;

                // Assume sRGB
                r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
                g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92;
                b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;

                const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
                const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
                const z = r * 0.0193 + g * 0.1192 + b * 0.9505;

                return [x * 100, y * 100, z * 100];
            };

            convert.rgb.lab = function (rgb) {
                const xyz = convert.rgb.xyz(rgb);
                let x = xyz[0];
                let y = xyz[1];
                let z = xyz[2];

                x /= 95.047;
                y /= 100;
                z /= 108.883;

                x = x > 0.008856 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
                y = y > 0.008856 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
                z = z > 0.008856 ? z ** (1 / 3) : 7.787 * z + 16 / 116;

                const l = 116 * y - 16;
                const a = 500 * (x - y);
                const b = 200 * (y - z);

                return [l, a, b];
            };

            convert.hsl.rgb = function (hsl) {
                const h = hsl[0] / 360;
                const s = hsl[1] / 100;
                const l = hsl[2] / 100;
                let t2;
                let t3;
                let val;

                if (s === 0) {
                    val = l * 255;
                    return [val, val, val];
                }

                if (l < 0.5) {
                    t2 = l * (1 + s);
                } else {
                    t2 = l + s - l * s;
                }

                const t1 = 2 * l - t2;

                const rgb = [0, 0, 0];
                for (let i = 0; i < 3; i++) {
                    t3 = h + (1 / 3) * -(i - 1);
                    if (t3 < 0) {
                        t3++;
                    }

                    if (t3 > 1) {
                        t3--;
                    }

                    if (6 * t3 < 1) {
                        val = t1 + (t2 - t1) * 6 * t3;
                    } else if (2 * t3 < 1) {
                        val = t2;
                    } else if (3 * t3 < 2) {
                        val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
                    } else {
                        val = t1;
                    }

                    rgb[i] = val * 255;
                }

                return rgb;
            };

            convert.hsl.hsv = function (hsl) {
                const h = hsl[0];
                let s = hsl[1] / 100;
                let l = hsl[2] / 100;
                let smin = s;
                const lmin = Math.max(l, 0.01);

                l *= 2;
                s *= l <= 1 ? l : 2 - l;
                smin *= lmin <= 1 ? lmin : 2 - lmin;
                const v = (l + s) / 2;
                const sv =
                    l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

                return [h, sv * 100, v * 100];
            };

            convert.hsv.rgb = function (hsv) {
                const h = hsv[0] / 60;
                const s = hsv[1] / 100;
                let v = hsv[2] / 100;
                const hi = Math.floor(h) % 6;

                const f = h - Math.floor(h);
                const p = 255 * v * (1 - s);
                const q = 255 * v * (1 - s * f);
                const t = 255 * v * (1 - s * (1 - f));
                v *= 255;

                switch (hi) {
                    case 0:
                        return [v, t, p];
                    case 1:
                        return [q, v, p];
                    case 2:
                        return [p, v, t];
                    case 3:
                        return [p, q, v];
                    case 4:
                        return [t, p, v];
                    case 5:
                        return [v, p, q];
                }
            };

            convert.hsv.hsl = function (hsv) {
                const h = hsv[0];
                const s = hsv[1] / 100;
                const v = hsv[2] / 100;
                const vmin = Math.max(v, 0.01);
                let sl;
                let l;

                l = (2 - s) * v;
                const lmin = (2 - s) * vmin;
                sl = s * vmin;
                sl /= lmin <= 1 ? lmin : 2 - lmin;
                sl = sl || 0;
                l /= 2;

                return [h, sl * 100, l * 100];
            };

            // http://dev.w3.org/csswg/css-color/#hwb-to-rgb
            convert.hwb.rgb = function (hwb) {
                const h = hwb[0] / 360;
                let wh = hwb[1] / 100;
                let bl = hwb[2] / 100;
                const ratio = wh + bl;
                let f;

                // Wh + bl cant be > 1
                if (ratio > 1) {
                    wh /= ratio;
                    bl /= ratio;
                }

                const i = Math.floor(6 * h);
                const v = 1 - bl;
                f = 6 * h - i;

                if ((i & 0x01) !== 0) {
                    f = 1 - f;
                }

                const n = wh + f * (v - wh); // Linear interpolation

                let r;
                let g;
                let b;
                /* eslint-disable max-statements-per-line,no-multi-spaces */
                switch (i) {
                    default:
                    case 6:
                    case 0:
                        r = v;
                        g = n;
                        b = wh;
                        break;
                    case 1:
                        r = n;
                        g = v;
                        b = wh;
                        break;
                    case 2:
                        r = wh;
                        g = v;
                        b = n;
                        break;
                    case 3:
                        r = wh;
                        g = n;
                        b = v;
                        break;
                    case 4:
                        r = n;
                        g = wh;
                        b = v;
                        break;
                    case 5:
                        r = v;
                        g = wh;
                        b = n;
                        break;
                }
                /* eslint-enable max-statements-per-line,no-multi-spaces */

                return [r * 255, g * 255, b * 255];
            };

            convert.cmyk.rgb = function (cmyk) {
                const c = cmyk[0] / 100;
                const m = cmyk[1] / 100;
                const y = cmyk[2] / 100;
                const k = cmyk[3] / 100;

                const r = 1 - Math.min(1, c * (1 - k) + k);
                const g = 1 - Math.min(1, m * (1 - k) + k);
                const b = 1 - Math.min(1, y * (1 - k) + k);

                return [r * 255, g * 255, b * 255];
            };

            convert.xyz.rgb = function (xyz) {
                const x = xyz[0] / 100;
                const y = xyz[1] / 100;
                const z = xyz[2] / 100;
                let r;
                let g;
                let b;

                r = x * 3.2406 + y * -1.5372 + z * -0.4986;
                g = x * -0.9689 + y * 1.8758 + z * 0.0415;
                b = x * 0.0557 + y * -0.204 + z * 1.057;

                // Assume sRGB
                r =
                    r > 0.0031308
                        ? 1.055 * r ** (1.0 / 2.4) - 0.055
                        : r * 12.92;

                g =
                    g > 0.0031308
                        ? 1.055 * g ** (1.0 / 2.4) - 0.055
                        : g * 12.92;

                b =
                    b > 0.0031308
                        ? 1.055 * b ** (1.0 / 2.4) - 0.055
                        : b * 12.92;

                r = Math.min(Math.max(0, r), 1);
                g = Math.min(Math.max(0, g), 1);
                b = Math.min(Math.max(0, b), 1);

                return [r * 255, g * 255, b * 255];
            };

            convert.xyz.lab = function (xyz) {
                let x = xyz[0];
                let y = xyz[1];
                let z = xyz[2];

                x /= 95.047;
                y /= 100;
                z /= 108.883;

                x = x > 0.008856 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
                y = y > 0.008856 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
                z = z > 0.008856 ? z ** (1 / 3) : 7.787 * z + 16 / 116;

                const l = 116 * y - 16;
                const a = 500 * (x - y);
                const b = 200 * (y - z);

                return [l, a, b];
            };

            convert.lab.xyz = function (lab) {
                const l = lab[0];
                const a = lab[1];
                const b = lab[2];
                let x;
                let y;
                let z;

                y = (l + 16) / 116;
                x = a / 500 + y;
                z = y - b / 200;

                const y2 = y ** 3;
                const x2 = x ** 3;
                const z2 = z ** 3;
                y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
                x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
                z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

                x *= 95.047;
                y *= 100;
                z *= 108.883;

                return [x, y, z];
            };

            convert.lab.lch = function (lab) {
                const l = lab[0];
                const a = lab[1];
                const b = lab[2];
                let h;

                const hr = Math.atan2(b, a);
                h = (hr * 360) / 2 / Math.PI;

                if (h < 0) {
                    h += 360;
                }

                const c = Math.sqrt(a * a + b * b);

                return [l, c, h];
            };

            convert.lch.lab = function (lch) {
                const l = lch[0];
                const c = lch[1];
                const h = lch[2];

                const hr = (h / 360) * 2 * Math.PI;
                const a = c * Math.cos(hr);
                const b = c * Math.sin(hr);

                return [l, a, b];
            };

            convert.rgb.ansi16 = function (args, saturation = null) {
                const [r, g, b] = args;
                let value =
                    saturation === null ? convert.rgb.hsv(args)[2] : saturation; // Hsv -> ansi16 optimization

                value = Math.round(value / 50);

                if (value === 0) {
                    return 30;
                }

                let ansi =
                    30 +
                    ((Math.round(b / 255) << 2) |
                        (Math.round(g / 255) << 1) |
                        Math.round(r / 255));

                if (value === 2) {
                    ansi += 60;
                }

                return ansi;
            };

            convert.hsv.ansi16 = function (args) {
                // Optimization here; we already know the value and don't need to get
                // it converted for us.
                return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
            };

            convert.rgb.ansi256 = function (args) {
                const r = args[0];
                const g = args[1];
                const b = args[2];

                // We use the extended greyscale palette here, with the exception of
                // black and white. normal palette only has 4 greyscale shades.
                if (r === g && g === b) {
                    if (r < 8) {
                        return 16;
                    }

                    if (r > 248) {
                        return 231;
                    }

                    return Math.round(((r - 8) / 247) * 24) + 232;
                }

                const ansi =
                    16 +
                    36 * Math.round((r / 255) * 5) +
                    6 * Math.round((g / 255) * 5) +
                    Math.round((b / 255) * 5);

                return ansi;
            };

            convert.ansi16.rgb = function (args) {
                let color = args % 10;

                // Handle greyscale
                if (color === 0 || color === 7) {
                    if (args > 50) {
                        color += 3.5;
                    }

                    color = (color / 10.5) * 255;

                    return [color, color, color];
                }

                const mult = (~~(args > 50) + 1) * 0.5;
                const r = (color & 1) * mult * 255;
                const g = ((color >> 1) & 1) * mult * 255;
                const b = ((color >> 2) & 1) * mult * 255;

                return [r, g, b];
            };

            convert.ansi256.rgb = function (args) {
                // Handle greyscale
                if (args >= 232) {
                    const c = (args - 232) * 10 + 8;
                    return [c, c, c];
                }

                args -= 16;

                let rem;
                const r = (Math.floor(args / 36) / 5) * 255;
                const g = (Math.floor((rem = args % 36) / 6) / 5) * 255;
                const b = ((rem % 6) / 5) * 255;

                return [r, g, b];
            };

            convert.rgb.hex = function (args) {
                const integer =
                    ((Math.round(args[0]) & 0xff) << 16) +
                    ((Math.round(args[1]) & 0xff) << 8) +
                    (Math.round(args[2]) & 0xff);

                const string = integer.toString(16).toUpperCase();
                return '000000'.substring(string.length) + string;
            };

            convert.hex.rgb = function (args) {
                const match = args
                    .toString(16)
                    .match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
                if (!match) {
                    return [0, 0, 0];
                }

                let colorString = match[0];

                if (match[0].length === 3) {
                    colorString = colorString
                        .split('')
                        .map((char) => {
                            return char + char;
                        })
                        .join('');
                }

                const integer = parseInt(colorString, 16);
                const r = (integer >> 16) & 0xff;
                const g = (integer >> 8) & 0xff;
                const b = integer & 0xff;

                return [r, g, b];
            };

            convert.rgb.hcg = function (rgb) {
                const r = rgb[0] / 255;
                const g = rgb[1] / 255;
                const b = rgb[2] / 255;
                const max = Math.max(Math.max(r, g), b);
                const min = Math.min(Math.min(r, g), b);
                const chroma = max - min;
                let grayscale;
                let hue;

                if (chroma < 1) {
                    grayscale = min / (1 - chroma);
                } else {
                    grayscale = 0;
                }

                if (chroma <= 0) {
                    hue = 0;
                } else if (max === r) {
                    hue = ((g - b) / chroma) % 6;
                } else if (max === g) {
                    hue = 2 + (b - r) / chroma;
                } else {
                    hue = 4 + (r - g) / chroma;
                }

                hue /= 6;
                hue %= 1;

                return [hue * 360, chroma * 100, grayscale * 100];
            };

            convert.hsl.hcg = function (hsl) {
                const s = hsl[1] / 100;
                const l = hsl[2] / 100;

                const c = l < 0.5 ? 2.0 * s * l : 2.0 * s * (1.0 - l);

                let f = 0;
                if (c < 1.0) {
                    f = (l - 0.5 * c) / (1.0 - c);
                }

                return [hsl[0], c * 100, f * 100];
            };

            convert.hsv.hcg = function (hsv) {
                const s = hsv[1] / 100;
                const v = hsv[2] / 100;

                const c = s * v;
                let f = 0;

                if (c < 1.0) {
                    f = (v - c) / (1 - c);
                }

                return [hsv[0], c * 100, f * 100];
            };

            convert.hcg.rgb = function (hcg) {
                const h = hcg[0] / 360;
                const c = hcg[1] / 100;
                const g = hcg[2] / 100;

                if (c === 0.0) {
                    return [g * 255, g * 255, g * 255];
                }

                const pure = [0, 0, 0];
                const hi = (h % 1) * 6;
                const v = hi % 1;
                const w = 1 - v;
                let mg = 0;

                /* eslint-disable max-statements-per-line */
                switch (Math.floor(hi)) {
                    case 0:
                        pure[0] = 1;
                        pure[1] = v;
                        pure[2] = 0;
                        break;
                    case 1:
                        pure[0] = w;
                        pure[1] = 1;
                        pure[2] = 0;
                        break;
                    case 2:
                        pure[0] = 0;
                        pure[1] = 1;
                        pure[2] = v;
                        break;
                    case 3:
                        pure[0] = 0;
                        pure[1] = w;
                        pure[2] = 1;
                        break;
                    case 4:
                        pure[0] = v;
                        pure[1] = 0;
                        pure[2] = 1;
                        break;
                    default:
                        pure[0] = 1;
                        pure[1] = 0;
                        pure[2] = w;
                }
                /* eslint-enable max-statements-per-line */

                mg = (1.0 - c) * g;

                return [
                    (c * pure[0] + mg) * 255,
                    (c * pure[1] + mg) * 255,
                    (c * pure[2] + mg) * 255,
                ];
            };

            convert.hcg.hsv = function (hcg) {
                const c = hcg[1] / 100;
                const g = hcg[2] / 100;

                const v = c + g * (1.0 - c);
                let f = 0;

                if (v > 0.0) {
                    f = c / v;
                }

                return [hcg[0], f * 100, v * 100];
            };

            convert.hcg.hsl = function (hcg) {
                const c = hcg[1] / 100;
                const g = hcg[2] / 100;

                const l = g * (1.0 - c) + 0.5 * c;
                let s = 0;

                if (l > 0.0 && l < 0.5) {
                    s = c / (2 * l);
                } else if (l >= 0.5 && l < 1.0) {
                    s = c / (2 * (1 - l));
                }

                return [hcg[0], s * 100, l * 100];
            };

            convert.hcg.hwb = function (hcg) {
                const c = hcg[1] / 100;
                const g = hcg[2] / 100;
                const v = c + g * (1.0 - c);
                return [hcg[0], (v - c) * 100, (1 - v) * 100];
            };

            convert.hwb.hcg = function (hwb) {
                const w = hwb[1] / 100;
                const b = hwb[2] / 100;
                const v = 1 - b;
                const c = v - w;
                let g = 0;

                if (c < 1) {
                    g = (v - c) / (1 - c);
                }

                return [hwb[0], c * 100, g * 100];
            };

            convert.apple.rgb = function (apple) {
                return [
                    (apple[0] / 65535) * 255,
                    (apple[1] / 65535) * 255,
                    (apple[2] / 65535) * 255,
                ];
            };

            convert.rgb.apple = function (rgb) {
                return [
                    (rgb[0] / 255) * 65535,
                    (rgb[1] / 255) * 65535,
                    (rgb[2] / 255) * 65535,
                ];
            };

            convert.gray.rgb = function (args) {
                return [
                    (args[0] / 100) * 255,
                    (args[0] / 100) * 255,
                    (args[0] / 100) * 255,
                ];
            };

            convert.gray.hsl = function (args) {
                return [0, 0, args[0]];
            };

            convert.gray.hsv = convert.gray.hsl;

            convert.gray.hwb = function (gray) {
                return [0, 100, gray[0]];
            };

            convert.gray.cmyk = function (gray) {
                return [0, 0, 0, gray[0]];
            };

            convert.gray.lab = function (gray) {
                return [gray[0], 0, 0];
            };

            convert.gray.hex = function (gray) {
                const val = Math.round((gray[0] / 100) * 255) & 0xff;
                const integer = (val << 16) + (val << 8) + val;

                const string = integer.toString(16).toUpperCase();
                return '000000'.substring(string.length) + string;
            };

            convert.rgb.gray = function (rgb) {
                const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
                return [(val / 255) * 100];
            };

            /***/
        },

        /***/ 605: /***/ function (module) {
            module.exports = require('http');

            /***/
        },

        /***/ 606: /***/ function (module) {
            'use strict';

            const TEMPLATE_REGEX = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
            const STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
            const STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
            const ESCAPE_REGEX = /\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.)|([^\\])/gi;

            const ESCAPES = new Map([
                ['n', '\n'],
                ['r', '\r'],
                ['t', '\t'],
                ['b', '\b'],
                ['f', '\f'],
                ['v', '\v'],
                ['0', '\0'],
                ['\\', '\\'],
                ['e', '\u001B'],
                ['a', '\u0007'],
            ]);

            function unescape(c) {
                const u = c[0] === 'u';
                const bracket = c[1] === '{';

                if (
                    (u && !bracket && c.length === 5) ||
                    (c[0] === 'x' && c.length === 3)
                ) {
                    return String.fromCharCode(parseInt(c.slice(1), 16));
                }

                if (u && bracket) {
                    return String.fromCodePoint(parseInt(c.slice(2, -1), 16));
                }

                return ESCAPES.get(c) || c;
            }

            function parseArguments(name, arguments_) {
                const results = [];
                const chunks = arguments_.trim().split(/\s*,\s*/g);
                let matches;

                for (const chunk of chunks) {
                    const number = Number(chunk);
                    if (!Number.isNaN(number)) {
                        results.push(number);
                    } else if ((matches = chunk.match(STRING_REGEX))) {
                        results.push(
                            matches[2].replace(
                                ESCAPE_REGEX,
                                (m, escape, character) =>
                                    escape ? unescape(escape) : character
                            )
                        );
                    } else {
                        throw new Error(
                            `Invalid Chalk template style argument: ${chunk} (in style '${name}')`
                        );
                    }
                }

                return results;
            }

            function parseStyle(style) {
                STYLE_REGEX.lastIndex = 0;

                const results = [];
                let matches;

                while ((matches = STYLE_REGEX.exec(style)) !== null) {
                    const name = matches[1];

                    if (matches[2]) {
                        const args = parseArguments(name, matches[2]);
                        results.push([name].concat(args));
                    } else {
                        results.push([name]);
                    }
                }

                return results;
            }

            function buildStyle(chalk, styles) {
                const enabled = {};

                for (const layer of styles) {
                    for (const style of layer.styles) {
                        enabled[style[0]] = layer.inverse
                            ? null
                            : style.slice(1);
                    }
                }

                let current = chalk;
                for (const [styleName, styles] of Object.entries(enabled)) {
                    if (!Array.isArray(styles)) {
                        continue;
                    }

                    if (!(styleName in current)) {
                        throw new Error(`Unknown Chalk style: ${styleName}`);
                    }

                    current =
                        styles.length > 0
                            ? current[styleName](...styles)
                            : current[styleName];
                }

                return current;
            }

            module.exports = (chalk, temporary) => {
                const styles = [];
                const chunks = [];
                let chunk = [];

                // eslint-disable-next-line max-params
                temporary.replace(
                    TEMPLATE_REGEX,
                    (m, escapeCharacter, inverse, style, close, character) => {
                        if (escapeCharacter) {
                            chunk.push(unescape(escapeCharacter));
                        } else if (style) {
                            const string = chunk.join('');
                            chunk = [];
                            chunks.push(
                                styles.length === 0
                                    ? string
                                    : buildStyle(chalk, styles)(string)
                            );
                            styles.push({ inverse, styles: parseStyle(style) });
                        } else if (close) {
                            if (styles.length === 0) {
                                throw new Error(
                                    'Found extraneous } in Chalk template literal'
                                );
                            }

                            chunks.push(
                                buildStyle(chalk, styles)(chunk.join(''))
                            );
                            chunk = [];
                            styles.pop();
                        } else {
                            chunk.push(character);
                        }
                    }
                );

                chunks.push(chunk.join(''));

                if (styles.length > 0) {
                    const errMsg = `Chalk template literal is missing ${
                        styles.length
                    } closing bracket${styles.length === 1 ? '' : 's'} (\`}\`)`;
                    throw new Error(errMsg);
                }

                return chunks.join('');
            };

            /***/
        },

        /***/ 614: /***/ function (module) {
            module.exports = require('events');

            /***/
        },

        /***/ 622: /***/ function (module) {
            module.exports = require('path');

            /***/
        },

        /***/ 634: /***/ function (module) {
            module.exports = [
                [0x0300, 0x036f],
                [0x0483, 0x0486],
                [0x0488, 0x0489],
                [0x0591, 0x05bd],
                [0x05bf, 0x05bf],
                [0x05c1, 0x05c2],
                [0x05c4, 0x05c5],
                [0x05c7, 0x05c7],
                [0x0600, 0x0603],
                [0x0610, 0x0615],
                [0x064b, 0x065e],
                [0x0670, 0x0670],
                [0x06d6, 0x06e4],
                [0x06e7, 0x06e8],
                [0x06ea, 0x06ed],
                [0x070f, 0x070f],
                [0x0711, 0x0711],
                [0x0730, 0x074a],
                [0x07a6, 0x07b0],
                [0x07eb, 0x07f3],
                [0x0901, 0x0902],
                [0x093c, 0x093c],
                [0x0941, 0x0948],
                [0x094d, 0x094d],
                [0x0951, 0x0954],
                [0x0962, 0x0963],
                [0x0981, 0x0981],
                [0x09bc, 0x09bc],
                [0x09c1, 0x09c4],
                [0x09cd, 0x09cd],
                [0x09e2, 0x09e3],
                [0x0a01, 0x0a02],
                [0x0a3c, 0x0a3c],
                [0x0a41, 0x0a42],
                [0x0a47, 0x0a48],
                [0x0a4b, 0x0a4d],
                [0x0a70, 0x0a71],
                [0x0a81, 0x0a82],
                [0x0abc, 0x0abc],
                [0x0ac1, 0x0ac5],
                [0x0ac7, 0x0ac8],
                [0x0acd, 0x0acd],
                [0x0ae2, 0x0ae3],
                [0x0b01, 0x0b01],
                [0x0b3c, 0x0b3c],
                [0x0b3f, 0x0b3f],
                [0x0b41, 0x0b43],
                [0x0b4d, 0x0b4d],
                [0x0b56, 0x0b56],
                [0x0b82, 0x0b82],
                [0x0bc0, 0x0bc0],
                [0x0bcd, 0x0bcd],
                [0x0c3e, 0x0c40],
                [0x0c46, 0x0c48],
                [0x0c4a, 0x0c4d],
                [0x0c55, 0x0c56],
                [0x0cbc, 0x0cbc],
                [0x0cbf, 0x0cbf],
                [0x0cc6, 0x0cc6],
                [0x0ccc, 0x0ccd],
                [0x0ce2, 0x0ce3],
                [0x0d41, 0x0d43],
                [0x0d4d, 0x0d4d],
                [0x0dca, 0x0dca],
                [0x0dd2, 0x0dd4],
                [0x0dd6, 0x0dd6],
                [0x0e31, 0x0e31],
                [0x0e34, 0x0e3a],
                [0x0e47, 0x0e4e],
                [0x0eb1, 0x0eb1],
                [0x0eb4, 0x0eb9],
                [0x0ebb, 0x0ebc],
                [0x0ec8, 0x0ecd],
                [0x0f18, 0x0f19],
                [0x0f35, 0x0f35],
                [0x0f37, 0x0f37],
                [0x0f39, 0x0f39],
                [0x0f71, 0x0f7e],
                [0x0f80, 0x0f84],
                [0x0f86, 0x0f87],
                [0x0f90, 0x0f97],
                [0x0f99, 0x0fbc],
                [0x0fc6, 0x0fc6],
                [0x102d, 0x1030],
                [0x1032, 0x1032],
                [0x1036, 0x1037],
                [0x1039, 0x1039],
                [0x1058, 0x1059],
                [0x1160, 0x11ff],
                [0x135f, 0x135f],
                [0x1712, 0x1714],
                [0x1732, 0x1734],
                [0x1752, 0x1753],
                [0x1772, 0x1773],
                [0x17b4, 0x17b5],
                [0x17b7, 0x17bd],
                [0x17c6, 0x17c6],
                [0x17c9, 0x17d3],
                [0x17dd, 0x17dd],
                [0x180b, 0x180d],
                [0x18a9, 0x18a9],
                [0x1920, 0x1922],
                [0x1927, 0x1928],
                [0x1932, 0x1932],
                [0x1939, 0x193b],
                [0x1a17, 0x1a18],
                [0x1b00, 0x1b03],
                [0x1b34, 0x1b34],
                [0x1b36, 0x1b3a],
                [0x1b3c, 0x1b3c],
                [0x1b42, 0x1b42],
                [0x1b6b, 0x1b73],
                [0x1dc0, 0x1dca],
                [0x1dfe, 0x1dff],
                [0x200b, 0x200f],
                [0x202a, 0x202e],
                [0x2060, 0x2063],
                [0x206a, 0x206f],
                [0x20d0, 0x20ef],
                [0x302a, 0x302f],
                [0x3099, 0x309a],
                [0xa806, 0xa806],
                [0xa80b, 0xa80b],
                [0xa825, 0xa826],
                [0xfb1e, 0xfb1e],
                [0xfe00, 0xfe0f],
                [0xfe20, 0xfe23],
                [0xfeff, 0xfeff],
                [0xfff9, 0xfffb],
                [0x10a01, 0x10a03],
                [0x10a05, 0x10a06],
                [0x10a0c, 0x10a0f],
                [0x10a38, 0x10a3a],
                [0x10a3f, 0x10a3f],
                [0x1d167, 0x1d169],
                [0x1d173, 0x1d182],
                [0x1d185, 0x1d18b],
                [0x1d1aa, 0x1d1ad],
                [0x1d242, 0x1d244],
                [0xe0001, 0xe0001],
                [0xe0020, 0xe007f],
                [0xe0100, 0xe01ef],
            ];

            /***/
        },

        /***/ 654: /***/ function (module) {
            // This is not the set of all possible signals.
            //
            // It IS, however, the set of all signals that trigger
            // an exit on either Linux or BSD systems.  Linux is a
            // superset of the signal names supported on BSD, and
            // the unknown signals just fail to register, so we can
            // catch that easily enough.
            //
            // Don't bother with SIGKILL.  It's uncatchable, which
            // means that we can't fire any callbacks anyway.
            //
            // If a user does happen to register a handler on a non-
            // fatal signal like SIGWINCH or something, and then
            // exit, it'll end up firing `process.emit('exit')`, so
            // the handler will be fired anyway.
            //
            // SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
            // artificially, inherently leave the process in a
            // state from which it is not safe to try and enter JS
            // listeners.
            module.exports = [
                'SIGABRT',
                'SIGALRM',
                'SIGHUP',
                'SIGINT',
                'SIGTERM',
            ];

            if (process.platform !== 'win32') {
                module.exports.push(
                    'SIGVTALRM',
                    'SIGXCPU',
                    'SIGXFSZ',
                    'SIGUSR2',
                    'SIGTRAP',
                    'SIGSYS',
                    'SIGQUIT',
                    'SIGIOT'
                    // should detect profiler and enable/disable accordingly.
                    // see #21
                    // 'SIGPROF'
                );
            }

            if (process.platform === 'linux') {
                module.exports.push(
                    'SIGIO',
                    'SIGPOLL',
                    'SIGPWR',
                    'SIGSTKFLT',
                    'SIGUNUSED'
                );
            }

            /***/
        },

        /***/ 663: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            'use strict';
            /* module decorator */ module = __webpack_require__.nmd(module);

            const wrapAnsi16 = (fn, offset) => (...args) => {
                const code = fn(...args);
                return `\u001B[${code + offset}m`;
            };

            const wrapAnsi256 = (fn, offset) => (...args) => {
                const code = fn(...args);
                return `\u001B[${38 + offset};5;${code}m`;
            };

            const wrapAnsi16m = (fn, offset) => (...args) => {
                const rgb = fn(...args);
                return `\u001B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
            };

            const ansi2ansi = (n) => n;
            const rgb2rgb = (r, g, b) => [r, g, b];

            const setLazyProperty = (object, property, get) => {
                Object.defineProperty(object, property, {
                    get: () => {
                        const value = get();

                        Object.defineProperty(object, property, {
                            value,
                            enumerable: true,
                            configurable: true,
                        });

                        return value;
                    },
                    enumerable: true,
                    configurable: true,
                });
            };

            /** @type {typeof import('color-convert')} */
            let colorConvert;
            const makeDynamicStyles = (
                wrap,
                targetSpace,
                identity,
                isBackground
            ) => {
                if (colorConvert === undefined) {
                    colorConvert = __webpack_require__(592);
                }

                const offset = isBackground ? 10 : 0;
                const styles = {};

                for (const [sourceSpace, suite] of Object.entries(
                    colorConvert
                )) {
                    const name =
                        sourceSpace === 'ansi16' ? 'ansi' : sourceSpace;
                    if (sourceSpace === targetSpace) {
                        styles[name] = wrap(identity, offset);
                    } else if (typeof suite === 'object') {
                        styles[name] = wrap(suite[targetSpace], offset);
                    }
                }

                return styles;
            };

            function assembleStyles() {
                const codes = new Map();
                const styles = {
                    modifier: {
                        reset: [0, 0],
                        // 21 isn't widely supported and 22 does the same thing
                        bold: [1, 22],
                        dim: [2, 22],
                        italic: [3, 23],
                        underline: [4, 24],
                        inverse: [7, 27],
                        hidden: [8, 28],
                        strikethrough: [9, 29],
                    },
                    color: {
                        black: [30, 39],
                        red: [31, 39],
                        green: [32, 39],
                        yellow: [33, 39],
                        blue: [34, 39],
                        magenta: [35, 39],
                        cyan: [36, 39],
                        white: [37, 39],

                        // Bright color
                        blackBright: [90, 39],
                        redBright: [91, 39],
                        greenBright: [92, 39],
                        yellowBright: [93, 39],
                        blueBright: [94, 39],
                        magentaBright: [95, 39],
                        cyanBright: [96, 39],
                        whiteBright: [97, 39],
                    },
                    bgColor: {
                        bgBlack: [40, 49],
                        bgRed: [41, 49],
                        bgGreen: [42, 49],
                        bgYellow: [43, 49],
                        bgBlue: [44, 49],
                        bgMagenta: [45, 49],
                        bgCyan: [46, 49],
                        bgWhite: [47, 49],

                        // Bright color
                        bgBlackBright: [100, 49],
                        bgRedBright: [101, 49],
                        bgGreenBright: [102, 49],
                        bgYellowBright: [103, 49],
                        bgBlueBright: [104, 49],
                        bgMagentaBright: [105, 49],
                        bgCyanBright: [106, 49],
                        bgWhiteBright: [107, 49],
                    },
                };

                // Alias bright black as gray (and grey)
                styles.color.gray = styles.color.blackBright;
                styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
                styles.color.grey = styles.color.blackBright;
                styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;

                for (const [groupName, group] of Object.entries(styles)) {
                    for (const [styleName, style] of Object.entries(group)) {
                        styles[styleName] = {
                            open: `\u001B[${style[0]}m`,
                            close: `\u001B[${style[1]}m`,
                        };

                        group[styleName] = styles[styleName];

                        codes.set(style[0], style[1]);
                    }

                    Object.defineProperty(styles, groupName, {
                        value: group,
                        enumerable: false,
                    });
                }

                Object.defineProperty(styles, 'codes', {
                    value: codes,
                    enumerable: false,
                });

                styles.color.close = '\u001B[39m';
                styles.bgColor.close = '\u001B[49m';

                setLazyProperty(styles.color, 'ansi', () =>
                    makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, false)
                );
                setLazyProperty(styles.color, 'ansi256', () =>
                    makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, false)
                );
                setLazyProperty(styles.color, 'ansi16m', () =>
                    makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, false)
                );
                setLazyProperty(styles.bgColor, 'ansi', () =>
                    makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, true)
                );
                setLazyProperty(styles.bgColor, 'ansi256', () =>
                    makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, true)
                );
                setLazyProperty(styles.bgColor, 'ansi16m', () =>
                    makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, true)
                );

                return styles;
            }

            // Make the export immutable
            Object.defineProperty(module, 'exports', {
                enumerable: true,
                get: assembleStyles,
            });

            /***/
        },

        /***/ 668: /***/ function (module) {
            module.exports = {
                dots: {
                    interval: 80,
                    frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
                },
                dots2: {
                    interval: 80,
                    frames: ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'],
                },
                dots3: {
                    interval: 80,
                    frames: ['⠋', '⠙', '⠚', '⠞', '⠖', '⠦', '⠴', '⠲', '⠳', '⠓'],
                },
                dots4: {
                    interval: 80,
                    frames: [
                        '⠄',
                        '⠆',
                        '⠇',
                        '⠋',
                        '⠙',
                        '⠸',
                        '⠰',
                        '⠠',
                        '⠰',
                        '⠸',
                        '⠙',
                        '⠋',
                        '⠇',
                        '⠆',
                    ],
                },
                dots5: {
                    interval: 80,
                    frames: [
                        '⠋',
                        '⠙',
                        '⠚',
                        '⠒',
                        '⠂',
                        '⠂',
                        '⠒',
                        '⠲',
                        '⠴',
                        '⠦',
                        '⠖',
                        '⠒',
                        '⠐',
                        '⠐',
                        '⠒',
                        '⠓',
                        '⠋',
                    ],
                },
                dots6: {
                    interval: 80,
                    frames: [
                        '⠁',
                        '⠉',
                        '⠙',
                        '⠚',
                        '⠒',
                        '⠂',
                        '⠂',
                        '⠒',
                        '⠲',
                        '⠴',
                        '⠤',
                        '⠄',
                        '⠄',
                        '⠤',
                        '⠴',
                        '⠲',
                        '⠒',
                        '⠂',
                        '⠂',
                        '⠒',
                        '⠚',
                        '⠙',
                        '⠉',
                        '⠁',
                    ],
                },
                dots7: {
                    interval: 80,
                    frames: [
                        '⠈',
                        '⠉',
                        '⠋',
                        '⠓',
                        '⠒',
                        '⠐',
                        '⠐',
                        '⠒',
                        '⠖',
                        '⠦',
                        '⠤',
                        '⠠',
                        '⠠',
                        '⠤',
                        '⠦',
                        '⠖',
                        '⠒',
                        '⠐',
                        '⠐',
                        '⠒',
                        '⠓',
                        '⠋',
                        '⠉',
                        '⠈',
                    ],
                },
                dots8: {
                    interval: 80,
                    frames: [
                        '⠁',
                        '⠁',
                        '⠉',
                        '⠙',
                        '⠚',
                        '⠒',
                        '⠂',
                        '⠂',
                        '⠒',
                        '⠲',
                        '⠴',
                        '⠤',
                        '⠄',
                        '⠄',
                        '⠤',
                        '⠠',
                        '⠠',
                        '⠤',
                        '⠦',
                        '⠖',
                        '⠒',
                        '⠐',
                        '⠐',
                        '⠒',
                        '⠓',
                        '⠋',
                        '⠉',
                        '⠈',
                        '⠈',
                    ],
                },
                dots9: {
                    interval: 80,
                    frames: ['⢹', '⢺', '⢼', '⣸', '⣇', '⡧', '⡗', '⡏'],
                },
                dots10: {
                    interval: 80,
                    frames: ['⢄', '⢂', '⢁', '⡁', '⡈', '⡐', '⡠'],
                },
                dots11: {
                    interval: 100,
                    frames: ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈'],
                },
                dots12: {
                    interval: 80,
                    frames: [
                        '⢀⠀',
                        '⡀⠀',
                        '⠄⠀',
                        '⢂⠀',
                        '⡂⠀',
                        '⠅⠀',
                        '⢃⠀',
                        '⡃⠀',
                        '⠍⠀',
                        '⢋⠀',
                        '⡋⠀',
                        '⠍⠁',
                        '⢋⠁',
                        '⡋⠁',
                        '⠍⠉',
                        '⠋⠉',
                        '⠋⠉',
                        '⠉⠙',
                        '⠉⠙',
                        '⠉⠩',
                        '⠈⢙',
                        '⠈⡙',
                        '⢈⠩',
                        '⡀⢙',
                        '⠄⡙',
                        '⢂⠩',
                        '⡂⢘',
                        '⠅⡘',
                        '⢃⠨',
                        '⡃⢐',
                        '⠍⡐',
                        '⢋⠠',
                        '⡋⢀',
                        '⠍⡁',
                        '⢋⠁',
                        '⡋⠁',
                        '⠍⠉',
                        '⠋⠉',
                        '⠋⠉',
                        '⠉⠙',
                        '⠉⠙',
                        '⠉⠩',
                        '⠈⢙',
                        '⠈⡙',
                        '⠈⠩',
                        '⠀⢙',
                        '⠀⡙',
                        '⠀⠩',
                        '⠀⢘',
                        '⠀⡘',
                        '⠀⠨',
                        '⠀⢐',
                        '⠀⡐',
                        '⠀⠠',
                        '⠀⢀',
                        '⠀⡀',
                    ],
                },
                dots8Bit: {
                    interval: 80,
                    frames: [
                        '⠀',
                        '⠁',
                        '⠂',
                        '⠃',
                        '⠄',
                        '⠅',
                        '⠆',
                        '⠇',
                        '⡀',
                        '⡁',
                        '⡂',
                        '⡃',
                        '⡄',
                        '⡅',
                        '⡆',
                        '⡇',
                        '⠈',
                        '⠉',
                        '⠊',
                        '⠋',
                        '⠌',
                        '⠍',
                        '⠎',
                        '⠏',
                        '⡈',
                        '⡉',
                        '⡊',
                        '⡋',
                        '⡌',
                        '⡍',
                        '⡎',
                        '⡏',
                        '⠐',
                        '⠑',
                        '⠒',
                        '⠓',
                        '⠔',
                        '⠕',
                        '⠖',
                        '⠗',
                        '⡐',
                        '⡑',
                        '⡒',
                        '⡓',
                        '⡔',
                        '⡕',
                        '⡖',
                        '⡗',
                        '⠘',
                        '⠙',
                        '⠚',
                        '⠛',
                        '⠜',
                        '⠝',
                        '⠞',
                        '⠟',
                        '⡘',
                        '⡙',
                        '⡚',
                        '⡛',
                        '⡜',
                        '⡝',
                        '⡞',
                        '⡟',
                        '⠠',
                        '⠡',
                        '⠢',
                        '⠣',
                        '⠤',
                        '⠥',
                        '⠦',
                        '⠧',
                        '⡠',
                        '⡡',
                        '⡢',
                        '⡣',
                        '⡤',
                        '⡥',
                        '⡦',
                        '⡧',
                        '⠨',
                        '⠩',
                        '⠪',
                        '⠫',
                        '⠬',
                        '⠭',
                        '⠮',
                        '⠯',
                        '⡨',
                        '⡩',
                        '⡪',
                        '⡫',
                        '⡬',
                        '⡭',
                        '⡮',
                        '⡯',
                        '⠰',
                        '⠱',
                        '⠲',
                        '⠳',
                        '⠴',
                        '⠵',
                        '⠶',
                        '⠷',
                        '⡰',
                        '⡱',
                        '⡲',
                        '⡳',
                        '⡴',
                        '⡵',
                        '⡶',
                        '⡷',
                        '⠸',
                        '⠹',
                        '⠺',
                        '⠻',
                        '⠼',
                        '⠽',
                        '⠾',
                        '⠿',
                        '⡸',
                        '⡹',
                        '⡺',
                        '⡻',
                        '⡼',
                        '⡽',
                        '⡾',
                        '⡿',
                        '⢀',
                        '⢁',
                        '⢂',
                        '⢃',
                        '⢄',
                        '⢅',
                        '⢆',
                        '⢇',
                        '⣀',
                        '⣁',
                        '⣂',
                        '⣃',
                        '⣄',
                        '⣅',
                        '⣆',
                        '⣇',
                        '⢈',
                        '⢉',
                        '⢊',
                        '⢋',
                        '⢌',
                        '⢍',
                        '⢎',
                        '⢏',
                        '⣈',
                        '⣉',
                        '⣊',
                        '⣋',
                        '⣌',
                        '⣍',
                        '⣎',
                        '⣏',
                        '⢐',
                        '⢑',
                        '⢒',
                        '⢓',
                        '⢔',
                        '⢕',
                        '⢖',
                        '⢗',
                        '⣐',
                        '⣑',
                        '⣒',
                        '⣓',
                        '⣔',
                        '⣕',
                        '⣖',
                        '⣗',
                        '⢘',
                        '⢙',
                        '⢚',
                        '⢛',
                        '⢜',
                        '⢝',
                        '⢞',
                        '⢟',
                        '⣘',
                        '⣙',
                        '⣚',
                        '⣛',
                        '⣜',
                        '⣝',
                        '⣞',
                        '⣟',
                        '⢠',
                        '⢡',
                        '⢢',
                        '⢣',
                        '⢤',
                        '⢥',
                        '⢦',
                        '⢧',
                        '⣠',
                        '⣡',
                        '⣢',
                        '⣣',
                        '⣤',
                        '⣥',
                        '⣦',
                        '⣧',
                        '⢨',
                        '⢩',
                        '⢪',
                        '⢫',
                        '⢬',
                        '⢭',
                        '⢮',
                        '⢯',
                        '⣨',
                        '⣩',
                        '⣪',
                        '⣫',
                        '⣬',
                        '⣭',
                        '⣮',
                        '⣯',
                        '⢰',
                        '⢱',
                        '⢲',
                        '⢳',
                        '⢴',
                        '⢵',
                        '⢶',
                        '⢷',
                        '⣰',
                        '⣱',
                        '⣲',
                        '⣳',
                        '⣴',
                        '⣵',
                        '⣶',
                        '⣷',
                        '⢸',
                        '⢹',
                        '⢺',
                        '⢻',
                        '⢼',
                        '⢽',
                        '⢾',
                        '⢿',
                        '⣸',
                        '⣹',
                        '⣺',
                        '⣻',
                        '⣼',
                        '⣽',
                        '⣾',
                        '⣿',
                    ],
                },
                line: { interval: 130, frames: ['-', '\\', '|', '/'] },
                line2: {
                    interval: 100,
                    frames: ['⠂', '-', '–', '—', '–', '-'],
                },
                pipe: {
                    interval: 100,
                    frames: ['┤', '┘', '┴', '└', '├', '┌', '┬', '┐'],
                },
                simpleDots: {
                    interval: 400,
                    frames: ['.  ', '.. ', '...', '   '],
                },
                simpleDotsScrolling: {
                    interval: 200,
                    frames: ['.  ', '.. ', '...', ' ..', '  .', '   '],
                },
                star: { interval: 70, frames: ['✶', '✸', '✹', '✺', '✹', '✷'] },
                star2: { interval: 80, frames: ['+', 'x', '*'] },
                flip: {
                    interval: 70,
                    frames: [
                        '_',
                        '_',
                        '_',
                        '-',
                        '`',
                        '`',
                        "'",
                        '´',
                        '-',
                        '_',
                        '_',
                        '_',
                    ],
                },
                hamburger: { interval: 100, frames: ['☱', '☲', '☴'] },
                growVertical: {
                    interval: 120,
                    frames: ['▁', '▃', '▄', '▅', '▆', '▇', '▆', '▅', '▄', '▃'],
                },
                growHorizontal: {
                    interval: 120,
                    frames: [
                        '▏',
                        '▎',
                        '▍',
                        '▌',
                        '▋',
                        '▊',
                        '▉',
                        '▊',
                        '▋',
                        '▌',
                        '▍',
                        '▎',
                    ],
                },
                balloon: {
                    interval: 140,
                    frames: [' ', '.', 'o', 'O', '@', '*', ' '],
                },
                balloon2: {
                    interval: 120,
                    frames: ['.', 'o', 'O', '°', 'O', 'o', '.'],
                },
                noise: { interval: 100, frames: ['▓', '▒', '░'] },
                bounce: { interval: 120, frames: ['⠁', '⠂', '⠄', '⠂'] },
                boxBounce: { interval: 120, frames: ['▖', '▘', '▝', '▗'] },
                boxBounce2: { interval: 100, frames: ['▌', '▀', '▐', '▄'] },
                triangle: { interval: 50, frames: ['◢', '◣', '◤', '◥'] },
                arc: { interval: 100, frames: ['◜', '◠', '◝', '◞', '◡', '◟'] },
                circle: { interval: 120, frames: ['◡', '⊙', '◠'] },
                squareCorners: { interval: 180, frames: ['◰', '◳', '◲', '◱'] },
                circleQuarters: { interval: 120, frames: ['◴', '◷', '◶', '◵'] },
                circleHalves: { interval: 50, frames: ['◐', '◓', '◑', '◒'] },
                squish: { interval: 100, frames: ['╫', '╪'] },
                toggle: { interval: 250, frames: ['⊶', '⊷'] },
                toggle2: { interval: 80, frames: ['▫', '▪'] },
                toggle3: { interval: 120, frames: ['□', '■'] },
                toggle4: { interval: 100, frames: ['■', '□', '▪', '▫'] },
                toggle5: { interval: 100, frames: ['▮', '▯'] },
                toggle6: { interval: 300, frames: ['ဝ', '၀'] },
                toggle7: { interval: 80, frames: ['⦾', '⦿'] },
                toggle8: { interval: 100, frames: ['◍', '◌'] },
                toggle9: { interval: 100, frames: ['◉', '◎'] },
                toggle10: { interval: 100, frames: ['㊂', '㊀', '㊁'] },
                toggle11: { interval: 50, frames: ['⧇', '⧆'] },
                toggle12: { interval: 120, frames: ['☗', '☖'] },
                toggle13: { interval: 80, frames: ['=', '*', '-'] },
                arrow: {
                    interval: 100,
                    frames: ['←', '↖', '↑', '↗', '→', '↘', '↓', '↙'],
                },
                arrow2: {
                    interval: 80,
                    frames: [
                        '⬆️ ',
                        '↗️ ',
                        '➡️ ',
                        '↘️ ',
                        '⬇️ ',
                        '↙️ ',
                        '⬅️ ',
                        '↖️ ',
                    ],
                },
                arrow3: {
                    interval: 120,
                    frames: [
                        '▹▹▹▹▹',
                        '▸▹▹▹▹',
                        '▹▸▹▹▹',
                        '▹▹▸▹▹',
                        '▹▹▹▸▹',
                        '▹▹▹▹▸',
                    ],
                },
                bouncingBar: {
                    interval: 80,
                    frames: [
                        '[    ]',
                        '[=   ]',
                        '[==  ]',
                        '[=== ]',
                        '[ ===]',
                        '[  ==]',
                        '[   =]',
                        '[    ]',
                        '[   =]',
                        '[  ==]',
                        '[ ===]',
                        '[====]',
                        '[=== ]',
                        '[==  ]',
                        '[=   ]',
                    ],
                },
                bouncingBall: {
                    interval: 80,
                    frames: [
                        '( ●    )',
                        '(  ●   )',
                        '(   ●  )',
                        '(    ● )',
                        '(     ●)',
                        '(    ● )',
                        '(   ●  )',
                        '(  ●   )',
                        '( ●    )',
                        '(●     )',
                    ],
                },
                smiley: { interval: 200, frames: ['😄 ', '😝 '] },
                monkey: { interval: 300, frames: ['🙈 ', '🙈 ', '🙉 ', '🙊 '] },
                hearts: {
                    interval: 100,
                    frames: ['💛 ', '💙 ', '💜 ', '💚 ', '❤️ '],
                },
                clock: {
                    interval: 100,
                    frames: [
                        '🕛 ',
                        '🕐 ',
                        '🕑 ',
                        '🕒 ',
                        '🕓 ',
                        '🕔 ',
                        '🕕 ',
                        '🕖 ',
                        '🕗 ',
                        '🕘 ',
                        '🕙 ',
                        '🕚 ',
                    ],
                },
                earth: { interval: 180, frames: ['🌍 ', '🌎 ', '🌏 '] },
                moon: {
                    interval: 80,
                    frames: [
                        '🌑 ',
                        '🌒 ',
                        '🌓 ',
                        '🌔 ',
                        '🌕 ',
                        '🌖 ',
                        '🌗 ',
                        '🌘 ',
                    ],
                },
                runner: { interval: 140, frames: ['🚶 ', '🏃 '] },
                pong: {
                    interval: 80,
                    frames: [
                        '▐⠂       ▌',
                        '▐⠈       ▌',
                        '▐ ⠂      ▌',
                        '▐ ⠠      ▌',
                        '▐  ⡀     ▌',
                        '▐  ⠠     ▌',
                        '▐   ⠂    ▌',
                        '▐   ⠈    ▌',
                        '▐    ⠂   ▌',
                        '▐    ⠠   ▌',
                        '▐     ⡀  ▌',
                        '▐     ⠠  ▌',
                        '▐      ⠂ ▌',
                        '▐      ⠈ ▌',
                        '▐       ⠂▌',
                        '▐       ⠠▌',
                        '▐       ⡀▌',
                        '▐      ⠠ ▌',
                        '▐      ⠂ ▌',
                        '▐     ⠈  ▌',
                        '▐     ⠂  ▌',
                        '▐    ⠠   ▌',
                        '▐    ⡀   ▌',
                        '▐   ⠠    ▌',
                        '▐   ⠂    ▌',
                        '▐  ⠈     ▌',
                        '▐  ⠂     ▌',
                        '▐ ⠠      ▌',
                        '▐ ⡀      ▌',
                        '▐⠠       ▌',
                    ],
                },
                shark: {
                    interval: 120,
                    frames: [
                        '▐|\\____________▌',
                        '▐_|\\___________▌',
                        '▐__|\\__________▌',
                        '▐___|\\_________▌',
                        '▐____|\\________▌',
                        '▐_____|\\_______▌',
                        '▐______|\\______▌',
                        '▐_______|\\_____▌',
                        '▐________|\\____▌',
                        '▐_________|\\___▌',
                        '▐__________|\\__▌',
                        '▐___________|\\_▌',
                        '▐____________|\\▌',
                        '▐____________/|▌',
                        '▐___________/|_▌',
                        '▐__________/|__▌',
                        '▐_________/|___▌',
                        '▐________/|____▌',
                        '▐_______/|_____▌',
                        '▐______/|______▌',
                        '▐_____/|_______▌',
                        '▐____/|________▌',
                        '▐___/|_________▌',
                        '▐__/|__________▌',
                        '▐_/|___________▌',
                        '▐/|____________▌',
                    ],
                },
                dqpb: { interval: 100, frames: ['d', 'q', 'p', 'b'] },
                weather: {
                    interval: 100,
                    frames: [
                        '☀️ ',
                        '☀️ ',
                        '☀️ ',
                        '🌤 ',
                        '⛅️ ',
                        '🌥 ',
                        '☁️ ',
                        '🌧 ',
                        '🌨 ',
                        '🌧 ',
                        '🌨 ',
                        '🌧 ',
                        '🌨 ',
                        '⛈ ',
                        '🌨 ',
                        '🌧 ',
                        '🌨 ',
                        '☁️ ',
                        '🌥 ',
                        '⛅️ ',
                        '🌤 ',
                        '☀️ ',
                        '☀️ ',
                    ],
                },
                christmas: { interval: 400, frames: ['🌲', '🎄'] },
                grenade: {
                    interval: 80,
                    frames: [
                        '،   ',
                        '′   ',
                        ' ´ ',
                        ' ‾ ',
                        '  ⸌',
                        '  ⸊',
                        '  |',
                        '  ⁎',
                        '  ⁕',
                        ' ෴ ',
                        '  ⁓',
                        '   ',
                        '   ',
                        '   ',
                    ],
                },
                point: {
                    interval: 125,
                    frames: ['∙∙∙', '●∙∙', '∙●∙', '∙∙●', '∙∙∙'],
                },
                layer: { interval: 150, frames: ['-', '=', '≡'] },
                betaWave: {
                    interval: 80,
                    frames: [
                        'ρββββββ',
                        'βρβββββ',
                        'ββρββββ',
                        'βββρβββ',
                        'ββββρββ',
                        'βββββρβ',
                        'ββββββρ',
                    ],
                },
            };

            /***/
        },

        /***/ 723: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            'use strict';

            const mimicFn = __webpack_require__(750);

            const calledFunctions = new WeakMap();

            const oneTime = (fn, options = {}) => {
                if (typeof fn !== 'function') {
                    throw new TypeError('Expected a function');
                }

                let ret;
                let isCalled = false;
                let callCount = 0;
                const functionName = fn.displayName || fn.name || '<anonymous>';

                const onetime = function (...args) {
                    calledFunctions.set(onetime, ++callCount);

                    if (isCalled) {
                        if (options.throw === true) {
                            throw new Error(
                                `Function \`${functionName}\` can only be called once`
                            );
                        }

                        return ret;
                    }

                    isCalled = true;
                    ret = fn.apply(this, args);
                    fn = null;

                    return ret;
                };

                mimicFn(onetime, fn);
                calledFunctions.set(onetime, callCount);

                return onetime;
            };

            module.exports = oneTime;
            // TODO: Remove this for the next major release
            module.exports.default = oneTime;

            module.exports.callCount = (fn) => {
                if (!calledFunctions.has(fn)) {
                    throw new Error(
                        `The given function \`${fn.name}\` is not wrapped by the \`onetime\` package`
                    );
                }

                return calledFunctions.get(fn);
            };

            /***/
        },

        /***/ 727: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            var clone = __webpack_require__(97);

            module.exports = function (options, defaults) {
                options = options || {};

                Object.keys(defaults).forEach(function (key) {
                    if (typeof options[key] === 'undefined') {
                        options[key] = clone(defaults[key]);
                    }
                });

                return options;
            };

            /***/
        },

        /***/ 747: /***/ function (module) {
            module.exports = require('fs');

            /***/
        },

        /***/ 750: /***/ function (module) {
            'use strict';

            const mimicFn = (to, from) => {
                for (const prop of Reflect.ownKeys(from)) {
                    Object.defineProperty(
                        to,
                        prop,
                        Object.getOwnPropertyDescriptor(from, prop)
                    );
                }

                return to;
            };

            module.exports = mimicFn;
            // TODO: Remove this for the next major release
            module.exports.default = mimicFn;

            /***/
        },

        /***/ 754: /***/ function (module) {
            'use strict';

            const stringReplaceAll = (string, substring, replacer) => {
                let index = string.indexOf(substring);
                if (index === -1) {
                    return string;
                }

                const substringLength = substring.length;
                let endIndex = 0;
                let returnValue = '';
                do {
                    returnValue +=
                        string.substr(endIndex, index - endIndex) +
                        substring +
                        replacer;
                    endIndex = index + substringLength;
                    index = string.indexOf(substring, endIndex);
                } while (index !== -1);

                returnValue += string.substr(endIndex);
                return returnValue;
            };

            const stringEncaseCRLFWithFirstIndex = (
                string,
                prefix,
                postfix,
                index
            ) => {
                let endIndex = 0;
                let returnValue = '';
                do {
                    const gotCR = string[index - 1] === '\r';
                    returnValue +=
                        string.substr(
                            endIndex,
                            (gotCR ? index - 1 : index) - endIndex
                        ) +
                        prefix +
                        (gotCR ? '\r\n' : '\n') +
                        postfix;
                    endIndex = index + 1;
                    index = string.indexOf('\n', endIndex);
                } while (index !== -1);

                returnValue += string.substr(endIndex);
                return returnValue;
            };

            module.exports = {
                stringReplaceAll,
                stringEncaseCRLFWithFirstIndex,
            };

            /***/
        },

        /***/ 772: /***/ function (module) {
            'use strict';

            module.exports = (flag, argv) => {
                argv = argv || process.argv;
                const prefix = flag.startsWith('-')
                    ? ''
                    : flag.length === 1
                    ? '-'
                    : '--';
                const pos = argv.indexOf(prefix + flag);
                const terminatorPos = argv.indexOf('--');
                return (
                    pos !== -1 &&
                    (terminatorPos === -1 ? true : pos < terminatorPos)
                );
            };

            /***/
        },

        /***/ 833: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            'use strict';

            var defaults = __webpack_require__(727);
            var combining = __webpack_require__(634);

            var DEFAULTS = {
                nul: 0,
                control: 0,
            };

            module.exports = function wcwidth(str) {
                return wcswidth(str, DEFAULTS);
            };

            module.exports.config = function (opts) {
                opts = defaults(opts || {}, DEFAULTS);
                return function wcwidth(str) {
                    return wcswidth(str, opts);
                };
            };

            /*
             *  The following functions define the column width of an ISO 10646
             *  character as follows:
             *  - The null character (U+0000) has a column width of 0.
             *  - Other C0/C1 control characters and DEL will lead to a return value
             *    of -1.
             *  - Non-spacing and enclosing combining characters (general category
             *    code Mn or Me in the
             *    Unicode database) have a column width of 0.
             *  - SOFT HYPHEN (U+00AD) has a column width of 1.
             *  - Other format characters (general category code Cf in the Unicode
             *    database) and ZERO WIDTH
             *    SPACE (U+200B) have a column width of 0.
             *  - Hangul Jamo medial vowels and final consonants (U+1160-U+11FF)
             *    have a column width of 0.
             *  - Spacing characters in the East Asian Wide (W) or East Asian
             *    Full-width (F) category as
             *    defined in Unicode Technical Report #11 have a column width of 2.
             *  - All remaining characters (including all printable ISO 8859-1 and
             *    WGL4 characters, Unicode control characters, etc.) have a column
             *    width of 1.
             *  This implementation assumes that characters are encoded in ISO 10646.
             */

            function wcswidth(str, opts) {
                if (typeof str !== 'string') return wcwidth(str, opts);

                var s = 0;
                for (var i = 0; i < str.length; i++) {
                    var n = wcwidth(str.charCodeAt(i), opts);
                    if (n < 0) return -1;
                    s += n;
                }

                return s;
            }

            function wcwidth(ucs, opts) {
                // test for 8-bit control characters
                if (ucs === 0) return opts.nul;
                if (ucs < 32 || (ucs >= 0x7f && ucs < 0xa0))
                    return opts.control;

                // binary search in table of non-spacing characters
                if (bisearch(ucs)) return 0;

                // if we arrive here, ucs is not a combining or C0/C1 control character
                return (
                    1 +
                    (ucs >= 0x1100 &&
                        (ucs <= 0x115f || // Hangul Jamo init. consonants
                        ucs == 0x2329 ||
                        ucs == 0x232a ||
                        (ucs >= 0x2e80 && ucs <= 0xa4cf && ucs != 0x303f) || // CJK ... Yi
                        (ucs >= 0xac00 && ucs <= 0xd7a3) || // Hangul Syllables
                        (ucs >= 0xf900 && ucs <= 0xfaff) || // CJK Compatibility Ideographs
                        (ucs >= 0xfe10 && ucs <= 0xfe19) || // Vertical forms
                        (ucs >= 0xfe30 && ucs <= 0xfe6f) || // CJK Compatibility Forms
                        (ucs >= 0xff00 && ucs <= 0xff60) || // Fullwidth Forms
                            (ucs >= 0xffe0 && ucs <= 0xffe6) ||
                            (ucs >= 0x20000 && ucs <= 0x2fffd) ||
                            (ucs >= 0x30000 && ucs <= 0x3fffd)))
                );
            }

            function bisearch(ucs) {
                var min = 0;
                var max = combining.length - 1;
                var mid;

                if (ucs < combining[0][0] || ucs > combining[max][1])
                    return false;

                while (max >= min) {
                    mid = Math.floor((min + max) / 2);
                    if (ucs > combining[mid][1]) min = mid + 1;
                    else if (ucs < combining[mid][0]) max = mid - 1;
                    else return true;
                }

                return false;
            }

            /***/
        },

        /***/ 843: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            'use strict';

            const ansiStyles = __webpack_require__(663);
            const {
                stdout: stdoutColor,
                stderr: stderrColor,
            } = __webpack_require__(247);
            const {
                stringReplaceAll,
                stringEncaseCRLFWithFirstIndex,
            } = __webpack_require__(754);

            // `supportsColor.level` → `ansiStyles.color[name]` mapping
            const levelMapping = ['ansi', 'ansi', 'ansi256', 'ansi16m'];

            const styles = Object.create(null);

            const applyOptions = (object, options = {}) => {
                if (options.level > 3 || options.level < 0) {
                    throw new Error(
                        'The `level` option should be an integer from 0 to 3'
                    );
                }

                // Detect level if not set manually
                const colorLevel = stdoutColor ? stdoutColor.level : 0;
                object.level =
                    options.level === undefined ? colorLevel : options.level;
            };

            class ChalkClass {
                constructor(options) {
                    return chalkFactory(options);
                }
            }

            const chalkFactory = (options) => {
                const chalk = {};
                applyOptions(chalk, options);

                chalk.template = (...arguments_) =>
                    chalkTag(chalk.template, ...arguments_);

                Object.setPrototypeOf(chalk, Chalk.prototype);
                Object.setPrototypeOf(chalk.template, chalk);

                chalk.template.constructor = () => {
                    throw new Error(
                        '`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.'
                    );
                };

                chalk.template.Instance = ChalkClass;

                return chalk.template;
            };

            function Chalk(options) {
                return chalkFactory(options);
            }

            for (const [styleName, style] of Object.entries(ansiStyles)) {
                styles[styleName] = {
                    get() {
                        const builder = createBuilder(
                            this,
                            createStyler(style.open, style.close, this._styler),
                            this._isEmpty
                        );
                        Object.defineProperty(this, styleName, {
                            value: builder,
                        });
                        return builder;
                    },
                };
            }

            styles.visible = {
                get() {
                    const builder = createBuilder(this, this._styler, true);
                    Object.defineProperty(this, 'visible', { value: builder });
                    return builder;
                },
            };

            const usedModels = [
                'rgb',
                'hex',
                'keyword',
                'hsl',
                'hsv',
                'hwb',
                'ansi',
                'ansi256',
            ];

            for (const model of usedModels) {
                styles[model] = {
                    get() {
                        const { level } = this;
                        return function (...arguments_) {
                            const styler = createStyler(
                                ansiStyles.color[levelMapping[level]][model](
                                    ...arguments_
                                ),
                                ansiStyles.color.close,
                                this._styler
                            );
                            return createBuilder(this, styler, this._isEmpty);
                        };
                    },
                };
            }

            for (const model of usedModels) {
                const bgModel = 'bg' + model[0].toUpperCase() + model.slice(1);
                styles[bgModel] = {
                    get() {
                        const { level } = this;
                        return function (...arguments_) {
                            const styler = createStyler(
                                ansiStyles.bgColor[levelMapping[level]][model](
                                    ...arguments_
                                ),
                                ansiStyles.bgColor.close,
                                this._styler
                            );
                            return createBuilder(this, styler, this._isEmpty);
                        };
                    },
                };
            }

            const proto = Object.defineProperties(() => {}, {
                ...styles,
                level: {
                    enumerable: true,
                    get() {
                        return this._generator.level;
                    },
                    set(level) {
                        this._generator.level = level;
                    },
                },
            });

            const createStyler = (open, close, parent) => {
                let openAll;
                let closeAll;
                if (parent === undefined) {
                    openAll = open;
                    closeAll = close;
                } else {
                    openAll = parent.openAll + open;
                    closeAll = close + parent.closeAll;
                }

                return {
                    open,
                    close,
                    openAll,
                    closeAll,
                    parent,
                };
            };

            const createBuilder = (self, _styler, _isEmpty) => {
                const builder = (...arguments_) => {
                    // Single argument is hot path, implicit coercion is faster than anything
                    // eslint-disable-next-line no-implicit-coercion
                    return applyStyle(
                        builder,
                        arguments_.length === 1
                            ? '' + arguments_[0]
                            : arguments_.join(' ')
                    );
                };

                // `__proto__` is used because we must return a function, but there is
                // no way to create a function with a different prototype
                builder.__proto__ = proto; // eslint-disable-line no-proto

                builder._generator = self;
                builder._styler = _styler;
                builder._isEmpty = _isEmpty;

                return builder;
            };

            const applyStyle = (self, string) => {
                if (self.level <= 0 || !string) {
                    return self._isEmpty ? '' : string;
                }

                let styler = self._styler;

                if (styler === undefined) {
                    return string;
                }

                const { openAll, closeAll } = styler;
                if (string.indexOf('\u001B') !== -1) {
                    while (styler !== undefined) {
                        // Replace any instances already present with a re-opening code
                        // otherwise only the part of the string until said closing code
                        // will be colored, and the rest will simply be 'plain'.
                        string = stringReplaceAll(
                            string,
                            styler.close,
                            styler.open
                        );

                        styler = styler.parent;
                    }
                }

                // We can move both next actions out of loop, because remaining actions in loop won't have
                // any/visible effect on parts we add here. Close the styling before a linebreak and reopen
                // after next line to fix a bleed issue on macOS: https://github.com/chalk/chalk/pull/92
                const lfIndex = string.indexOf('\n');
                if (lfIndex !== -1) {
                    string = stringEncaseCRLFWithFirstIndex(
                        string,
                        closeAll,
                        openAll,
                        lfIndex
                    );
                }

                return openAll + string + closeAll;
            };

            let template;
            const chalkTag = (chalk, ...strings) => {
                const [firstString] = strings;

                if (!Array.isArray(firstString)) {
                    // If chalk() was called by itself or with a string,
                    // return the string itself as a string.
                    return strings.join(' ');
                }

                const arguments_ = strings.slice(1);
                const parts = [firstString.raw[0]];

                for (let i = 1; i < firstString.length; i++) {
                    parts.push(
                        String(arguments_[i - 1]).replace(/[{}\\]/g, '\\$&'),
                        String(firstString.raw[i])
                    );
                }

                if (template === undefined) {
                    template = __webpack_require__(606);
                }

                return template(chalk, parts.join(''));
            };

            Object.defineProperties(Chalk.prototype, styles);

            const chalk = Chalk(); // eslint-disable-line new-cap
            chalk.supportsColor = stdoutColor;
            chalk.stderr = Chalk({
                level: stderrColor ? stderrColor.level : 0,
            }); // eslint-disable-line new-cap
            chalk.stderr.supportsColor = stderrColor;

            // For TypeScript
            chalk.Level = {
                None: 0,
                Basic: 1,
                Ansi256: 2,
                TrueColor: 3,
                0: 'None',
                1: 'Basic',
                2: 'Ansi256',
                3: 'TrueColor',
            };

            module.exports = chalk;

            /***/
        },

        /***/ 867: /***/ function (module) {
            module.exports = require('tty');

            /***/
        },

        /***/ 877: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            var conversions = __webpack_require__(345);

            /*
	this function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

            function buildGraph() {
                var graph = {};
                // https://jsperf.com/object-keys-vs-for-in-with-closure/3
                var models = Object.keys(conversions);

                for (var len = models.length, i = 0; i < len; i++) {
                    graph[models[i]] = {
                        // http://jsperf.com/1-vs-infinity
                        // micro-opt, but this is simple.
                        distance: -1,
                        parent: null,
                    };
                }

                return graph;
            }

            // https://en.wikipedia.org/wiki/Breadth-first_search
            function deriveBFS(fromModel) {
                var graph = buildGraph();
                var queue = [fromModel]; // unshift -> queue -> pop

                graph[fromModel].distance = 0;

                while (queue.length) {
                    var current = queue.pop();
                    var adjacents = Object.keys(conversions[current]);

                    for (var len = adjacents.length, i = 0; i < len; i++) {
                        var adjacent = adjacents[i];
                        var node = graph[adjacent];

                        if (node.distance === -1) {
                            node.distance = graph[current].distance + 1;
                            node.parent = current;
                            queue.unshift(adjacent);
                        }
                    }
                }

                return graph;
            }

            function link(from, to) {
                return function (args) {
                    return to(from(args));
                };
            }

            function wrapConversion(toModel, graph) {
                var path = [graph[toModel].parent, toModel];
                var fn = conversions[graph[toModel].parent][toModel];

                var cur = graph[toModel].parent;
                while (graph[cur].parent) {
                    path.unshift(graph[cur].parent);
                    fn = link(conversions[graph[cur].parent][cur], fn);
                    cur = graph[cur].parent;
                }

                fn.conversion = path;
                return fn;
            }

            module.exports = function (fromModel) {
                var graph = deriveBFS(fromModel);
                var conversion = {};

                var models = Object.keys(graph);
                for (var len = models.length, i = 0; i < len; i++) {
                    var toModel = models[i];
                    var node = graph[toModel];

                    if (node.parent === null) {
                        // no possible conversion, or this node is the source model.
                        continue;
                    }

                    conversion[toModel] = wrapConversion(toModel, graph);
                }

                return conversion;
            };

            /***/
        },

        /***/ 885: /***/ function (module) {
            'use strict';

            module.exports = {
                aliceblue: [240, 248, 255],
                antiquewhite: [250, 235, 215],
                aqua: [0, 255, 255],
                aquamarine: [127, 255, 212],
                azure: [240, 255, 255],
                beige: [245, 245, 220],
                bisque: [255, 228, 196],
                black: [0, 0, 0],
                blanchedalmond: [255, 235, 205],
                blue: [0, 0, 255],
                blueviolet: [138, 43, 226],
                brown: [165, 42, 42],
                burlywood: [222, 184, 135],
                cadetblue: [95, 158, 160],
                chartreuse: [127, 255, 0],
                chocolate: [210, 105, 30],
                coral: [255, 127, 80],
                cornflowerblue: [100, 149, 237],
                cornsilk: [255, 248, 220],
                crimson: [220, 20, 60],
                cyan: [0, 255, 255],
                darkblue: [0, 0, 139],
                darkcyan: [0, 139, 139],
                darkgoldenrod: [184, 134, 11],
                darkgray: [169, 169, 169],
                darkgreen: [0, 100, 0],
                darkgrey: [169, 169, 169],
                darkkhaki: [189, 183, 107],
                darkmagenta: [139, 0, 139],
                darkolivegreen: [85, 107, 47],
                darkorange: [255, 140, 0],
                darkorchid: [153, 50, 204],
                darkred: [139, 0, 0],
                darksalmon: [233, 150, 122],
                darkseagreen: [143, 188, 143],
                darkslateblue: [72, 61, 139],
                darkslategray: [47, 79, 79],
                darkslategrey: [47, 79, 79],
                darkturquoise: [0, 206, 209],
                darkviolet: [148, 0, 211],
                deeppink: [255, 20, 147],
                deepskyblue: [0, 191, 255],
                dimgray: [105, 105, 105],
                dimgrey: [105, 105, 105],
                dodgerblue: [30, 144, 255],
                firebrick: [178, 34, 34],
                floralwhite: [255, 250, 240],
                forestgreen: [34, 139, 34],
                fuchsia: [255, 0, 255],
                gainsboro: [220, 220, 220],
                ghostwhite: [248, 248, 255],
                gold: [255, 215, 0],
                goldenrod: [218, 165, 32],
                gray: [128, 128, 128],
                green: [0, 128, 0],
                greenyellow: [173, 255, 47],
                grey: [128, 128, 128],
                honeydew: [240, 255, 240],
                hotpink: [255, 105, 180],
                indianred: [205, 92, 92],
                indigo: [75, 0, 130],
                ivory: [255, 255, 240],
                khaki: [240, 230, 140],
                lavender: [230, 230, 250],
                lavenderblush: [255, 240, 245],
                lawngreen: [124, 252, 0],
                lemonchiffon: [255, 250, 205],
                lightblue: [173, 216, 230],
                lightcoral: [240, 128, 128],
                lightcyan: [224, 255, 255],
                lightgoldenrodyellow: [250, 250, 210],
                lightgray: [211, 211, 211],
                lightgreen: [144, 238, 144],
                lightgrey: [211, 211, 211],
                lightpink: [255, 182, 193],
                lightsalmon: [255, 160, 122],
                lightseagreen: [32, 178, 170],
                lightskyblue: [135, 206, 250],
                lightslategray: [119, 136, 153],
                lightslategrey: [119, 136, 153],
                lightsteelblue: [176, 196, 222],
                lightyellow: [255, 255, 224],
                lime: [0, 255, 0],
                limegreen: [50, 205, 50],
                linen: [250, 240, 230],
                magenta: [255, 0, 255],
                maroon: [128, 0, 0],
                mediumaquamarine: [102, 205, 170],
                mediumblue: [0, 0, 205],
                mediumorchid: [186, 85, 211],
                mediumpurple: [147, 112, 219],
                mediumseagreen: [60, 179, 113],
                mediumslateblue: [123, 104, 238],
                mediumspringgreen: [0, 250, 154],
                mediumturquoise: [72, 209, 204],
                mediumvioletred: [199, 21, 133],
                midnightblue: [25, 25, 112],
                mintcream: [245, 255, 250],
                mistyrose: [255, 228, 225],
                moccasin: [255, 228, 181],
                navajowhite: [255, 222, 173],
                navy: [0, 0, 128],
                oldlace: [253, 245, 230],
                olive: [128, 128, 0],
                olivedrab: [107, 142, 35],
                orange: [255, 165, 0],
                orangered: [255, 69, 0],
                orchid: [218, 112, 214],
                palegoldenrod: [238, 232, 170],
                palegreen: [152, 251, 152],
                paleturquoise: [175, 238, 238],
                palevioletred: [219, 112, 147],
                papayawhip: [255, 239, 213],
                peachpuff: [255, 218, 185],
                peru: [205, 133, 63],
                pink: [255, 192, 203],
                plum: [221, 160, 221],
                powderblue: [176, 224, 230],
                purple: [128, 0, 128],
                rebeccapurple: [102, 51, 153],
                red: [255, 0, 0],
                rosybrown: [188, 143, 143],
                royalblue: [65, 105, 225],
                saddlebrown: [139, 69, 19],
                salmon: [250, 128, 114],
                sandybrown: [244, 164, 96],
                seagreen: [46, 139, 87],
                seashell: [255, 245, 238],
                sienna: [160, 82, 45],
                silver: [192, 192, 192],
                skyblue: [135, 206, 235],
                slateblue: [106, 90, 205],
                slategray: [112, 128, 144],
                slategrey: [112, 128, 144],
                snow: [255, 250, 250],
                springgreen: [0, 255, 127],
                steelblue: [70, 130, 180],
                tan: [210, 180, 140],
                teal: [0, 128, 128],
                thistle: [216, 191, 216],
                tomato: [255, 99, 71],
                turquoise: [64, 224, 208],
                violet: [238, 130, 238],
                wheat: [245, 222, 179],
                white: [255, 255, 255],
                whitesmoke: [245, 245, 245],
                yellow: [255, 255, 0],
                yellowgreen: [154, 205, 50],
            };

            /***/
        },

        /***/ 894: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            'use strict';
            /* module decorator */ module = __webpack_require__.nmd(module);

            const colorConvert = __webpack_require__(586);

            const wrapAnsi16 = (fn, offset) =>
                function () {
                    const code = fn.apply(colorConvert, arguments);
                    return `\u001B[${code + offset}m`;
                };

            const wrapAnsi256 = (fn, offset) =>
                function () {
                    const code = fn.apply(colorConvert, arguments);
                    return `\u001B[${38 + offset};5;${code}m`;
                };

            const wrapAnsi16m = (fn, offset) =>
                function () {
                    const rgb = fn.apply(colorConvert, arguments);
                    return `\u001B[${38 + offset};2;${rgb[0]};${rgb[1]};${
                        rgb[2]
                    }m`;
                };

            function assembleStyles() {
                const codes = new Map();
                const styles = {
                    modifier: {
                        reset: [0, 0],
                        // 21 isn't widely supported and 22 does the same thing
                        bold: [1, 22],
                        dim: [2, 22],
                        italic: [3, 23],
                        underline: [4, 24],
                        inverse: [7, 27],
                        hidden: [8, 28],
                        strikethrough: [9, 29],
                    },
                    color: {
                        black: [30, 39],
                        red: [31, 39],
                        green: [32, 39],
                        yellow: [33, 39],
                        blue: [34, 39],
                        magenta: [35, 39],
                        cyan: [36, 39],
                        white: [37, 39],
                        gray: [90, 39],

                        // Bright color
                        redBright: [91, 39],
                        greenBright: [92, 39],
                        yellowBright: [93, 39],
                        blueBright: [94, 39],
                        magentaBright: [95, 39],
                        cyanBright: [96, 39],
                        whiteBright: [97, 39],
                    },
                    bgColor: {
                        bgBlack: [40, 49],
                        bgRed: [41, 49],
                        bgGreen: [42, 49],
                        bgYellow: [43, 49],
                        bgBlue: [44, 49],
                        bgMagenta: [45, 49],
                        bgCyan: [46, 49],
                        bgWhite: [47, 49],

                        // Bright color
                        bgBlackBright: [100, 49],
                        bgRedBright: [101, 49],
                        bgGreenBright: [102, 49],
                        bgYellowBright: [103, 49],
                        bgBlueBright: [104, 49],
                        bgMagentaBright: [105, 49],
                        bgCyanBright: [106, 49],
                        bgWhiteBright: [107, 49],
                    },
                };

                // Fix humans
                styles.color.grey = styles.color.gray;

                for (const groupName of Object.keys(styles)) {
                    const group = styles[groupName];

                    for (const styleName of Object.keys(group)) {
                        const style = group[styleName];

                        styles[styleName] = {
                            open: `\u001B[${style[0]}m`,
                            close: `\u001B[${style[1]}m`,
                        };

                        group[styleName] = styles[styleName];

                        codes.set(style[0], style[1]);
                    }

                    Object.defineProperty(styles, groupName, {
                        value: group,
                        enumerable: false,
                    });

                    Object.defineProperty(styles, 'codes', {
                        value: codes,
                        enumerable: false,
                    });
                }

                const ansi2ansi = (n) => n;
                const rgb2rgb = (r, g, b) => [r, g, b];

                styles.color.close = '\u001B[39m';
                styles.bgColor.close = '\u001B[49m';

                styles.color.ansi = {
                    ansi: wrapAnsi16(ansi2ansi, 0),
                };
                styles.color.ansi256 = {
                    ansi256: wrapAnsi256(ansi2ansi, 0),
                };
                styles.color.ansi16m = {
                    rgb: wrapAnsi16m(rgb2rgb, 0),
                };

                styles.bgColor.ansi = {
                    ansi: wrapAnsi16(ansi2ansi, 10),
                };
                styles.bgColor.ansi256 = {
                    ansi256: wrapAnsi256(ansi2ansi, 10),
                };
                styles.bgColor.ansi16m = {
                    rgb: wrapAnsi16m(rgb2rgb, 10),
                };

                for (let key of Object.keys(colorConvert)) {
                    if (typeof colorConvert[key] !== 'object') {
                        continue;
                    }

                    const suite = colorConvert[key];

                    if (key === 'ansi16') {
                        key = 'ansi';
                    }

                    if ('ansi16' in suite) {
                        styles.color.ansi[key] = wrapAnsi16(suite.ansi16, 0);
                        styles.bgColor.ansi[key] = wrapAnsi16(suite.ansi16, 10);
                    }

                    if ('ansi256' in suite) {
                        styles.color.ansi256[key] = wrapAnsi256(
                            suite.ansi256,
                            0
                        );
                        styles.bgColor.ansi256[key] = wrapAnsi256(
                            suite.ansi256,
                            10
                        );
                    }

                    if ('rgb' in suite) {
                        styles.color.ansi16m[key] = wrapAnsi16m(suite.rgb, 0);
                        styles.bgColor.ansi16m[key] = wrapAnsi16m(
                            suite.rgb,
                            10
                        );
                    }
                }

                return styles;
            }

            // Make the export immutable
            Object.defineProperty(module, 'exports', {
                enumerable: true,
                get: assembleStyles,
            });

            /***/
        },

        /***/ 917: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            const fs = __webpack_require__(747);
            const createRouteDir = __webpack_require__(104);
            const path = __webpack_require__(622);

            module.exports = async () => {
                try {
                    const routeDir = await createRouteDir();

                    return new Promise((resolve, reject) => {
                        fs.readFile(
                            path.join(routeDir, 'routes.json'),
                            (err, data) => {
                                if (err) reject(err);
                                resolve(
                                    JSON.parse(Buffer.from(data).toString())
                                );
                            }
                        );
                    });
                } catch (err) {
                    console.error(err);
                    throw err;
                }
            };

            /***/
        },

        /***/ 927: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            'use strict';

            const os = __webpack_require__(87);
            const hasFlag = __webpack_require__(772);

            const env = process.env;

            let forceColor;
            if (
                hasFlag('no-color') ||
                hasFlag('no-colors') ||
                hasFlag('color=false')
            ) {
                forceColor = false;
            } else if (
                hasFlag('color') ||
                hasFlag('colors') ||
                hasFlag('color=true') ||
                hasFlag('color=always')
            ) {
                forceColor = true;
            }
            if ('FORCE_COLOR' in env) {
                forceColor =
                    env.FORCE_COLOR.length === 0 ||
                    parseInt(env.FORCE_COLOR, 10) !== 0;
            }

            function translateLevel(level) {
                if (level === 0) {
                    return false;
                }

                return {
                    level,
                    hasBasic: true,
                    has256: level >= 2,
                    has16m: level >= 3,
                };
            }

            function supportsColor(stream) {
                if (forceColor === false) {
                    return 0;
                }

                if (
                    hasFlag('color=16m') ||
                    hasFlag('color=full') ||
                    hasFlag('color=truecolor')
                ) {
                    return 3;
                }

                if (hasFlag('color=256')) {
                    return 2;
                }

                if (stream && !stream.isTTY && forceColor !== true) {
                    return 0;
                }

                const min = forceColor ? 1 : 0;

                if (process.platform === 'win32') {
                    // Node.js 7.5.0 is the first version of Node.js to include a patch to
                    // libuv that enables 256 color output on Windows. Anything earlier and it
                    // won't work. However, here we target Node.js 8 at minimum as it is an LTS
                    // release, and Node.js 7 is not. Windows 10 build 10586 is the first Windows
                    // release that supports 256 colors. Windows 10 build 14931 is the first release
                    // that supports 16m/TrueColor.
                    const osRelease = os.release().split('.');
                    if (
                        Number(process.versions.node.split('.')[0]) >= 8 &&
                        Number(osRelease[0]) >= 10 &&
                        Number(osRelease[2]) >= 10586
                    ) {
                        return Number(osRelease[2]) >= 14931 ? 3 : 2;
                    }

                    return 1;
                }

                if ('CI' in env) {
                    if (
                        ['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(
                            (sign) => sign in env
                        ) ||
                        env.CI_NAME === 'codeship'
                    ) {
                        return 1;
                    }

                    return min;
                }

                if ('TEAMCITY_VERSION' in env) {
                    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(
                        env.TEAMCITY_VERSION
                    )
                        ? 1
                        : 0;
                }

                if (env.COLORTERM === 'truecolor') {
                    return 3;
                }

                if ('TERM_PROGRAM' in env) {
                    const version = parseInt(
                        (env.TERM_PROGRAM_VERSION || '').split('.')[0],
                        10
                    );

                    switch (env.TERM_PROGRAM) {
                        case 'iTerm.app':
                            return version >= 3 ? 3 : 2;
                        case 'Apple_Terminal':
                            return 2;
                        // No default
                    }
                }

                if (/-256(color)?$/i.test(env.TERM)) {
                    return 2;
                }

                if (
                    /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(
                        env.TERM
                    )
                ) {
                    return 1;
                }

                if ('COLORTERM' in env) {
                    return 1;
                }

                if (env.TERM === 'dumb') {
                    return min;
                }

                return min;
            }

            function getSupportLevel(stream) {
                const level = supportsColor(stream);
                return translateLevel(level);
            }

            module.exports = {
                supportsColor: getSupportLevel,
                stdout: getSupportLevel(process.stdout),
                stderr: getSupportLevel(process.stderr),
            };

            /***/
        },

        /***/ 937: /***/ function (
            module,
            __unusedexports,
            __webpack_require__
        ) {
            'use strict';

            const readline = __webpack_require__(58);
            const chalk = __webpack_require__(843);
            const cliCursor = __webpack_require__(275);
            const cliSpinners = __webpack_require__(403);
            const logSymbols = __webpack_require__(598);
            const stripAnsi = __webpack_require__(90);
            const wcwidth = __webpack_require__(833);
            const isInteractive = __webpack_require__(179);
            const MuteStream = __webpack_require__(118);

            const TEXT = Symbol('text');
            const PREFIX_TEXT = Symbol('prefixText');

            const ASCII_ETX_CODE = 0x03; // Ctrl+C emits this code

            class StdinDiscarder {
                constructor() {
                    this.requests = 0;

                    this.mutedStream = new MuteStream();
                    this.mutedStream.pipe(process.stdout);
                    this.mutedStream.mute();

                    const self = this;
                    this.ourEmit = function (event, data, ...args) {
                        const { stdin } = process;
                        if (self.requests > 0 || stdin.emit === self.ourEmit) {
                            if (event === 'keypress') {
                                // Fixes readline behavior
                                return;
                            }

                            if (
                                event === 'data' &&
                                data.includes(ASCII_ETX_CODE)
                            ) {
                                process.emit('SIGINT');
                            }

                            Reflect.apply(self.oldEmit, this, [
                                event,
                                data,
                                ...args,
                            ]);
                        } else {
                            Reflect.apply(process.stdin.emit, this, [
                                event,
                                data,
                                ...args,
                            ]);
                        }
                    };
                }

                start() {
                    this.requests++;

                    if (this.requests === 1) {
                        this.realStart();
                    }
                }

                stop() {
                    if (this.requests <= 0) {
                        throw new Error(
                            '`stop` called more times than `start`'
                        );
                    }

                    this.requests--;

                    if (this.requests === 0) {
                        this.realStop();
                    }
                }

                realStart() {
                    // No known way to make it work reliably on Windows
                    if (process.platform === 'win32') {
                        return;
                    }

                    this.rl = readline.createInterface({
                        input: process.stdin,
                        output: this.mutedStream,
                    });

                    this.rl.on('SIGINT', () => {
                        if (process.listenerCount('SIGINT') === 0) {
                            process.emit('SIGINT');
                        } else {
                            this.rl.close();
                            process.kill(process.pid, 'SIGINT');
                        }
                    });
                }

                realStop() {
                    if (process.platform === 'win32') {
                        return;
                    }

                    this.rl.close();
                    this.rl = undefined;
                }
            }

            const stdinDiscarder = new StdinDiscarder();

            class Ora {
                constructor(options) {
                    if (typeof options === 'string') {
                        options = {
                            text: options,
                        };
                    }

                    this.options = {
                        text: '',
                        color: 'cyan',
                        stream: process.stderr,
                        discardStdin: true,
                        ...options,
                    };

                    this.spinner = this.options.spinner;

                    this.color = this.options.color;
                    this.hideCursor = this.options.hideCursor !== false;
                    this.interval =
                        this.options.interval || this.spinner.interval || 100;
                    this.stream = this.options.stream;
                    this.id = undefined;
                    this.isEnabled =
                        typeof this.options.isEnabled === 'boolean'
                            ? this.options.isEnabled
                            : isInteractive({ stream: this.stream });

                    // Set *after* `this.stream`
                    this.text = this.options.text;
                    this.prefixText = this.options.prefixText;
                    this.linesToClear = 0;
                    this.indent = this.options.indent;
                    this.discardStdin = this.options.discardStdin;
                    this.isDiscardingStdin = false;
                }

                get indent() {
                    return this._indent;
                }

                set indent(indent = 0) {
                    if (!(indent >= 0 && Number.isInteger(indent))) {
                        throw new Error(
                            'The `indent` option must be an integer from 0 and up'
                        );
                    }

                    this._indent = indent;
                }

                _updateInterval(interval) {
                    if (interval !== undefined) {
                        this.interval = interval;
                    }
                }

                get spinner() {
                    return this._spinner;
                }

                set spinner(spinner) {
                    this.frameIndex = 0;

                    if (typeof spinner === 'object') {
                        if (spinner.frames === undefined) {
                            throw new Error(
                                'The given spinner must have a `frames` property'
                            );
                        }

                        this._spinner = spinner;
                    } else if (process.platform === 'win32') {
                        this._spinner = cliSpinners.line;
                    } else if (spinner === undefined) {
                        // Set default spinner
                        this._spinner = cliSpinners.dots;
                    } else if (cliSpinners[spinner]) {
                        this._spinner = cliSpinners[spinner];
                    } else {
                        throw new Error(
                            `There is no built-in spinner named '${spinner}'. See https://github.com/sindresorhus/cli-spinners/blob/master/spinners.json for a full list.`
                        );
                    }

                    this._updateInterval(this._spinner.interval);
                }

                get text() {
                    return this[TEXT];
                }

                get prefixText() {
                    return this[PREFIX_TEXT];
                }

                get isSpinning() {
                    return this.id !== undefined;
                }

                updateLineCount() {
                    const columns = this.stream.columns || 80;
                    const fullPrefixText =
                        typeof this[PREFIX_TEXT] === 'string'
                            ? this[PREFIX_TEXT] + '-'
                            : '';
                    this.lineCount = stripAnsi(
                        fullPrefixText + '--' + this[TEXT]
                    )
                        .split('\n')
                        .reduce((count, line) => {
                            return (
                                count +
                                Math.max(1, Math.ceil(wcwidth(line) / columns))
                            );
                        }, 0);
                }

                set text(value) {
                    this[TEXT] = value;
                    this.updateLineCount();
                }

                set prefixText(value) {
                    this[PREFIX_TEXT] = value;
                    this.updateLineCount();
                }

                frame() {
                    const { frames } = this.spinner;
                    let frame = frames[this.frameIndex];

                    if (this.color) {
                        frame = chalk[this.color](frame);
                    }

                    this.frameIndex = ++this.frameIndex % frames.length;
                    const fullPrefixText =
                        typeof this.prefixText === 'string' &&
                        this.prefixText !== ''
                            ? this.prefixText + ' '
                            : '';
                    const fullText =
                        typeof this.text === 'string' ? ' ' + this.text : '';

                    return fullPrefixText + frame + fullText;
                }

                clear() {
                    if (!this.isEnabled || !this.stream.isTTY) {
                        return this;
                    }

                    for (let i = 0; i < this.linesToClear; i++) {
                        if (i > 0) {
                            this.stream.moveCursor(0, -1);
                        }

                        this.stream.clearLine();
                        this.stream.cursorTo(this.indent);
                    }

                    this.linesToClear = 0;

                    return this;
                }

                render() {
                    this.clear();
                    this.stream.write(this.frame());
                    this.linesToClear = this.lineCount;

                    return this;
                }

                start(text) {
                    if (text) {
                        this.text = text;
                    }

                    if (!this.isEnabled) {
                        if (this.text) {
                            this.stream.write(`- ${this.text}\n`);
                        }

                        return this;
                    }

                    if (this.isSpinning) {
                        return this;
                    }

                    if (this.hideCursor) {
                        cliCursor.hide(this.stream);
                    }

                    if (this.discardStdin && process.stdin.isTTY) {
                        this.isDiscardingStdin = true;
                        stdinDiscarder.start();
                    }

                    this.render();
                    this.id = setInterval(
                        this.render.bind(this),
                        this.interval
                    );

                    return this;
                }

                stop() {
                    if (!this.isEnabled) {
                        return this;
                    }

                    clearInterval(this.id);
                    this.id = undefined;
                    this.frameIndex = 0;
                    this.clear();
                    if (this.hideCursor) {
                        cliCursor.show(this.stream);
                    }

                    if (
                        this.discardStdin &&
                        process.stdin.isTTY &&
                        this.isDiscardingStdin
                    ) {
                        stdinDiscarder.stop();
                        this.isDiscardingStdin = false;
                    }

                    return this;
                }

                succeed(text) {
                    return this.stopAndPersist({
                        symbol: logSymbols.success,
                        text,
                    });
                }

                fail(text) {
                    return this.stopAndPersist({
                        symbol: logSymbols.error,
                        text,
                    });
                }

                warn(text) {
                    return this.stopAndPersist({
                        symbol: logSymbols.warning,
                        text,
                    });
                }

                info(text) {
                    return this.stopAndPersist({
                        symbol: logSymbols.info,
                        text,
                    });
                }

                stopAndPersist(options = {}) {
                    const prefixText = options.prefixText || this.prefixText;
                    const fullPrefixText =
                        typeof prefixText === 'string' && prefixText !== ''
                            ? prefixText + ' '
                            : '';
                    const text = options.text || this.text;
                    const fullText = typeof text === 'string' ? ' ' + text : '';

                    this.stop();
                    this.stream.write(
                        `${fullPrefixText}${options.symbol || ' '}${fullText}\n`
                    );

                    return this;
                }
            }

            const oraFactory = function (options) {
                return new Ora(options);
            };

            module.exports = oraFactory;

            module.exports.promise = (action, options) => {
                // eslint-disable-next-line promise/prefer-await-to-then
                if (typeof action.then !== 'function') {
                    throw new TypeError('Parameter `action` must be a Promise');
                }

                const spinner = new Ora(options);
                spinner.start();

                (async () => {
                    try {
                        await action;
                        spinner.succeed();
                    } catch (_) {
                        spinner.fail();
                    }
                })();

                return spinner;
            };

            /***/
        },

        /***/ 964: /***/ function (
            __unusedmodule,
            __unusedexports,
            __webpack_require__
        ) {
            const microServer = __webpack_require__(544);
            const setupRoutes = __webpack_require__(116);
            const http = __webpack_require__(605);
            const PORT = process.env.PORT || 3000;

            setupRoutes();

            http.createServer((req, res) => {
                microServer(req, res);
            }).listen(PORT, () => {
                console.log('> Listening on ' + PORT);
            });

            /***/
        },

        /***/ 973: /***/ function (module) {
            module.exports = () => {
                const currPath = `${process.cwd()}`;
                return currPath;
            };

            /***/
        },

        /******/
    },
    /******/ function (__webpack_require__) {
        // webpackRuntimeModules
        /******/ 'use strict' /* webpack/runtime/node module decorator */;
        /******/

        /******/ /******/ !(function () {
            /******/ __webpack_require__.nmd = function (module) {
                /******/ module.paths = [];
                /******/ if (!module.children) module.children = [];
                /******/ Object.defineProperty(module, 'loaded', {
                    /******/ enumerable: true,
                    /******/ get: function () {
                        return module.l;
                    },
                    /******/
                });
                /******/ Object.defineProperty(module, 'id', {
                    /******/ enumerable: true,
                    /******/ get: function () {
                        return module.i;
                    },
                    /******/
                });
                /******/ return module;
                /******/
            };
            /******/
        })();
        /******/
        /******/
    }
);