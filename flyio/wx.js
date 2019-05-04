//微信小程序入口
var _Fly = require("flyio/src/fly");

var EngineWrapper = require("flyio/src/engine-wrapper");

var adapter = require("./wx-adapter");

var wxEngine = EngineWrapper(adapter);

module.exports = function (engine) {
  return new _Fly(engine || wxEngine);
};