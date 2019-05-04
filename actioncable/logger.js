import adapters from "./adapters";
export default {
  log: function log() {
    if (this.enabled) {
      var _adapters$logger;

      for (var _len = arguments.length, messages = new Array(_len), _key = 0; _key < _len; _key++) {
        messages[_key] = arguments[_key];
      }

      messages.push(Date.now());

      (_adapters$logger = adapters.logger).log.apply(_adapters$logger, ["[ActionCable]"].concat(messages));
    }
  }
};