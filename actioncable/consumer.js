import _typeof from "@babel/runtime/helpers/typeof";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import Connection from "./connection";
import Subscriptions from "./subscriptions"; // The ActionCable.Consumer establishes the connection to a server-side Ruby Connection object. Once established,
// the ActionCable.ConnectionMonitor will ensure that its properly maintained through heartbeats and checking for stale updates.
// The Consumer instance is also the gateway to establishing subscriptions to desired channels through the #createSubscription
// method.
//
// The following example shows how this can be setup:
//
//   App = {}
//   App.cable = ActionCable.createConsumer("ws://example.com/accounts/1")
//   App.appearance = App.cable.subscriptions.create("AppearanceChannel")
//
// For more details on how you'd configure an actual channel subscription, see ActionCable.Subscription.
//
// When a consumer is created, it automatically connects with the server.
//
// To disconnect from the server, call
//
//   App.cable.disconnect()
//
// and to restart the connection:
//
//   App.cable.connect()
//
// Any channel subscriptions which existed prior to disconnecting will
// automatically resubscribe.

var Consumer =
/*#__PURE__*/
function () {
  function Consumer(url) {
    _classCallCheck(this, Consumer);

    this._url = url;
    this.subscriptions = new Subscriptions(this);
    this.connection = new Connection(this);
  }

  _createClass(Consumer, [{
    key: "send",
    value: function send(data) {
      return this.connection.send(data);
    }
  }, {
    key: "connect",
    value: function connect() {
      return this.connection.open();
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      return this.connection.close({
        allowReconnect: false
      });
    }
  }, {
    key: "ensureActiveConnection",
    value: function ensureActiveConnection() {
      if (!this.connection.isActive()) {
        return this.connection.open();
      }
    }
  }, {
    key: "url",
    get: function get() {
      return createWebSocketURL(this._url);
    }
  }]);

  return Consumer;
}();

export { Consumer as default };
export function createWebSocketURL(url) {
  if (typeof url === "function") {
    url = url();
  }

  if ((typeof document === "undefined" ? "undefined" : _typeof(document)) === "object" && url && !/^wss?:/i.test(url)) {
    var a = document.createElement("a");
    a.href = url; // Fix populating Location properties in IE. Otherwise, protocol will be blank.

    a.href = a.href;
    a.protocol = a.protocol.replace("http", "ws");
    return a.href;
  } else {
    return url;
  }
}