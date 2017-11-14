'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _superagentBaseuri = require('superagent-baseuri');

var _superagentBaseuri2 = _interopRequireDefault(_superagentBaseuri);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = require('debug')('lightning-strike-client');

var enc = encodeURIComponent;

var LightningStrikeClient = function () {
  function LightningStrikeClient(url) {
    _classCallCheck(this, LightningStrikeClient);

    this.req = (0, _superagentBaseuri2.default)(url);
  }

  _createClass(LightningStrikeClient, [{
    key: 'invoice',
    value: function invoice(msatoshi, metadata) {
      debug('invoice(%s, %j)', msatoshi, metadata);
      return this.req.post('/invoice').type('json').send({ msatoshi: msatoshi, metadata: metadata }).then(function (res) {
        return res.status === 201 ? res.body : Promise.reject(res);
      });
    }
  }, {
    key: 'fetch',
    value: function fetch(invoice_id) {
      debug('fetch(%s)', invoice_id);
      return this.req.get('/invoice/' + enc(invoice_id)).then(function (res) {
        return res.status === 200 ? res.body : Promise.reject(res);
      });
    }
  }, {
    key: 'wait',
    value: function wait(invoice_id, timeout) {
      debug('wait(%s)', invoice_id);
      return this.req.get('/invoice/' + enc(invoice_id) + '/wait?timeout=' + timeout).then(function (res) {
        return res.status === 200 ? res.body : res.status === 402 ? false : Promise.reject(res);
      });
    }
  }, {
    key: 'registerHook',
    value: function registerHook(invoice_id, url) {
      debug('registerHook(%s, %s)', invoice_id, url);
      return this.req.post('/invoice/' + enc(invoice_id) + '/webhook').type('json').send({ url: url }).then(function (res) {
        return res.status === 201 ? true : Promise.reject(res);
      });
    }
  }]);

  return LightningStrikeClient;
}();

module.exports = LightningStrikeClient;