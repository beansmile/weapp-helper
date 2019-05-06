import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import Cookie from './Cookie';
import cookieParser from 'set-cookie-parser';
import util from './util';
import api from './api';
/**
 * CookieStore 类
 */

var CookieStore =
/*#__PURE__*/
function () {
  /**
   * 构造函数
   */
  function CookieStore() {
    _classCallCheck(this, CookieStore);

    // storageKey
    this.__storageKey = '__cookie_store__'; // cookies Map缓存（domain -> cookie 二级结构）

    this.__cookiesMap = this.__readFromStorage();
  }
  /**
   * 是否存在某个 cookie
   * @param  {String}  name       cookie 名称
   * @param  {String}  [domain]   指定域名（可选）
   * @param  {String}  [path]     指定path（可选）
   * @return {Boolean}            是否存在
   */


  _createClass(CookieStore, [{
    key: "has",
    value: function has(name, domain, path) {
      // 返回是否存在 cookie 值
      return this.getCookie(name, domain, path) !== undefined;
    }
    /**
     * 获取 cookie 值
     * @param {String} name       cookie 名称
     * @param {String} [domain]   指定域名（可选）
     * @param {String} [path]     指定path（可选）
     * @return {String}           cookie 值
     */

  }, {
    key: "get",
    value: function get() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var domain = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '/';
      // 获取 cookie
      var cookie = this.getCookie(name, domain, path); // 返回 cookie 值

      return cookie ? cookie.value : undefined;
    }
    /**
     * 设置域名 cookie
     * @param {String}  name              cookie 名称
     * @param {String}  value             cookie 值
     * @param {Object}  options           cookie 选项
     * @param {String}  options.domain
     * @param {String}  [options.path]
     * @param {Date}    [options.expires]
     * @param {Number}  [options.maxAge]
     * @param {Boolean} [options.httpOnly]
     * @return {Cookie}           cookie 对象
     */

  }, {
    key: "set",
    value: function set() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      // 构建 Cookie 实例
      var domain = options.domain;
      if (!domain || !name) throw new Error('name 和 options.domain 值不正确！');
      var cookie = new Cookie(Object.assign(options, {
        name: name,
        value: value
      })); // 设置到指定域名

      var cookies = this.__cookiesMap.get(domain) || new Map();
      cookies.set(name, cookie);

      this.__cookiesMap.set(domain, cookies); // 保存到 Storage


      this.__saveToStorage();

      return cookie;
    }
    /**
     * 获取所有域名和 cookies 结构
     * @return {Object}  obj  结构JSON对象
     */

  }, {
    key: "dir",
    value: function dir() {
      var dirObj = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.__cookiesMap.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var domain = _step.value;
          dirObj[domain] = this.getCookies(domain);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return dirObj;
    }
    /**
     * 删除 cookie
     * @param  {Array}  name      cookie 键
     * @param  {String} [domain]  指定域名（可选）
     * @return {Boolean}          是否删除成功
     */

  }, {
    key: "remove",
    value: function remove() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var domain = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      if (domain) {
        // 删除指定域名的 cookie
        var cookies = this.__cookiesMap.get(domain);

        cookies && cookies.delete(name);
      } else {
        // 删除所有域名的 cookie
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this.__cookiesMap.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _cookies = _step2.value;

            _cookies.delete(name);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      } // 保存到 Storage


      this.__saveToStorage();

      return true;
    }
    /**
     * 获取 cookie 对象
     * @param {String} name       cookie 名称
     * @param {String} [domain]   指定域名（可选）
     * @param {String} [path]     指定path（可选）
     * @return {Cookie}           cookie 对象
     */

  }, {
    key: "getCookie",
    value: function getCookie() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var domain = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '/';
      var cookie; // 获取 cookie scope 域名数组

      var scopeDomains = util.getCookieScopeDomain(domain); // 获取任意域名的 cookie

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.__cookiesMap.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _step3$value = _slicedToArray(_step3.value, 2),
              key = _step3$value[0],
              cookies = _step3$value[1];

          // 如果有域名，则根据域名过滤
          if (domain && scopeDomains.indexOf(key) < 0) continue; // 获取 cookie

          cookie = cookies.get(name);
          if (cookie && cookie.isInPath(path) && !cookie.isExpired()) break;
          cookie = undefined;
        } // 返回 cookie 值

      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return cookie;
    }
    /**
     * 获取 cookies key/value 对象
     * @param  {String} [domain]  指定域名（可选）
     * @return {Object}           cookie 值列表对象
     */

  }, {
    key: "getCookies",
    value: function getCookies(domain, path) {
      var cookieValues = {}; // 将 cookie 值添加到对象

      this.getCookiesArray(domain, path).forEach(function (cookie) {
        cookieValues[cookie.name] = cookie.value;
      }); // 返回获取的 cookie 值对象

      return cookieValues;
    }
    /**
     * 获取 cookies 对象数组
     * @param  {String} [domain]  指定域名（可选）
     * @return {Array}            Cookie 对象数组
     */

  }, {
    key: "getCookiesArray",
    value: function getCookiesArray() {
      var domain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/';
      var cookiesArr = []; // 获取 cookie scope 域名数组

      var scopeDomains = util.getCookieScopeDomain(domain); // 获取任意域名的 cookie

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.__cookiesMap.entries()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _step4$value = _slicedToArray(_step4.value, 2),
              key = _step4$value[0],
              cookies = _step4$value[1];

          // 如果有域名，则根据域名过滤
          if (domain && scopeDomains.indexOf(key) < 0) continue; // 循环当前域名下所有 cookie

          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = cookies.values()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var cookie = _step5.value;

              // 筛选符合 path 条件并且未过期的 cookie
              if (cookie.isInPath(path) && !cookie.isExpired()) {
                cookiesArr.push(cookie);
              }
            }
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
                _iterator5.return();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
            }
          }
        } // 返回获取的 cookie 值对象

      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return cookiesArr;
    }
    /**
     * 设置 cookies 对象数组到 store
     * @param  {Array} cookies  Cookie 对象数组
     * @return {Map}            cookies Map 对象
     */

  }, {
    key: "setCookiesArray",
    value: function setCookiesArray() {
      var _this = this;

      var cookies = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      this.__cookiesMap = this.__cookiesMap || new Map(); // Cookie 数组转换 Map 对象

      cookies.forEach(function (cookie) {
        var cookieMap = _this.__cookiesMap.get(cookie.domain);

        if (!cookieMap) {
          cookieMap = new Map();

          _this.__cookiesMap.set(cookie.domain, cookieMap);
        }

        cookieMap.set(cookie.name, cookie);
      }); // 保存到 Storage

      this.__saveToStorage();

      return this.__cookiesMap;
    }
    /**
     * 清除 cookies
     * @param  {String} [domain]  指定域名（可选）
     * @return {Boolean}          是否清除成功
     */

  }, {
    key: "clearCookies",
    value: function clearCookies(domain) {
      if (domain) {
        var cookies = this.__cookiesMap.get(domain);

        cookies && cookies.clear();
      } else {
        this.__cookiesMap.clear();
      } // 保存到 Storage


      this.__saveToStorage();

      return true;
    }
    /**
     * 获取 request cookies
     * @param  {String} domain 指定域名
     * @return {String}        request cookies 字符串
     */

  }, {
    key: "getRequestCookies",
    value: function getRequestCookies(domain, path) {
      // cookies 数组
      var cookiesArr = this.getCookiesArray(domain, path); // 转化为 request cookies 字符串

      return this.stringify(cookiesArr);
    }
    /**
     * 设置 response cookies
     * @param {String} setCookieStr response set-cookie 字符串
     * @param {String} domain       默认域名（如果 set-cookie 中没有设置 domain 则使用该域名）
     */

  }, {
    key: "setResponseCookies",
    value: function setResponseCookies(setCookieStr, domain) {
      // 转换为 cookie 对象数组
      var parsedCookies = this.parse(setCookieStr, domain); // 设置 cookies

      return this.setCookiesArray(parsedCookies);
    }
    /**
     * 解析 response set-cookie 字段
     * @param  {String} setCookieStr response set-cookie 字符串
     * @param  {String} domain       默认域名（如果 set-cookie 中没有设置 domain 则使用该域名）
     * @return {Array}               Cookie 对象数组
     */

  }, {
    key: "parse",
    value: function parse() {
      var setCookieStr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var domain = arguments.length > 1 ? arguments[1] : undefined;
      // parse
      var cookies = cookieParser.parse(cookieParser.splitCookiesString(setCookieStr), util.parseOptions); // 转换为 Cookie 对象

      return cookies.map(function (item) {
        if (!item.domain) item.domain = domain;
        return new Cookie(item);
      });
    }
    /**
     * 将 cookies 字符串化，转化为 request cookies 字符串
     * @param  {Array} cookies Cookie 对象数组
     * @return {String}        cookie 字符串
     */

  }, {
    key: "stringify",
    value: function stringify(cookies) {
      return cookies.map(function (item) {
        return item.toString();
      }).join('; ');
    }
    /**
     * 将 cookies 保存到 Storage
     */

  }, {
    key: "__saveToStorage",
    value: function __saveToStorage() {
      var saveCookies = []; // 获取需要持久化的 cookie

      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = this.__cookiesMap.values()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var cookies = _step6.value;
          var _iteratorNormalCompletion7 = true;
          var _didIteratorError7 = false;
          var _iteratorError7 = undefined;

          try {
            for (var _iterator7 = cookies.values()[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
              var cookie = _step7.value;

              if (cookie.isExpired()) {
                // 清除无效 cookie
                cookies.delete(cookie.name);
              } else if (cookie.isPersistence()) {
                // 只存储可持久化 cookie
                saveCookies.push(cookie);
              }
            }
          } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
                _iterator7.return();
              }
            } finally {
              if (_didIteratorError7) {
                throw _iteratorError7;
              }
            }
          }
        } // 保存到本地存储

      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      api.setStorageSync(this.__storageKey, saveCookies);
    }
    /**
     * 从 Storage 读取 cookies
     */

  }, {
    key: "__readFromStorage",
    value: function __readFromStorage() {
      // 从本地存储读取 cookie 数据数组
      var cookies = api.getStorageSync(this.__storageKey) || []; // 转化为 Cookie 对象数组

      cookies = cookies.map(function (item) {
        return new Cookie(item);
      }); // 转化为 cookie map 对象

      return this.setCookiesArray(cookies);
    }
  }]);

  return CookieStore;
}();

export default CookieStore;