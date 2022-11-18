"use strict";
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
exports.RTC = exports.MediaType = exports.TrackState = void 0;
var grpc_web_1 = require("@improbable-eng/grpc-web");
var client_1 = require("../client");
var events_1 = require("events");
var sfu_rpc = require("../_library/proto/rtc/rtc_pb_service");
var pb = require("../_library/proto/rtc/rtc_pb");
/**
 * TrackState: track state
 */
var TrackState;
(function (TrackState) {
    TrackState[TrackState["ADD"] = 0] = "ADD";
    TrackState[TrackState["UPDATE"] = 1] = "UPDATE";
    TrackState[TrackState["REMOVE"] = 2] = "REMOVE";
})(TrackState = exports.TrackState || (exports.TrackState = {}));
/**
 * MediaType: media type
 */
var MediaType;
(function (MediaType) {
    MediaType[MediaType["MEDIAUNKNOWN"] = 0] = "MEDIAUNKNOWN";
    MediaType[MediaType["USERMEDIA"] = 1] = "USERMEDIA";
    MediaType[MediaType["SCREENCAPTURE"] = 2] = "SCREENCAPTURE";
    MediaType[MediaType["CAVANS"] = 3] = "CAVANS";
    MediaType[MediaType["STREAMING"] = 4] = "STREAMING";
    MediaType[MediaType["VOIP"] = 5] = "VOIP";
})(MediaType = exports.MediaType || (exports.MediaType = {}));
/**
 * RTC: rtc class
 */
var RTC = /** @class */ (function () {
    /**
     * constructor
     * @date 2021-11-03
     * @param {any} connector:Connector
     * @param {any} config?:Configuration
     * @returns
     */
    function RTC(connector, config) {
        this.name = 'rtc';
        this.config = config;
        this.connected = false;
        this.connector = connector;
        this.connector.registerService(this);
        this.connect();
    }
    /**
     * join rtc session
     * @date 2021-11-03
     * @param {any} sid:string
     * @param {any} uid:string
     * @param {any} config:JoinConfig|undefined
     * @returns
     */
    RTC.prototype.join = function (sid, uid, config) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                this._sig.config = config;
                return [2 /*return*/, (_a = this._rtc) === null || _a === void 0 ? void 0 : _a.join(sid, uid)];
            });
        });
    };
    /**
     * leave session
     * @date 2021-11-03
     * @returns
     */
    RTC.prototype.leave = function () {
        var _a;
        return (_a = this._rtc) === null || _a === void 0 ? void 0 : _a.leave();
    };
    /**
     * get pub stats
     * @date 2021-11-03
     * @param {any} selector?:MediaStreamTrack
     * @returns {any}
     */
    RTC.prototype.getPubStats = function (selector) {
        var _a;
        return (_a = this._rtc) === null || _a === void 0 ? void 0 : _a.getPubStats(selector);
    };
    /**
     * get sub stats
     * @date 2021-11-03
     * @param {any} selector?:MediaStreamTrack
     * @returns {any}
     */
    RTC.prototype.getSubStats = function (selector) {
        var _a;
        return (_a = this._rtc) === null || _a === void 0 ? void 0 : _a.getSubStats(selector);
    };
    /**
     * publish local stream
     * @date 2021-11-03
     * @param {any} stream:LocalStream
     * @returns {any}
     */
    RTC.prototype.publish = function (stream) {
        var _a;
        this._sig.buildTrackInfos(stream);
        (_a = this._rtc) === null || _a === void 0 ? void 0 : _a.publish(stream);
    };
    /**
     * subscribe
     * @date 2021-11-03
     * @param {any} trackInfos:Subscription[]
     * @returns {any}
     */
    RTC.prototype.subscribe = function (trackInfos) {
        var _a;
        return (_a = this._sig) === null || _a === void 0 ? void 0 : _a.subscribe(trackInfos);
    };
    /**
     * createDataChannel
     * @date 2021-11-03
     * @param {any} label:string
     * @returns {any}
     */
    RTC.prototype.createDataChannel = function (label) {
        var _a;
        return (_a = this._rtc) === null || _a === void 0 ? void 0 : _a.createDataChannel(label);
    };
    /**
     * connect to signal
     * @date 2021-11-03
     * @returns {any}
     */
    RTC.prototype.connect = function () {
        var _this = this;
        if (!this._sig) {
            this._sig = new RTCGRPCSignal(this, this.connector);
        }
        if (!this._rtc) {
            this._rtc = new client_1["default"](this._sig, this === null || this === void 0 ? void 0 : this.config);
            this._rtc.ontrack = function (track, stream) {
                var _a;
                // TODO: Attach track info to RemoteStream.
                (_a = _this.ontrack) === null || _a === void 0 ? void 0 : _a.call(_this, track, stream);
            };
            this._rtc.ondatachannel = function (ev) { var _a; return (_a = _this.ondatachannel) === null || _a === void 0 ? void 0 : _a.call(_this, ev); };
            this._rtc.onspeaker = function (ev) { var _a; return (_a = _this.onspeaker) === null || _a === void 0 ? void 0 : _a.call(_this, ev); };
            this._sig.ontrackevent = function (ev) {
                var _a;
                // TODO: Attach RemoteStream info to track event.
                (_a = _this.ontrackevent) === null || _a === void 0 ? void 0 : _a.call(_this, ev);
            };
        }
    };
    /**
     * close rtc
     * @date 2021-11-03
     * @returns {any}
     */
    RTC.prototype.close = function () {
        if (this._rtc) {
            this._rtc.close();
        }
    };
    return RTC;
}());
exports.RTC = RTC;
/**
 * RTCGRPCSignal: rtc grpc signal
 */
var RTCGRPCSignal = /** @class */ (function () {
    function RTCGRPCSignal(service, connector) {
        var _this = this;
        this._event = new events_1.EventEmitter();
        this.connector = connector;
        var client = grpc_web_1.grpc.client(sfu_rpc.RTC.Signal, this.connector.grpcClientRpcOptions());
        client.onEnd(function (status, statusMessage, trailers) {
            return connector.onEnd(service, status, statusMessage, trailers);
        });
        client.onHeaders(function (headers) { return connector.onHeaders(service, headers); });
        client.onMessage(function (reply) {
            var _a;
            //console.log("rtc.ts,line 258,reply:",reply);
            switch (reply.getPayloadCase()) {
                case pb.Reply.PayloadCase.JOIN:
                    var result = reply.getJoin();
                    console.log("rtc.ts,line 261,pb.Reply.PayloadCase.JOIN:");
                    console.log(result);
                    _this._event.emit('join-reply', result);
                    break;
                case pb.Reply.PayloadCase.DESCRIPTION:
                    var desc = reply.getDescription();
                    console.log("rtc.ts,line 267,pb.Reply.PayloadCase.DESCRIPTION:");
                    console.log(desc);
                    if ((desc === null || desc === void 0 ? void 0 : desc.getType()) === 'offer') {
                        if (_this.onnegotiate)
                            _this.onnegotiate({ sdp: desc.getSdp(), type: 'offer' });
                    }
                    else if ((desc === null || desc === void 0 ? void 0 : desc.getType()) === 'answer') {
                        _this._event.emit('description', { sdp: desc.getSdp(), type: 'answer' });
                    }
                    if ((desc === null || desc === void 0 ? void 0 : desc.getTrackinfosList()) && (desc === null || desc === void 0 ? void 0 : desc.getTrackinfosList().length) > 0) {
                        // TODO: process metadata.
                    }
                    break;
                case pb.Reply.PayloadCase.TRICKLE:
                    var pbTrickle = reply.getTrickle();
                    //console.log("rtc.ts,line 280,pb.Reply.PayloadCase.TRICKLE:")
                    //console.log(pbTrickle);         
                    if ((pbTrickle === null || pbTrickle === void 0 ? void 0 : pbTrickle.getInit()) !== undefined) {
                        var candidate = JSON.parse(pbTrickle.getInit());
                        var trickle = { target: pbTrickle.getTarget(), candidate: candidate };
                        console.log(trickle);
                        if (_this.ontrickle)
                            _this.ontrickle(trickle);
                    }
                    break;
                case pb.Reply.PayloadCase.TRACKEVENT:
                    {
                        var evt = reply.getTrackevent();
                        console.log("rtc.ts,line 291,pb.Reply.PayloadCase.TRACKEVENT:");
                        console.log(evt);
                        var state = TrackState.ADD;
                        switch (evt === null || evt === void 0 ? void 0 : evt.getState()) {
                            case pb.TrackEvent.State.ADD:
                                state = TrackState.ADD;
                                break;
                            case pb.TrackEvent.State.UPDATE:
                                state = TrackState.UPDATE;
                                break;
                            case pb.TrackEvent.State.REMOVE:
                                state = TrackState.REMOVE;
                                break;
                        }
                        var tracks_1 = Array();
                        var uid = (evt === null || evt === void 0 ? void 0 : evt.getUid()) || '';
                        evt === null || evt === void 0 ? void 0 : evt.getTracksList().forEach(function (rtcTrack) {
                            tracks_1.push({
                                id: rtcTrack.getId(),
                                kind: rtcTrack.getKind(),
                                label: rtcTrack.getLabel(),
                                stream_id: rtcTrack.getStreamid(),
                                muted: rtcTrack.getMuted(),
                                type: rtcTrack.getType() || MediaType.MEDIAUNKNOWN,
                                layer: rtcTrack.getLayer(),
                                width: rtcTrack.getWidth() || 0,
                                height: rtcTrack.getHeight() || 0,
                                frame_rate: rtcTrack.getFramerate() || 0
                            });
                        });
                        (_a = _this.ontrackevent) === null || _a === void 0 ? void 0 : _a.call(_this, { state: state, tracks: tracks_1, uid: uid });
                    }
                    break;
                case pb.Reply.PayloadCase.SUBSCRIPTION:
                    var subscription = reply.getSubscription();
                    console.log("rtc.ts,line 326,pb.Reply.PayloadCase.SUBSCRIPTION::");
                    console.log(subscription);
                    _this._event.emit('subscription', {
                        success: (subscription === null || subscription === void 0 ? void 0 : subscription.getSuccess()) || false,
                        error: subscription === null || subscription === void 0 ? void 0 : subscription.getError()
                    });
                case pb.Reply.PayloadCase.ERROR:
                    break;
            }
        });
        this._client = client;
        this._client.start(this.connector.metadata);
    }
    Object.defineProperty(RTCGRPCSignal.prototype, "config", {
        set: function (config) {
            this._config = config;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * join a session
     * @date 2021-11-03
     * @param {any} sid:string
     * @param {any} uid:null|string
     * @param {any} offer:RTCSessionDescriptionInit
     * @returns {any}
     */
    RTCGRPCSignal.prototype.join = function (sid, uid, offer) {
        var _this = this;
        var _a, _b, _c;
        var request = new pb.Request();
        var join = new pb.JoinRequest();
        join.setSid(sid);
        join.setUid(uid || '');
        if (this._config) {
            join.getConfigMap().set('NoPublish', ((_a = this._config) === null || _a === void 0 ? void 0 : _a.no_publish) ? 'true' : 'false');
            join.getConfigMap().set('NoSubscribe', ((_b = this._config) === null || _b === void 0 ? void 0 : _b.no_subscribe) ? 'true' : 'false');
            join.getConfigMap().set('NoAutoSubscribe', ((_c = this._config) === null || _c === void 0 ? void 0 : _c.no_auto_subscribe) ? 'true' : 'false');
        }
        var dest = new pb.SessionDescription();
        dest.setSdp(offer.sdp || '');
        dest.setType(offer.type || '');
        dest.setTarget(pb.Target.PUBLISHER);
        if (this._tracksInfos) {
            dest.setTrackinfosList(this._tracksInfos);
        }
        join.setDescription(dest);
        console.log("rtc.ts,line,368,join(),", join);
        request.setJoin(join);
        this._client.send(request);
        return new Promise(function (resolve, reject) {
            var handler = function (result) {
                var _a;
                console.log("rtc.ts,line 372,handler", result);
                if (result.getSuccess()) {
                    resolve({
                        sdp: result.getDescription().getSdp(),
                        type: result.getDescription().getType()
                    });
                }
                else {
                    reject((_a = result.getError()) === null || _a === void 0 ? void 0 : _a.toObject());
                }
                _this._event.removeListener('join-reply', handler);
            };
            _this._event.addListener('join-reply', handler);
        });
    };
    /**
     * send trickle
     * @date 2021-11-03
     * @param {any} trickle:Trickle
     * @returns {any}
     */
    RTCGRPCSignal.prototype.trickle = function (trickle) {
        var request = new pb.Request();
        var pbTrickle = new pb.Trickle();
        pbTrickle.setInit(JSON.stringify(trickle.candidate));
        request.setTrickle(pbTrickle);
        this._client.send(request);
    };
    /**
     * send offer request
     * @date 2021-11-03
     * @param {any} offer:RTCSessionDescriptionInit
     * @returns {any}
     */
    RTCGRPCSignal.prototype.offer = function (offer) {
        var _this = this;
        var request = new pb.Request();
        var dest = new pb.SessionDescription();
        dest.setSdp(offer.sdp || '');
        dest.setType(offer.type || '');
        dest.setTarget(pb.Target.PUBLISHER);
        if (this._tracksInfos) {
            dest.setTrackinfosList(this._tracksInfos);
        }
        request.setDescription(dest);
        this._client.send(request);
        return new Promise(function (resolve, reject) {
            var handler = function (desc) {
                resolve(desc);
                _this._event.removeListener('description', handler);
            };
            _this._event.addListener('description', handler);
        });
    };
    /**
     * send answer request
     * @date 2021-11-03
     * @param {any} answer:RTCSessionDescriptionInit
     * @returns {any}
     */
    RTCGRPCSignal.prototype.answer = function (answer) {
        var request = new pb.Request();
        var desc = new pb.SessionDescription();
        desc.setSdp(answer.sdp || '');
        desc.setType(answer.type || '');
        desc.setTarget(pb.Target.SUBSCRIBER);
        request.setDescription(desc);
        this._client.send(request);
    };
    /**
     * close client
     * @date 2021-11-03
     * @returns {any}
     */
    RTCGRPCSignal.prototype.close = function () {
        var _a;
        (_a = this._client) === null || _a === void 0 ? void 0 : _a.close();
    };
    /**
     * subscribe
     * @date 2021-11-03
     * @param {any} infos:Subscription[]
     * @returns {any}
     */
    RTCGRPCSignal.prototype.subscribe = function (infos) {
        var _this = this;
        var request = new pb.Request();
        var subscription = new pb.SubscriptionRequest();
        var tracksInfos = Array();
        infos.forEach(function (t) {
            var trackInfo = new pb.Subscription();
            trackInfo.setTrackid(t.track_id);
            trackInfo.setMute(t.muted);
            trackInfo.setLayer(t.layer);
            trackInfo.setSubscribe(t.subscribe);
            tracksInfos.push(trackInfo);
        });
        subscription.setSubscriptionsList(tracksInfos);
        request.setSubscription(subscription);
        this._client.send(request);
        return new Promise(function (resolve, reject) {
            var handler = function (res) {
                resolve(res);
                _this._event.removeListener('subscription', handler);
            };
            _this._event.addListener('subscription', handler);
        });
    };
    /**
     * build TrackInfos
     * @date 2021-11-03
     * @param {any} stream:LocalStream
     * @returns {any}
     */
    RTCGRPCSignal.prototype.buildTrackInfos = function (stream) {
        var tracks = stream.getTracks();
        var trackInfos = new Array();
        for (var _i = 0, tracks_2 = tracks; _i < tracks_2.length; _i++) {
            var track = tracks_2[_i];
            var trackInfo = new pb.TrackInfo();
            trackInfo.setId(track.id);
            trackInfo.setKind(track.kind);
            trackInfo.setLabel(track.label);
            trackInfo.setStreamid(stream.id);
            trackInfo.setMuted(!track.enabled);
            trackInfo.setType(MediaType.USERMEDIA);
            trackInfos.push(trackInfo);
        }
        this._tracksInfos = trackInfos;
    };
    return RTCGRPCSignal;
}());
