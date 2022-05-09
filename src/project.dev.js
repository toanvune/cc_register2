window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  1: [ function(require, module, exports) {
    function EventEmitter() {
      this._events = this._events || {};
      this._maxListeners = this._maxListeners || void 0;
    }
    module.exports = EventEmitter;
    EventEmitter.EventEmitter = EventEmitter;
    EventEmitter.prototype._events = void 0;
    EventEmitter.prototype._maxListeners = void 0;
    EventEmitter.defaultMaxListeners = 10;
    EventEmitter.prototype.setMaxListeners = function(n) {
      if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError("n must be a positive number");
      this._maxListeners = n;
      return this;
    };
    EventEmitter.prototype.emit = function(type) {
      var er, handler, len, args, i, listeners;
      this._events || (this._events = {});
      if ("error" === type && (!this._events.error || isObject(this._events.error) && !this._events.error.length)) {
        er = arguments[1];
        if (er instanceof Error) throw er;
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ")");
        err.context = er;
        throw err;
      }
      handler = this._events[type];
      if (isUndefined(handler)) return false;
      if (isFunction(handler)) switch (arguments.length) {
       case 1:
        handler.call(this);
        break;

       case 2:
        handler.call(this, arguments[1]);
        break;

       case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;

       default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
      } else if (isObject(handler)) {
        args = Array.prototype.slice.call(arguments, 1);
        listeners = handler.slice();
        len = listeners.length;
        for (i = 0; i < len; i++) listeners[i].apply(this, args);
      }
      return true;
    };
    EventEmitter.prototype.addListener = function(type, listener) {
      var m;
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      this._events || (this._events = {});
      this._events.newListener && this.emit("newListener", type, isFunction(listener.listener) ? listener.listener : listener);
      this._events[type] ? isObject(this._events[type]) ? this._events[type].push(listener) : this._events[type] = [ this._events[type], listener ] : this._events[type] = listener;
      if (isObject(this._events[type]) && !this._events[type].warned) {
        m = isUndefined(this._maxListeners) ? EventEmitter.defaultMaxListeners : this._maxListeners;
        if (m && m > 0 && this._events[type].length > m) {
          this._events[type].warned = true;
          console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[type].length);
          "function" === typeof console.trace && console.trace();
        }
      }
      return this;
    };
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    EventEmitter.prototype.once = function(type, listener) {
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      var fired = false;
      function g() {
        this.removeListener(type, g);
        if (!fired) {
          fired = true;
          listener.apply(this, arguments);
        }
      }
      g.listener = listener;
      this.on(type, g);
      return this;
    };
    EventEmitter.prototype.removeListener = function(type, listener) {
      var list, position, length, i;
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      if (!this._events || !this._events[type]) return this;
      list = this._events[type];
      length = list.length;
      position = -1;
      if (list === listener || isFunction(list.listener) && list.listener === listener) {
        delete this._events[type];
        this._events.removeListener && this.emit("removeListener", type, listener);
      } else if (isObject(list)) {
        for (i = length; i-- > 0; ) if (list[i] === listener || list[i].listener && list[i].listener === listener) {
          position = i;
          break;
        }
        if (position < 0) return this;
        if (1 === list.length) {
          list.length = 0;
          delete this._events[type];
        } else list.splice(position, 1);
        this._events.removeListener && this.emit("removeListener", type, listener);
      }
      return this;
    };
    EventEmitter.prototype.removeAllListeners = function(type) {
      var key, listeners;
      if (!this._events) return this;
      if (!this._events.removeListener) {
        0 === arguments.length ? this._events = {} : this._events[type] && delete this._events[type];
        return this;
      }
      if (0 === arguments.length) {
        for (key in this._events) {
          if ("removeListener" === key) continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = {};
        return this;
      }
      listeners = this._events[type];
      if (isFunction(listeners)) this.removeListener(type, listeners); else if (listeners) while (listeners.length) this.removeListener(type, listeners[listeners.length - 1]);
      delete this._events[type];
      return this;
    };
    EventEmitter.prototype.listeners = function(type) {
      var ret;
      ret = this._events && this._events[type] ? isFunction(this._events[type]) ? [ this._events[type] ] : this._events[type].slice() : [];
      return ret;
    };
    EventEmitter.prototype.listenerCount = function(type) {
      if (this._events) {
        var evlistener = this._events[type];
        if (isFunction(evlistener)) return 1;
        if (evlistener) return evlistener.length;
      }
      return 0;
    };
    EventEmitter.listenerCount = function(emitter, type) {
      return emitter.listenerCount(type);
    };
    function isFunction(arg) {
      return "function" === typeof arg;
    }
    function isNumber(arg) {
      return "number" === typeof arg;
    }
    function isObject(arg) {
      return "object" === typeof arg && null !== arg;
    }
    function isUndefined(arg) {
      return void 0 === arg;
    }
  }, {} ],
  HelloWorld: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "280c3rsZJJKnZ9RqbALVwtK", "HelloWorld");
    "use strict";
    cc._RF.pop();
  }, {} ],
  ToggleHandle: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b9a45njy4xPD7xRedBE+yuP", "ToggleHandle");
    "use strict";
    var selectedUser = require("selectedUser");
    var User = require("User");
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {},
      onSelected: function onSelected(toggle) {
        var user = new User();
        user = toggle.user;
        toggle.isChecked ? this.addSelectedUser(user) : this.removeSelectedUser(user);
      },
      addSelectedUser: function addSelectedUser(user) {
        selectedUser.push(user);
        return selectedUser;
      },
      removeSelectedUser: function removeSelectedUser(user) {
        var index = selectedUser.indexOf(user);
        selectedUser.splice(index, 1);
        return selectedUser;
      }
    });
    cc._RF.pop();
  }, {
    User: "User",
    selectedUser: "selectedUser"
  } ],
  User: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "57862eR16tHx5p/s4pA7fUx", "User");
    "use strict";
    var User = cc.Class({
      id: "",
      username: "",
      password: "",
      phone: ""
    });
    module.exports = User;
    cc._RF.pop();
  }, {} ],
  deleteController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e685ew6YxRO5YV9ru5z8IeT", "deleteController");
    "use strict";
    var selectedUser = require("selectedUser");
    var mEE = require("mEmitter");
    var data = JSON.parse(cc.sys.localStorage.getItem("users"));
    cc.Class({
      extends: cc.Component,
      properties: {
        btnDelete: cc.Button,
        layout_item: cc.Layout,
        lblItem: cc.Label
      },
      onLoad: function onLoad() {},
      start: function start() {
        selectedUser.length > 0 ? this.onOrOffBtn(true) : this.onOrOffBtn(false);
        this.btnDelete.node.on("mousedown", this.onClickDelete, this);
        data.length > 0 && this.onOrOffBtn(false);
      },
      onOrOffBtn: function onOrOffBtn(value) {
        this.btnDelete.interactable = value;
      },
      onClickDelete: function onClickDelete() {
        mEE.instance.emit("DELETE");
      },
      update: function update(dt) {
        selectedUser.length > 0 ? this.onOrOffBtn(true) : this.onOrOffBtn(false);
      }
    });
    cc._RF.pop();
  }, {
    mEmitter: "mEmitter",
    selectedUser: "selectedUser"
  } ],
  listView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e04a6IIxwFKSbXZpb8acEqA", "listView");
    "use strict";
    var data = JSON.parse(cc.sys.localStorage.getItem("users"));
    var selectedUser = require("selectedUser");
    var mEE = require("mEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {
        parentItem: cc.Layout,
        prefab_item: cc.Prefab,
        loading: cc.ProgressBar,
        text: "cls"
      },
      onLoad: function onLoad() {
        mEE.instance = new mEE();
        mEE.instance.registerEvent("DELETE", this.deleteItem, this);
        mEE.instance.registerEvent("CREATE", this.addItem, this);
        cc.log("onLoad: ", this.text);
      },
      start: function start() {
        data.length > 0 && this.renderAllUser(data);
      },
      hideOrShowListUser: function hideOrShowListUser(value) {
        return this.node.active = value;
      },
      renderAllUser: function renderAllUser(data) {
        var _this = this;
        data.forEach(function(user) {
          cc.log(_this.renderUser(user));
        });
      },
      renderUser: function renderUser(user) {
        var item = cc.instantiate(this.prefab_item);
        item.parent = this.parentItem.node;
        item.children[1].getComponent("cc.Label").string = user.username;
        item.children[0].getComponent("cc.Toggle").isChecked = false;
        item.children[0].getComponent("cc.Toggle").user = user;
        return item;
      },
      addItem: function addItem(data) {
        cc.sys.localStorage.setItem("users", JSON.stringify(data));
      },
      deleteItem: function deleteItem() {
        data = data.filter(function(_ref) {
          var id1 = _ref.id;
          return !selectedUser.some(function(_ref2) {
            var id2 = _ref2.id;
            return id2 === id1;
          });
        });
        cc.sys.localStorage.setItem("users", JSON.stringify(data));
      }
    });
    cc._RF.pop();
  }, {
    mEmitter: "mEmitter",
    selectedUser: "selectedUser"
  } ],
  mEmitter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d803cCt5mRA3J7kpXzbrNXx", "mEmitter");
    "use strict";
    var _createClass = function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          "value" in descriptor && (descriptor.writable = true);
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        protoProps && defineProperties(Constructor.prototype, protoProps);
        staticProps && defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    var EventEmitter = require("events");
    var mEmitter = function() {
      function mEmitter() {
        _classCallCheck(this, mEmitter);
        this._emiter = new EventEmitter();
        this._emiter.setMaxListeners(100);
      }
      _createClass(mEmitter, [ {
        key: "emit",
        value: function emit() {
          var _emiter;
          (_emiter = this._emiter).emit.apply(_emiter, arguments);
        }
      }, {
        key: "registerEvent",
        value: function registerEvent(event, listener, target) {
          this._emiter.on(event, listener, target);
        }
      }, {
        key: "registerOnce",
        value: function registerOnce(event, listener) {
          this._emiter.once(event, listener);
        }
      }, {
        key: "removeEvent",
        value: function removeEvent(event, listener) {
          this._emiter.removeListener(event, listener);
        }
      }, {
        key: "destroy",
        value: function destroy() {
          this._emiter.removeAllListeners();
          this._emiter = null;
          mEmitter.instance = null;
        }
      } ]);
      return mEmitter;
    }();
    mEmitter.instance = null;
    module.exports = mEmitter;
    cc._RF.pop();
  }, {
    events: 1
  } ],
  progressBar: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "65089DXld1MrK9l/DbD09lM", "progressBar");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        getLoading: cc.ProgressBar,
        getListUser: cc.Component,
        _pauseUpdate: true
      },
      loading: function loading(dt) {
        var _this = this;
        this._pauseUpdate = false;
        this.schedule(function() {
          _this.getLoading.progress += 1 / 30;
          if (_this.getLoading.progress >= 1) {
            _this.getLoading.progress = 0;
            _this.getListUser.node.active = true;
            _this.node.active = false;
            _this._pauseUpdate = true;
          }
        }, .05, 30);
      },
      start: function start() {},
      update: function update(dt) {
        this.node.active && this._pauseUpdate && this.loading(dt);
      }
    });
    cc._RF.pop();
  }, {} ],
  registerController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "714c2ROQjVGSIHECsAuVARs", "registerController");
    "use strict";
    var User = require("User");
    var mEE = require("mEmitter");
    var local = JSON.parse(cc.sys.localStorage.getItem("users"));
    cc.Class({
      extends: cc.Component,
      properties: {
        edbUsername: cc.EditBox,
        edbPassword: cc.EditBox,
        edbPhoneNumber: cc.EditBox,
        btnRegister: cc.Button,
        loadingScene: cc.Component,
        users: []
      },
      onLoad: function onLoad() {
        null != local && (this.users = local);
        cc.log(local);
      },
      start: function start() {
        this.btnRegister.node.on("click", this.clickRegister, this);
      },
      textDone: function textDone() {
        this.edbUsername.string = this.edbUsername.string.trim();
        this.edbPassword.string = this.edbPassword.string.trim();
        this.edbPhoneNumber.string = this.edbPhoneNumber.string.trim();
      },
      clickRegister: function clickRegister() {
        this.getInfoUserAndPushToArray();
        mEE.instance.emit("CREATE", this.users);
      },
      getInfoUserAndPushToArray: function getInfoUserAndPushToArray() {
        var u = new User();
        u.id = this.users.length + 1;
        u.username = this.edbUsername.string;
        u.password = this.edbPassword.string;
        u.phone = this.edbPhoneNumber.string;
        if ("" != this.edbUsername.string && "" != this.edbPassword.string && "" != this.edbPhoneNumber.string) {
          this.users.push(u);
          this.edbUsername.string = "";
          this.edbPassword.string = "";
          this.edbPhoneNumber.string = "";
        }
        this.textDone();
      }
    });
    cc._RF.pop();
  }, {
    User: "User",
    mEmitter: "mEmitter"
  } ],
  selectedUser: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c87d3gCk05EiZwV5Tv3WHaP", "selectedUser");
    "use strict";
    var selectedUser = [];
    module.exports = selectedUser;
    cc._RF.pop();
  }, {} ]
}, {}, [ "HelloWorld", "ToggleHandle", "deleteController", "listView", "User", "mEmitter", "progressBar", "registerController", "selectedUser" ]);