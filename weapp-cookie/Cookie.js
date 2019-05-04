import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import cookieParser from 'set-cookie-parser';
import util from './util';
/**
 * Cookie 类
 */

var Cookie =
/*#__PURE__*/
function () {
  /**
   * 构造函数
   */
  function Cookie(props) {
    _classCallCheck(this, Cookie);

    this.name = props.name || '';
    this.value = props.value || ''; // other

    this.domain = props.domain || '';
    this.path = props.path || '/';
    this.expires = props.expires ? new Date(props.expires) : null;
    this.maxAge = props.maxAge ? parseInt(props.maxAge) : null;
    this.httpOnly = !!props.httpOnly; // 记录时间

    this.dateTime = props.dateTime ? new Date(props.dateTime) : new Date();
  }
  /**
   * 设置 cookie, 将 set-cookie 字符串转换为 Cookie 对象
   */


  _createClass(Cookie, [{
    key: "set",
    value: function set() {
      var setCookieStr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var cookie = cookieParser.parse(setCookieStr, util.parseOptions)[0];

      if (cookie) {
        Object.assign(this, cookie); // 更新设置时间

        this.dateTime = new Date();
      }

      return this;
    }
    /**
     * 合并 cookie
     * @param  {Cookie} cookie cookie 对象
     * @return {Cookie}        this
     */

  }, {
    key: "merge",
    value: function merge(cookie) {
      return Object.assign(this, cookie);
    }
    /**
     * 验证 cookie 是否还有效
     * @return {Boolean} 是否有效
     */

  }, {
    key: "isExpired",
    value: function isExpired() {
      // maxAge 为 0，无效
      if (this.maxAge === 0) {
        return true;
      } // 存活秒数超出 maxAge，无效


      if (this.maxAge > 0) {
        var seconds = (Date.now() - this.dateTime.getTime()) / 1000;
        return seconds > this.maxAge;
      } // expires 小于当前时间，无效


      if (this.expires && this.expires < new Date()) {
        return true;
      }

      return false;
    }
    /**
     * 验证 cookie 是否可持久化
     * @return {Boolean} 是否可持久化
     */

  }, {
    key: "isPersistence",
    value: function isPersistence() {
      return this.maxAge ? this.maxAge > 0 : true;
    }
    /**
     * 验证 cookie 是否在指定的 domain 范围内
     * @param  {String}  domain    域名
     * @return {Boolean}           是否在指定的 domain 范围内
     */

  }, {
    key: "isInDomain",
    value: function isInDomain(domain) {
      var scopeDomains = util.getCookieScopeDomain(domain);
      return scopeDomains.indexOf(this.domain) >= 0;
    }
    /**
     * 验证 cookie 是否在指定的 path 范围内
     * @param  {String}  path    url路径
     * @return {Boolean}         是否在指定的 path 范围内
     */

  }, {
    key: "isInPath",
    value: function isInPath(path) {
      return path.indexOf(this.path) === 0 || this.path.replace(/\/$/, '') === path;
    }
    /**
     * 重写对象的 toString 方法
     */

  }, {
    key: "toString",
    value: function toString() {
      return [this.name, this.value].join('=');
    }
  }]);

  return Cookie;
}();

export default Cookie;