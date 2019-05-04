import _typeof from "@babel/runtime/helpers/typeof";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import Subscription from "./subscription"; // Collection class for creating (and internally managing) channel subscriptions. The only method intended to be triggered by the user
// us ActionCable.Subscriptions#create, and it should be called through the consumer like so:
//
//   App = {}
//   App.cable = ActionCable.createConsumer("ws://example.com/accounts/1")
//   App.appearance = App.cable.subscriptions.create("AppearanceChannel")
//
// For more details on how you'd configure an actual channel subscription, see ActionCable.Subscription.

var Subscriptions =
/*#__PURE__*/
function () {
  function Subscriptions(consumer) {
    _classCallCheck(this, Subscriptions);

    this.consumer = consumer;
    this.subscriptions = [];
  }

  _createClass(Subscriptions, [{
    key: "create",
    value: function create(channelName, mixin) {
      var channel = channelName;
      var params = _typeof(channel) === "object" ? channel : {
        channel: channel
      };
      var subscription = new Subscription(this.consumer, params, mixin);
      return this.add(subscription);
    } // Private

  }, {
    key: "add",
    value: function add(subscription) {
      this.subscriptions.push(subscription);
      this.consumer.ensureActiveConnection();
      this.notify(subscription, "initialized");
      this.sendCommand(subscription, "subscribe");
      return subscription;
    }
  }, {
    key: "remove",
    value: function remove(subscription) {
      this.forget(subscription);

      if (!this.findAll(subscription.identifier).length) {
        this.sendCommand(subscription, "unsubscribe");
      }

      return subscription;
    }
  }, {
    key: "reject",
    value: function reject(identifier) {
      var _this = this;

      return this.findAll(identifier).map(function (subscription) {
        _this.forget(subscription);

        _this.notify(subscription, "rejected");

        return subscription;
      });
    }
  }, {
    key: "forget",
    value: function forget(subscription) {
      this.subscriptions = this.subscriptions.filter(function (s) {
        return s !== subscription;
      });
      return subscription;
    }
  }, {
    key: "findAll",
    value: function findAll(identifier) {
      return this.subscriptions.filter(function (s) {
        return s.identifier === identifier;
      });
    }
  }, {
    key: "reload",
    value: function reload() {
      var _this2 = this;

      return this.subscriptions.map(function (subscription) {
        return _this2.sendCommand(subscription, "subscribe");
      });
    }
  }, {
    key: "notifyAll",
    value: function notifyAll(callbackName) {
      var _this3 = this;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return this.subscriptions.map(function (subscription) {
        return _this3.notify.apply(_this3, [subscription, callbackName].concat(args));
      });
    }
  }, {
    key: "notify",
    value: function notify(subscription, callbackName) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      var subscriptions;

      if (typeof subscription === "string") {
        subscriptions = this.findAll(subscription);
      } else {
        subscriptions = [subscription];
      }

      return subscriptions.map(function (subscription) {
        return typeof subscription[callbackName] === "function" ? subscription[callbackName].apply(subscription, args) : undefined;
      });
    }
  }, {
    key: "sendCommand",
    value: function sendCommand(subscription, command) {
      var identifier = subscription.identifier;
      return this.consumer.send({
        command: command,
        identifier: identifier
      });
    }
  }]);

  return Subscriptions;
}();

export { Subscriptions as default };