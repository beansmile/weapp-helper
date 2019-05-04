import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";

/**
 * Util 类
 */
var Util =
/*#__PURE__*/
function () {
  function Util() {
    _classCallCheck(this, Util);

    this.parseOptions = {
      decodeValues: false // setCookie.parse 的 options

    };
  }
  /**
   * 根据域名获取该域名的 cookie 作用域范围列表
   * @param  {String} domain 指定域名
   * @return {String}        cookie 作用域范围列表
   */


  _createClass(Util, [{
    key: "getCookieScopeDomain",
    value: function getCookieScopeDomain() {
      var domain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      if (!domain) return []; // 获取 cookie 作用域范围列表

      domain = domain.replace(/^\.+/ig, '');
      var scopes = domain.split('.').map(function (k) {
        return ['.', domain.slice(domain.indexOf(k))].join('');
      });
      return [domain].concat(scopes);
    }
  }]);

  return Util;
}();

export default new Util();