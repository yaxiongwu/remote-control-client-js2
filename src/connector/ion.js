"use strict";
exports.__esModule = true;
exports.Connector = void 0;
var grpc_web_1 = require("@improbable-eng/grpc-web");
/**
 * Connector class
 * support multiple services
 */
var Connector = /** @class */ (function () {
    function Connector(uri, token) {
        this.uri = uri;
        this.metadata = new grpc_web_1.grpc.Metadata();
        this.services = new Map();
        if (token) {
            this.metadata.append('authorization', token);
        }
    }
    Connector.prototype.grpcClientRpcOptions = function () {
        return {
            host: this.uri,
            transport: grpc_web_1.grpc.WebsocketTransport()
        };
    };
    Connector.prototype.close = function () {
        this.services.forEach(function (service) {
            if (service.connected) {
                service.close();
            }
        });
    };
    Connector.prototype.onHeaders = function (service, headers) {
        var _this = this;
        var _a;
        // Merge metadata.
        headers.forEach(function (key, value) {
            if (key.toLowerCase() !== 'trailer' && key.toLowerCase() !== 'content-type') {
                _this.metadata.append(key, value);
            }
        });
        service.connected = true;
        (_a = this.onopen) === null || _a === void 0 ? void 0 : _a.call(this, service);
    };
    Connector.prototype.onEnd = function (service, status, statusMessage, trailers) {
        var _a;
        service.connected = false;
        (_a = this.onclose) === null || _a === void 0 ? void 0 : _a.call(this, service, new CustomEvent(service.name, { detail: { status: status, statusMessage: statusMessage, trailers: trailers } }));
    };
    /**
     * register service to connector
     * @date 2021-11-03
     * @param {any} service:Service
     * @returns {any}
     */
    Connector.prototype.registerService = function (service) {
        this.services.set(service.name, service);
    };
    return Connector;
}());
exports.Connector = Connector;
