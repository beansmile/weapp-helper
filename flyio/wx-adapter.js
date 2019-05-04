//微信小程序适配器
import cookies from '../weapp-cookie';
cookies.config({
  requestAlias: 'requestWithCookie'
});

module.exports = function (request, responseCallback) {
  var con = {
    method: request.method,
    url: request.url,
    dataType: request.dataType || undefined,
    header: request.headers,
    data: request.body || {},
    responseType: request.responseType || 'text',
    success: function success(res) {
      responseCallback({
        statusCode: res.statusCode,
        responseText: res.data,
        headers: res.header,
        statusMessage: res.errMsg
      });
    },
    fail: function fail(res) {
      responseCallback({
        statusCode: res.statusCode || 0,
        statusMessage: res.errMsg
      });
    }
  };
  wx.requestWithCookie(con);
};