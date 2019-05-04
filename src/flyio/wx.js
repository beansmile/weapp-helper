//微信小程序入口
const _Fly = require("flyio/src/fly")
const EngineWrapper = require("flyio/src/engine-wrapper")
const adapter = require("./wx-adapter")
const wxEngine = EngineWrapper(adapter)

module.exports = function (engine) {
  return new _Fly(engine || wxEngine);
}
