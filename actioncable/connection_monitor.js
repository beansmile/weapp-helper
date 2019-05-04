import _typeof from "@babel/runtime/helpers/typeof";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import logger from "./logger"; // Responsible for ensuring the cable connection is in good health by validating the heartbeat pings sent from the server, and attempting
// revival reconnections if things go astray. Internal class, not intended for direct user manipulation.

var now = function now() {
  return new Date().getTime();
};

var secondsSince = function secondsSince(time) {
  return (now() - time) / 1000;
};

var clamp = function clamp(number, min, max) {
  return Math.max(min, Math.min(max, number));
};

var ConnectionMonitor =
/*#__PURE__*/
function () {
  function ConnectionMonitor(connection) {
    _classCallCheck(this, ConnectionMonitor);

    this.visibilityDidChange = this.visibilityDidChange.bind(this);
    this.connection = connection;
    this.reconnectAttempts = 0;
  }

  _createClass(ConnectionMonitor, [{
    key: "start",
    value: function start() {
      if (!this.isRunning()) {
        this.startedAt = now();
        delete this.stoppedAt;
        this.startPolling();

        if ((typeof document === "undefined" ? "undefined" : _typeof(document)) === "object") {
          addEventListener("visibilitychange", this.visibilityDidChange);
        }

        logger.log("ConnectionMonitor started. pollInterval = ".concat(this.getPollInterval(), " ms"));
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.isRunning()) {
        this.stoppedAt = now();
        this.stopPolling();

        if ((typeof document === "undefined" ? "undefined" : _typeof(document)) === "object") {
          removeEventListener("visibilitychange", this.visibilityDidChange);
        }

        logger.log("ConnectionMonitor stopped");
      }
    }
  }, {
    key: "isRunning",
    value: function isRunning() {
      return this.startedAt && !this.stoppedAt;
    }
  }, {
    key: "recordPing",
    value: function recordPing() {
      this.pingedAt = now();
    }
  }, {
    key: "recordConnect",
    value: function recordConnect() {
      this.reconnectAttempts = 0;
      this.recordPing();
      delete this.disconnectedAt;
      logger.log("ConnectionMonitor recorded connect");
    }
  }, {
    key: "recordDisconnect",
    value: function recordDisconnect() {
      this.disconnectedAt = now();
      logger.log("ConnectionMonitor recorded disconnect");
    } // Private

  }, {
    key: "startPolling",
    value: function startPolling() {
      this.stopPolling();
      this.poll();
    }
  }, {
    key: "stopPolling",
    value: function stopPolling() {
      clearTimeout(this.pollTimeout);
    }
  }, {
    key: "poll",
    value: function poll() {
      var _this = this;

      this.pollTimeout = setTimeout(function () {
        _this.reconnectIfStale();

        _this.poll();
      }, this.getPollInterval());
    }
  }, {
    key: "getPollInterval",
    value: function getPollInterval() {
      var _this$constructor$pol = this.constructor.pollInterval,
          min = _this$constructor$pol.min,
          max = _this$constructor$pol.max,
          multiplier = _this$constructor$pol.multiplier;
      var interval = multiplier * Math.log(this.reconnectAttempts + 1);
      return Math.round(clamp(interval, min, max) * 1000);
    }
  }, {
    key: "reconnectIfStale",
    value: function reconnectIfStale() {
      if (this.connectionIsStale()) {
        logger.log("ConnectionMonitor detected stale connection. reconnectAttempts = ".concat(this.reconnectAttempts, ", pollInterval = ").concat(this.getPollInterval(), " ms, time disconnected = ").concat(secondsSince(this.disconnectedAt), " s, stale threshold = ").concat(this.constructor.staleThreshold, " s"));
        this.reconnectAttempts++;

        if (this.disconnectedRecently()) {
          logger.log("ConnectionMonitor skipping reopening recent disconnect");
        } else {
          logger.log("ConnectionMonitor reopening");
          this.connection.reopen();
        }
      }
    }
  }, {
    key: "connectionIsStale",
    value: function connectionIsStale() {
      return secondsSince(this.pingedAt ? this.pingedAt : this.startedAt) > this.constructor.staleThreshold;
    }
  }, {
    key: "disconnectedRecently",
    value: function disconnectedRecently() {
      return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
    }
  }, {
    key: "visibilityDidChange",
    value: function visibilityDidChange() {
      var _this2 = this;

      if (document.visibilityState === "visible") {
        setTimeout(function () {
          if (_this2.connectionIsStale() || !_this2.connection.isOpen()) {
            logger.log("ConnectionMonitor reopening stale connection on visibilitychange. visbilityState = ".concat(document.visibilityState));

            _this2.connection.reopen();
          }
        }, 200);
      }
    }
  }]);

  return ConnectionMonitor;
}();

ConnectionMonitor.pollInterval = {
  min: 3,
  max: 30,
  multiplier: 5
};
ConnectionMonitor.staleThreshold = 6; // Server::Connections::BEAT_INTERVAL * 2 (missed two pings)

export default ConnectionMonitor;