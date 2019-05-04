import "./wx";

const url = Symbol("url");
const readyState = Symbol("readyState");
const onopen = Symbol("onopen");
const onmessage = Symbol("onmessage");
const onerror = Symbol("onerror");
const onclose = Symbol("onclose");


class WebSocketConstructor implements WebSocket {
  readonly CONNECTING = 0;
  readonly OPEN = 1;
  readonly CLOSING = 2;
  readonly CLOSED = 3;
  private socket: wx.SocketTask;
  private responseHeaders: { [field: string]: string } = {};

  constructor(url: string, protocols: string | string[] = []) {
    this[url] = url;
    this[readyState] = this.CONNECTING;
    this.socket = wx.connectSocket({
      url,
      header: {},
      protocols: Array.isArray(protocols) ? protocols : [protocols]
    });
    this.onopen = () => {
    };
  }

  get binaryType(): "blob" | "arraybuffer" {
    return this.socket["binaryType"] || "arraybuffer";
  }

  get bufferedAmount(): number {
    return this.socket["bufferedAmount"] || void 0;
  }

  get extensions(): string {
    return this.socket["extensions"]
      || this.responseHeaders["sec-websocket-extensions"]
      || "";
  }

  get protocol(): string {
    return this.socket["protocol"]
      || this.responseHeaders["sec-websocket-protocol"]
      || "";
  }

  get readyState(): number {
    return this.socket["readyState"] || this[readyState];
  }

  get url(): string {
    return this.socket["url"] || this[url];
  }

  get onopen(): WebSocket["onopen"] {
    return this[onopen];
  }

  set onopen(callback) {
    this[onopen] = callback;
    this.socket.onOpen((res) => {
      this[readyState] = this.OPEN;
      for (let i in res.header) {
        this.responseHeaders[i.toLowerCase()] = res.header[i];
      }

      // new Event("open")
      callback.call(this, {
        type: "open",
        target: this
      });
    });
  }

  get onmessage(): WebSocket["onmessage"] {
    return this[onmessage];
  }

  set onmessage(callback) {
    this[onmessage] = callback;
    this.socket.onMessage((res) => {
      // new MessageEvent("message")
      callback.call(this, {
        type: "message",
        target: this,
        data: res.data
      });
    });
  }

  get onerror(): WebSocket["onerror"] {
    return this[onerror];
  }

  set onerror(callback) {
    this[onerror] = callback;
    this.socket.onError(() => {
      // new Event("error")
      callback.call(this, {
        type: "error",
        target: this
      });
    });
  }

  get onclose(): WebSocket["onclose"] {
    return this[onclose];
  }

  set onclose(callback) {
    this[onclose] = callback;
    this.socket.onClose((res) => {
      // new CloseEvent("close")
      callback.call(this, {
        type: "close",
        target: this,
        code: res.code,
        reason: res.reason,
        wasClean: res.wasClean
      });
    });
  }

  close() {
    this[readyState] = this.CLOSING;
    this.socket.close({
      code: 1000,
      reason: "normal closure",
      success: () => {
        this[readyState] = this.CLOSED;
      }
    });
  }

  send(data: string | ArrayBuffer) {
    this.socket.send({ data });
  }

  addEventListener(type: string, listener: (evt: Event) => void): void {
    this['addListener'](type, listener)
  }

  removeEventListener(type: string, listener: (evt: Event) => void): void {
    this['removeListener'](type, listener);
  }

  dispatchEvent(ev: Event): boolean {
    return this['emit'](ev.type);
  }
}

export var WebSocket: new (
  url: string,
  protocols: string | string[]
) => WebSocket = WebSocketConstructor;
