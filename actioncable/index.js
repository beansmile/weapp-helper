import _typeof from "@babel/runtime/helpers/typeof";
import Connection from "./connection";
import ConnectionMonitor from "./connection_monitor";
import Consumer, { createWebSocketURL } from "./consumer";
import INTERNAL from "./internal";
import Subscription from "./subscription";
import Subscriptions from "./subscriptions";
import adapters from "./adapters";
import logger from "./logger";
export { Connection, ConnectionMonitor, Consumer, INTERNAL, Subscription, Subscriptions, adapters, createWebSocketURL, logger };
export function createConsumer() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getConfig("url") || INTERNAL.default_mount_path;
  return new Consumer(url);
}
export function getConfig(name) {
  if ((typeof document === "undefined" ? "undefined" : _typeof(document)) === "object") {
    var element = document.head.querySelector("meta[name='action-cable-".concat(name, "']"));

    if (element) {
      return element.getAttribute("content");
    }
  }
}