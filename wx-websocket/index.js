import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import "./wx";
var url = Symbol("url");
var readyState = Symbol("readyState");
var onopen = Symbol("onopen");
var onmessage = Symbol("onmessage");
var onerror = Symbol("onerror");
var onclose = Symbol("onclose");

var WebSocketConstructor =
/*#__PURE__*/
function () {
  function WebSocketConstructor(url) {
    var protocols = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, WebSocketConstructor);

    _defineProperty(this, "CONNECTING", 0);

    _defineProperty(this, "OPEN", 1);

    _defineProperty(this, "CLOSING", 2);

    _defineProperty(this, "CLOSED", 3);

    _defineProperty(this, "socket", void 0);

    _defineProperty(this, "responseHeaders", {});

    this[url] = url;
    this[readyState] = this.CONNECTING;
    this.socket = wx.connectSocket({
      url: url,
      header: {},
      protocols: Array.isArray(protocols) ? protocols : [protocols]
    });

    this.onopen = function () {};
  }

  _createClass(WebSocketConstructor, [{
    key: "close",
    value: function close() {
      var _this = this;

      this[readyState] = this.CLOSING;
      this.socket.close({
        code: 1000,
        reason: "normal closure",
        success: function success() {
          _this[readyState] = _this.CLOSED;
        }
      });
    }
  }, {
    key: "send",
    value: function send(data) {
      this.socket.send({
        data: data
      });
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(type, listener) {
      this['addListener'](type, listener);
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(type, listener) {
      this['removeListener'](type, listener);
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(ev) {
      return this['emit'](ev.type);
    }
  }, {
    key: "binaryType",
    get: function get() {
      return this.socket["binaryType"] || "arraybuffer";
    }
  }, {
    key: "bufferedAmount",
    get: function get() {
      return this.socket["bufferedAmount"] || void 0;
    }
  }, {
    key: "extensions",
    get: function get() {
      return this.socket["extensions"] || this.responseHeaders["sec-websocket-extensions"] || "";
    }
  }, {
    key: "protocol",
    get: function get() {
      return this.socket["protocol"] || this.responseHeaders["sec-websocket-protocol"] || "";
    }
  }, {
    key: "readyState",
    get: function get() {
      return this.socket["readyState"] || this[readyState];
    }
  }, {
    key: "url",
    get: function get() {
      return this.socket["url"] || this[url];
    }
  }, {
    key: "onopen",
    get: function get() {
      return this[onopen];
    },
    set: function set(callback) {
      var _this2 = this;

      this[onopen] = callback;
      this.socket.onOpen(function (res) {
        _this2[readyState] = _this2.OPEN;

        for (var i in res.header) {
          _this2.responseHeaders[i.toLowerCase()] = res.header[i];
        } // new Event("open")


        callback.call(_this2, {
          type: "open",
          target: _this2
        });
      });
    }
  }, {
    key: "onmessage",
    get: function get() {
      return this[onmessage];
    },
    set: function set(callback) {
      var _this3 = this;

      this[onmessage] = callback;
      this.socket.onMessage(function (res) {
        // new MessageEvent("message")
        callback.call(_this3, {
          type: "message",
          target: _this3,
          data: res.data
        });
      });
    }
  }, {
    key: "onerror",
    get: function get() {
      return this[onerror];
    },
    set: function set(callback) {
      var _this4 = this;

      this[onerror] = callback;
      this.socket.onError(function () {
        // new Event("error")
        callback.call(_this4, {
          type: "error",
          target: _this4
        });
      });
    }
  }, {
    key: "onclose",
    get: function get() {
      return this[onclose];
    },
    set: function set(callback) {
      var _this5 = this;

      this[onclose] = callback;
      this.socket.onClose(function (res) {
        // new CloseEvent("close")
        callback.call(_this5, {
          type: "close",
          target: _this5,
          code: res.code,
          reason: res.reason,
          wasClean: res.wasClean
        });
      });
    }
  }]);

  return WebSocketConstructor;
}();

export var WebSocket = WebSocketConstructor;