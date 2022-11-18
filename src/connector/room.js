"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Room = exports.Direction = exports.ErrorType = exports.Protocol = exports.Role = exports.PeerState = void 0;
var grpc_web_1 = require("@improbable-eng/grpc-web");
var room = require("../_library/apps/room/proto/room_pb");
var room_rpc = require("../_library/apps/room/proto/room_pb_service");
var events_1 = require("events");
/**
 * PeerState: The state of a peer
 */
var PeerState;
(function (PeerState) {
    PeerState[PeerState["NONE"] = 0] = "NONE";
    PeerState[PeerState["JOIN"] = 1] = "JOIN";
    PeerState[PeerState["UPDATE"] = 2] = "UPDATE";
    PeerState[PeerState["LEAVE"] = 3] = "LEAVE";
})(PeerState = exports.PeerState || (exports.PeerState = {}));
/**
 * Role: Role of the peer
 */
var Role;
(function (Role) {
    Role[Role["HOST"] = 0] = "HOST";
    Role[Role["GUEST"] = 1] = "GUEST";
})(Role = exports.Role || (exports.Role = {}));
/**
 * Protocol: The protocol of the peer
 */
var Protocol;
(function (Protocol) {
    Protocol[Protocol["PROTOCOLUNKNOWN"] = 0] = "PROTOCOLUNKNOWN";
    Protocol[Protocol["WEBRTC"] = 1] = "WEBRTC";
    Protocol[Protocol["SIP"] = 2] = "SIP";
    Protocol[Protocol["RTMP"] = 3] = "RTMP";
    Protocol[Protocol["RTSP"] = 4] = "RTSP";
})(Protocol = exports.Protocol || (exports.Protocol = {}));
/**
 * ErrorType: The type of error
 */
var ErrorType;
(function (ErrorType) {
    ErrorType[ErrorType["NONE"] = 0] = "NONE";
    ErrorType[ErrorType["UNKOWNERROR"] = 1] = "UNKOWNERROR";
    ErrorType[ErrorType["PERMISSIONDENIED"] = 2] = "PERMISSIONDENIED";
    ErrorType[ErrorType["SERVICEUNAVAILABLE"] = 3] = "SERVICEUNAVAILABLE";
    ErrorType[ErrorType["ROOMLOCKED"] = 4] = "ROOMLOCKED";
    ErrorType[ErrorType["PASSWORDREQUIRED"] = 5] = "PASSWORDREQUIRED";
    ErrorType[ErrorType["ROOMALREADYEXIST"] = 6] = "ROOMALREADYEXIST";
    ErrorType[ErrorType["ROOMNOTEXIST"] = 7] = "ROOMNOTEXIST";
    ErrorType[ErrorType["INVALIDPARAMS"] = 8] = "INVALIDPARAMS";
    ErrorType[ErrorType["PEERALREADYEXIST"] = 9] = "PEERALREADYEXIST";
    ErrorType[ErrorType["PEERNOTEXIST"] = 10] = "PEERNOTEXIST";
})(ErrorType = exports.ErrorType || (exports.ErrorType = {}));
/**
 * Direction: The direction of the stream
 */
var Direction;
(function (Direction) {
    Direction[Direction["INCOMING"] = 0] = "INCOMING";
    Direction[Direction["OUTGOING"] = 1] = "OUTGOING";
    Direction[Direction["BILATERAL"] = 2] = "BILATERAL";
})(Direction = exports.Direction || (exports.Direction = {}));
/**
 * Room: The room class
 */
var Room = /** @class */ (function () {
    function Room(connector) {
        this.name = 'room';
        this.connected = false;
        this.connector = connector;
        this.connector.registerService(this);
        this.connect();
    }
    Room.prototype.join = function (peer, password) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, (_a = this._rpc) === null || _a === void 0 ? void 0 : _a.join(peer, password)];
            });
        });
    };
    Room.prototype.leave = function (sid, uid) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, (_a = this._rpc) === null || _a === void 0 ? void 0 : _a.leave(sid, uid)];
            });
        });
    };
    Room.prototype.message = function (sid, from, to, mineType, data) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, (_a = this._rpc) === null || _a === void 0 ? void 0 : _a.sendMessage(sid, from, to, mineType, data)];
            });
        });
    };
    Room.prototype.connect = function () {
        var _this = this;
        if (!this._rpc) {
            this._rpc = new RoomGRPCClient(this, this.connector);
            this._rpc.on('join-reply', function (result) {
                var _a;
                (_a = _this.onjoin) === null || _a === void 0 ? void 0 : _a.call(_this, result);
            });
            this._rpc.on('leave-reply', function (reason) { var _a; return (_a = _this.onleave) === null || _a === void 0 ? void 0 : _a.call(_this, reason); });
            this._rpc.on('peer-event', function (ev) { var _a; return (_a = _this.onpeerevent) === null || _a === void 0 ? void 0 : _a.call(_this, ev); });
            this._rpc.on('message', function (msg) { var _a; return (_a = _this.onmessage) === null || _a === void 0 ? void 0 : _a.call(_this, msg); });
            this._rpc.on('room-info', function (info) { var _a; return (_a = _this.onroominfo) === null || _a === void 0 ? void 0 : _a.call(_this, info); });
            this._rpc.on('disconnect', function (dis) { var _a; return (_a = _this.ondisconnect) === null || _a === void 0 ? void 0 : _a.call(_this, dis); });
        }
    };
    Room.prototype.close = function () {
        if (this._rpc) {
            this._rpc.close();
        }
    };
    return Room;
}());
exports.Room = Room;
/**
 * RoomGRPCClient: The room grpc client
 */
var RoomGRPCClient = /** @class */ (function (_super) {
    __extends(RoomGRPCClient, _super);
    function RoomGRPCClient(service, connector) {
        var _this = _super.call(this) || this;
        _this.connector = connector;
        var client = grpc_web_1.grpc.client(room_rpc.RoomSignal.Signal, connector.grpcClientRpcOptions());
        client.onEnd(function (status, statusMessage, trailers) {
            return connector.onEnd(service, status, statusMessage, trailers);
        });
        client.onHeaders(function (headers) { return connector.onHeaders(service, headers); });
        client.onMessage(function (reply) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
            switch (reply.getPayloadCase()) {
                case room.Reply.PayloadCase.JOIN:
                    _this.emit('join-reply', {
                        success: ((_a = reply.getJoin()) === null || _a === void 0 ? void 0 : _a.getSuccess()) || false,
                        error: ((_b = reply.getJoin()) === null || _b === void 0 ? void 0 : _b.getError()) || { errType: ErrorType.NONE, reason: '' },
                        role: ((_c = reply.getJoin()) === null || _c === void 0 ? void 0 : _c.getRole()) || Role.HOST,
                        room: reply.getJoin()
                            ? {
                                sid: ((_e = (_d = reply.getJoin()) === null || _d === void 0 ? void 0 : _d.getRoom()) === null || _e === void 0 ? void 0 : _e.getSid()) || '',
                                name: ((_g = (_f = reply.getJoin()) === null || _f === void 0 ? void 0 : _f.getRoom()) === null || _g === void 0 ? void 0 : _g.getName()) || '',
                                lock: ((_j = (_h = reply.getJoin()) === null || _h === void 0 ? void 0 : _h.getRoom()) === null || _j === void 0 ? void 0 : _j.getLock()) || false,
                                password: ((_l = (_k = reply.getJoin()) === null || _k === void 0 ? void 0 : _k.getRoom()) === null || _l === void 0 ? void 0 : _l.getPassword()) || '',
                                description: ((_o = (_m = reply.getJoin()) === null || _m === void 0 ? void 0 : _m.getRoom()) === null || _o === void 0 ? void 0 : _o.getDescription()) || '',
                                maxpeers: ((_q = (_p = reply.getJoin()) === null || _p === void 0 ? void 0 : _p.getRoom()) === null || _q === void 0 ? void 0 : _q.getMaxpeers()) || 0
                            }
                            : undefined
                    });
                    break;
                case room.Reply.PayloadCase.LEAVE:
                    var reason = ((_s = (_r = reply.getLeave()) === null || _r === void 0 ? void 0 : _r.getError()) === null || _s === void 0 ? void 0 : _s.getReason()) || 'unkown reason';
                    _this.emit('leave-reply', reason);
                    break;
                case room.Reply.PayloadCase.PEER:
                    var evt = reply.getPeer();
                    var state = PeerState.NONE;
                    switch (evt === null || evt === void 0 ? void 0 : evt.getState()) {
                        case room.PeerState.JOIN:
                            state = PeerState.JOIN;
                            break;
                        case room.PeerState.UPDATE:
                            state = PeerState.UPDATE;
                            break;
                        case room.PeerState.LEAVE:
                            state = PeerState.LEAVE;
                            break;
                    }
                    var peer = {
                        uid: ((_t = evt === null || evt === void 0 ? void 0 : evt.getPeer()) === null || _t === void 0 ? void 0 : _t.getUid()) || '',
                        sid: ((_u = evt === null || evt === void 0 ? void 0 : evt.getPeer()) === null || _u === void 0 ? void 0 : _u.getSid()) || '',
                        displayname: ((_v = evt === null || evt === void 0 ? void 0 : evt.getPeer()) === null || _v === void 0 ? void 0 : _v.getDisplayname()) || '',
                        extrainfo: ((_w = evt === null || evt === void 0 ? void 0 : evt.getPeer()) === null || _w === void 0 ? void 0 : _w.getExtrainfo()) || '',
                        destination: ((_x = evt === null || evt === void 0 ? void 0 : evt.getPeer()) === null || _x === void 0 ? void 0 : _x.getDestination()) || '',
                        role: ((_y = evt === null || evt === void 0 ? void 0 : evt.getPeer()) === null || _y === void 0 ? void 0 : _y.getRole()) || '',
                        protocol: ((_z = evt === null || evt === void 0 ? void 0 : evt.getPeer()) === null || _z === void 0 ? void 0 : _z.getProtocol()) || '',
                        avatar: ((_0 = evt === null || evt === void 0 ? void 0 : evt.getPeer()) === null || _0 === void 0 ? void 0 : _0.getAvatar()) || '',
                        direction: ((_1 = evt === null || evt === void 0 ? void 0 : evt.getPeer()) === null || _1 === void 0 ? void 0 : _1.getDirection()) || '',
                        vendor: ((_2 = evt === null || evt === void 0 ? void 0 : evt.getPeer()) === null || _2 === void 0 ? void 0 : _2.getVendor()) || ''
                    };
                    _this.emit('peer-event', { state: state, peer: peer });
                    break;
                case room.Reply.PayloadCase.MESSAGE:
                    var msg = reply.getMessage();
                    _this.emit('message', {
                        from: (msg === null || msg === void 0 ? void 0 : msg.getFrom()) || '',
                        to: (msg === null || msg === void 0 ? void 0 : msg.getTo()) || '',
                        type: (msg === null || msg === void 0 ? void 0 : msg.getType()) || '',
                        data: (msg === null || msg === void 0 ? void 0 : msg.getPayload()) || {}
                    });
                    break;
                case room.Reply.PayloadCase.ROOM:
                    var info = reply.getRoom() || undefined;
                    _this.emit('room-info', {
                        sid: (info === null || info === void 0 ? void 0 : info.getSid()) || '',
                        name: (info === null || info === void 0 ? void 0 : info.getName()) || '',
                        lock: (info === null || info === void 0 ? void 0 : info.getLock()) || false,
                        password: (info === null || info === void 0 ? void 0 : info.getPassword()) || '',
                        description: (info === null || info === void 0 ? void 0 : info.getDescription()) || '',
                        maxpeers: (info === null || info === void 0 ? void 0 : info.getMaxpeers()) || 0
                    });
                    break;
                case room.Reply.PayloadCase.DISCONNECT:
                    var dis = reply.getDisconnect() || {};
                    _this.emit('disconnect', dis);
                    break;
            }
        });
        _this._client = client;
        _this._client.start(connector.metadata);
        return _this;
    }
    /**
     * join a session/room
     * @date 2021-11-03
     * @param {any} peer:Peer
     * @param {any} password:string|undefined
     * @returns {any}
     */
    RoomGRPCClient.prototype.join = function (peer, password) {
        return __awaiter(this, void 0, void 0, function () {
            var request, join, p;
            var _this = this;
            return __generator(this, function (_a) {
                request = new room.Request();
                join = new room.JoinRequest();
                p = new room.Peer();
                p.setUid(peer.uid);
                p.setSid(peer.sid);
                p.setDisplayname(peer.displayname);
                p.setExtrainfo(peer.extrainfo);
                p.setDestination(peer.destination);
                p.setRole(peer.role);
                p.setProtocol(peer.protocol);
                p.setAvatar(peer.avatar);
                p.setDirection(peer.direction);
                p.setVendor(peer.vendor);
                join.setPeer(p);
                if (password) {
                    join.setPassword(password);
                }
                request.setJoin(join);
                this._client.send(request);
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var handler = function (result) {
                            resolve(result);
                            _this.removeListener('join-reply', handler);
                        };
                        _this.addListener('join-reply', handler);
                    })];
            });
        });
    };
    /**
     * leave a session/room
     * @date 2021-11-03
     * @param {any} sid:string
     * @param {any} uid:string
     * @returns
     */
    RoomGRPCClient.prototype.leave = function (sid, uid) {
        return __awaiter(this, void 0, void 0, function () {
            var request, leave;
            var _this = this;
            return __generator(this, function (_a) {
                request = new room.Request();
                leave = new room.LeaveRequest();
                leave.setSid(sid);
                leave.setUid(uid);
                request.setLeave(leave);
                this._client.send(request);
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var handler = function (reason) {
                            resolve(reason);
                            _this.removeListener('leave-reply', handler);
                        };
                        _this.addListener('leave-reply', handler);
                    })];
            });
        });
    };
    RoomGRPCClient.prototype.mapToObj = function (map) {
        if (!map) {
            return {};
        }
        var obj = {};
        map.forEach(function (value, key) {
            obj[key] = value;
        });
        return obj;
    };
    /**
     * send a message to a session/room
     * @date 2021-11-03
     * @param {any} sid:string
     * @param {any} from:string
     * @param {any} to:string
     * @param {any} mineType:string
     * @param {any} data:Map<string
     * @param {any} any>
     * @returns
     */
    RoomGRPCClient.prototype.sendMessage = function (sid, from, to, mineType, data) {
        return __awaiter(this, void 0, void 0, function () {
            var request, sendMessage, message, obj, buffer;
            return __generator(this, function (_a) {
                request = new room.Request();
                sendMessage = new room.SendMessageRequest();
                message = new room.Message();
                message.setFrom(from);
                message.setTo(to);
                obj = this.mapToObj(data);
                buffer = Uint8Array.from(JSON.stringify(obj), function (c) { return c.charCodeAt(0); });
                message.setType(mineType);
                message.setPayload(buffer);
                sendMessage.setSid(sid);
                sendMessage.setMessage(message);
                request.setSendmessage(sendMessage);
                this._client.send(request);
                return [2 /*return*/];
            });
        });
    };
    /**
     * close client
     * @date 2021-11-03
     * @returns
     */
    RoomGRPCClient.prototype.close = function () {
        this._client.finishSend();
    };
    return RoomGRPCClient;
}(events_1.EventEmitter));
