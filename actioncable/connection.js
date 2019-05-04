import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import adapters from "./adapters";
import ConnectionMonitor from "./connection_monitor";
import INTERNAL from "./internal";
import logger from "./logger"; // Encapsulate the cable connection held by the consumer. This is an internal class not intended for direct user manipulation.

var message_types = INTERNAL.message_types,
    protocols = INTERNAL.protocols;
var supportedProtocols = protocols.slice(0, protocols.length - 1);
var indexOf = [].indexOf;

var Connection =
/*#__PURE__*/
function () {
  function Connection(consumer) {
    _classCallCheck(this, Connection);

    this.open = this.open.bind(this);
    this.consumer = consumer;
    this.subscriptions = this.consumer.subscriptions;
    this.monitor = new ConnectionMonitor(this);
    this.disconnected = true;
  }

  _createClass(Connection, [{
    key: "send",
    value: function send(data) {
      if (this.isOpen()) {
        this.webSocket.send(JSON.stringify(data));
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "open",
    value: function open() {
      if (this.isActive()) {
        logger.log("Attempted to open WebSocket, but existing socket is ".concat(this.getState()));
        return false;
      } else {
        logger.log("Opening WebSocket, current state is ".concat(this.getState(), ", subprotocols: ").concat(protocols));

        if (this.webSocket) {
          this.uninstallEventHandlers();
        }

        this.webSocket = new adapters.WebSocket(this.consumer.url, protocols);
        this.installEventHandlers();
        this.monitor.start();
        return true;
      }
    }
  }, {
    key: "close",
    value: function close() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        allowReconnect: true
      },
          allowReconnect = _ref.allowReconnect;

      if (!allowReconnect) {
        this.monitor.stop();
      }

      if (this.isActive()) {
        return this.webSocket.close();
      }
    }
  }, {
    key: "reopen",
    value: function reopen() {
      logger.log("Reopening WebSocket, current state is ".concat(this.getState()));

      if (this.isActive()) {
        try {
          return this.close();
        } catch (error) {
          logger.log("Failed to reopen WebSocket", error);
        } finally {
          logger.log("Reopening WebSocket in ".concat(this.constructor.reopenDelay, "ms"));
          setTimeout(this.open, this.constructor.reopenDelay);
        }
      } else {
        return this.open();
      }
    }
  }, {
    key: "getProtocol",
    value: function getProtocol() {
      if (this.webSocket) {
        return this.webSocket.protocol;
      }
    }
  }, {
    key: "isOpen",
    value: function isOpen() {
      return this.isState("open");
    }
  }, {
    key: "isActive",
    value: function isActive() {
      return this.isState("open", "connecting");
    } // Private

  }, {
    key: "isProtocolSupported",
    value: function isProtocolSupported() {
      return indexOf.call(supportedProtocols, this.getProtocol()) >= 0;
    }
  }, {
    key: "isState",
    value: function isState() {
      for (var _len = arguments.length, states = new Array(_len), _key = 0; _key < _len; _key++) {
        states[_key] = arguments[_key];
      }

      return indexOf.call(states, this.getState()) >= 0;
    }
  }, {
    key: "getState",
    value: function getState() {
      if (this.webSocket) {
        for (var state in adapters.WebSocket) {
          if (adapters.WebSocket[state] === this.webSocket.readyState) {
            return state.toLowerCase();
          }
        }
      }

      return null;
    }
  }, {
    key: "installEventHandlers",
    value: function installEventHandlers() {
      for (var eventName in this.events) {
        var handler = this.events[eventName].bind(this);
        this.webSocket["on".concat(eventName)] = handler;
      }
    }
  }, {
    key: "uninstallEventHandlers",
    value: function uninstallEventHandlers() {
      for (var eventName in this.events) {
        this.webSocket["on".concat(eventName)] = function () {};
      }
    }
  }]);

  return Connection;
}();

Connection.reopenDelay = 500;
Connection.prototype.events = {
  message: function message(event) {
    if (!this.isProtocolSupported()) {
      return;
    }

    var _JSON$parse = JSON.parse(event.data),
        identifier = _JSON$parse.identifier,
        message = _JSON$parse.message,
        reason = _JSON$parse.reason,
        reconnect = _JSON$parse.reconnect,
        type = _JSON$parse.type;

    switch (type) {
      case message_types.welcome:
        this.monitor.recordConnect();
        return this.subscriptions.reload();

      case message_types.disconnect:
        logger.log("Disconnecting. Reason: ".concat(reason));
        return this.close({
          allowReconnect: reconnect
        });

      case message_types.ping:
        return this.monitor.recordPing();

      case message_types.confirmation:
        return this.subscriptions.notify(identifier, "connected");

      case message_types.rejection:
        return this.subscriptions.reject(identifier);

      default:
        return this.subscriptions.notify(identifier, "received", message);
    }
  },
  open: function open() {
    logger.log("WebSocket onopen event, using '".concat(this.getProtocol(), "' subprotocol"));
    this.disconnected = false;

    if (!this.isProtocolSupported()) {
      logger.log("Protocol is unsupported. Stopping monitor and disconnecting.");
      return this.close({
        allowReconnect: false
      });
    }
  },
  close: function close(event) {
    logger.log("WebSocket onclose event");

    if (this.disconnected) {
      return;
    }

    this.disconnected = true;
    this.monitor.recordDisconnect();
    return this.subscriptions.notifyAll("disconnected", {
      willAttemptReconnect: this.monitor.isRunning()
    });
  },
  error: function error() {
    logger.log("WebSocket onerror event");
  }
};
export default Connection;