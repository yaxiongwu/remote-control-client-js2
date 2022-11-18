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
exports.Transport = void 0;
var stream_1 = require("./stream");
var API_CHANNEL = 'ion-sfu';
var ERR_NO_SESSION = 'no active session, join first';
var Role;
(function (Role) {
    Role[Role["pub"] = 0] = "pub";
    Role[Role["sub"] = 1] = "sub";
})(Role || (Role = {}));
var Transport = /** @class */ (function () {
    function Transport(role, signal, config) {
        var _this = this;
        this.signal = signal;
        this.pc = new RTCPeerConnection(config);
        this.candidates = [];
        if (role === Role.pub) {
            console.log("client.ts,line 48,this.pc.createDataChannel(API_CHANNEL)");
            this.pc.createDataChannel(API_CHANNEL);
            //const dataChannel=this.pc.createDataChannel(API_CHANNEL);
            /*
            吴亚雄添加
            双方都没有保存createDataChannel后的channel，也没有处理，
           
            dataChannel.onmessage =(ev)=>{
              console.log("client.ts,line 51,got data:"+ev.data)
            }
       */
        }
        this.pc.onicecandidate = function (_a) {
            var candidate = _a.candidate;
            if (candidate) {
                console.log("client.ts,line 70,pc.onicecandidate:%o",candidate);                
                _this.signal.trickle({ target: role, candidate: candidate });
            }
        };
        //吴亚雄添加
        // this.pc.ondatachannel=(ev)=>{
        //    console.log("client.ts,line 58,pc.ondatachannel,",ev)
        //    ev.channel.onmessage = (e) => {      
        //       console.log("client.ts,line 61,ev.channel.onmessage msg:"+e.data); 
        //     };
        //   ev.channel.onopen=(e1) =>{
        //     console.log("client.ts,line 64,pc.onopen)        
        //   }
        // }
        // 
        this.pc.oniceconnectionstatechange = function (e) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("client.ts,line 67,pc.oniceconnectionstatechange ", this.pc.iceConnectionState, e);
                if (this.pc.iceConnectionState === 'disconnected') {
                    if (this.pc.restartIce !== undefined) {
                        // this will trigger onNegotiationNeeded
                        // this.pc.restartIce();
                    }
                }
                return [2 /*return*/];
            });
        }); };
    }
    return Transport;
}());
exports.Transport = Transport;
var Client = /** @class */ (function () {
    function Client(signal, config) {
        if (config === void 0) { config = {
            codec: 'vp8',
            iceServers: [
                {
                    urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302']
                },
            ]
        }; }
        this.signal = signal;
        this.config = config;
        signal.onnegotiate = this.negotiate.bind(this);
        signal.ontrickle = this.trickle.bind(this);
    }
    Client.prototype.join = function (sid, uid) {
        return __awaiter(this, void 0, void 0, function () {
            var apiReady, offer, answer;
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("client.ts,line 105,join");
                        this.transports = (_a = {},
                            _a[Role.pub] = new Transport(Role.pub, this.signal, this.config),
                            _a[Role.sub] = new Transport(Role.sub, this.signal, this.config),
                            _a);
                        this.transports[Role.sub].pc.ontrack = function (ev) {
                            var stream = ev.streams[0];
                            var remote = (0, stream_1.makeRemote)(stream, _this.transports[Role.sub]);
                            if (_this.ontrack) {
                                _this.ontrack(ev.track, remote);
                            }
                            //连接成功后，从pub发送音频
                            // const localMedia = navigator.mediaDevices.getUserMedia({
                            //   audio: true,       
                            // });
                            // this.publish(localMedia);
                        };
                        apiReady = new Promise(function (resolve) {
                            _this.transports[Role.sub].pc.ondatachannel = function (ev) {
                                console.log("this.transports![Role.sub].pc.ondatachannel," + ev);
                                if (ev.channel.label === API_CHANNEL) {
                                    _this.transports[Role.sub].api = ev.channel;
                                    _this.transports[Role.pub].api = ev.channel;
                                    ev.channel.onmessage = function (e) {
                                        try {
                                            console.log("client.ts,line 126,API-CHANNEL get msg:" + e.data);
                                            var msg = JSON.parse(e.data);
                                            _this.processChannelMessage(msg);
                                        }
                                        catch (err) {
                                            /* tslint:disable-next-line:no-console */
                                            console.error(err);
                                        }
                                    };
                                    resolve();
                                    return;
                                }
                                if (_this.ondatachannel) {
                                    _this.ondatachannel(ev);
                                }
                            };
                        });
                        return [4 /*yield*/, this.transports[Role.pub].pc.createOffer()];
                    case 1:
                        offer = _b.sent();
                        console.log("client.ts line 142,offer: ", offer);
                        //console.log(offer)
                        return [4 /*yield*/, this.transports[Role.pub].pc.setLocalDescription(offer)];
                    case 2:
                        //console.log(offer)
                        _b.sent();
                        return [4 /*yield*/, this.signal.join(sid, uid, offer)];
                    case 3:
                        answer = _b.sent();
                        console.log("client.ts,line 146,answer: ", answer);
                        return [4 /*yield*/, this.transports[Role.pub].pc.setRemoteDescription(answer)];
                    case 4:
                        _b.sent();
                        this.transports[Role.pub].candidates.forEach(function (c) { return _this.transports[Role.pub].pc.addIceCandidate(c); });
                        this.transports[Role.pub].pc.onnegotiationneeded = this.onNegotiationNeeded.bind(this);
                        return [2 /*return*/, apiReady];
                }
            });
        });
    };
    Client.prototype.leave = function () {
        if (this.transports) {
            Object.values(this.transports).forEach(function (t) { return t.pc.close(); });
            delete this.transports;
        }
    };
    Client.prototype.getPubStats = function (selector) {
        if (!this.transports) {
            throw Error(ERR_NO_SESSION);
        }
        return this.transports[Role.pub].pc.getStats(selector);
    };
    Client.prototype.getSubStats = function (selector) {
        if (!this.transports) {
            throw Error(ERR_NO_SESSION);
        }
        return this.transports[Role.sub].pc.getStats(selector);
    };
    Client.prototype.publish = function (stream, encodingParams) {
        if (!this.transports) {
            throw Error(ERR_NO_SESSION);
        }
        stream.publish(this.transports[Role.pub], encodingParams);
    };
    Client.prototype.restartIce = function () {
        this.renegotiate(true);
    };
    Client.prototype.createDataChannel = function (label) {
        if (!this.transports) {
            throw Error(ERR_NO_SESSION);
        }
        return this.transports[Role.pub].pc.createDataChannel(label);
    };
    Client.prototype.close = function () {
        if (this.transports) {
            Object.values(this.transports).forEach(function (t) { return t.pc.close(); });
        }
        this.signal.close();
    };
    Client.prototype.trickle = function (_a) {
        var candidate = _a.candidate, target = _a.target;
        if (!this.transports) {
            throw Error(ERR_NO_SESSION);
        }
        // console.log("client.ts,line 204,0:pub,1:sub", candidate,target);
        if (this.transports[target].pc.remoteDescription) {
            this.transports[target].pc.addIceCandidate(candidate);
        }
        else {
            this.transports[target].candidates.push(candidate);
        }
    };
    Client.prototype.negotiate = function (description) {
        return __awaiter(this, void 0, void 0, function () {
            var answer, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.transports) {
                            throw Error(ERR_NO_SESSION);
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, this.transports[Role.sub].pc.setRemoteDescription(description)];
                    case 2:
                        _a.sent();
                        //this.transports[Role.sub].hasRemoteDescription = true;
                        this.transports[Role.sub].candidates.forEach(function (c) { return _this.transports[Role.sub].pc.addIceCandidate(c); });
                        this.transports[Role.sub].candidates = [];
                        return [4 /*yield*/, this.transports[Role.sub].pc.createAnswer()];
                    case 3:
                        answer = _a.sent();
                        console.log("client.ts,line 249,answer:");
                        console.log(answer);
                        return [4 /*yield*/, this.transports[Role.sub].pc.setLocalDescription(answer)];
                    case 4:
                        _a.sent();
                        this.signal.answer(answer);
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _a.sent();
                        /* tslint:disable-next-line:no-console */
                        console.error(err_1);
                        if (this.onerrnegotiate)
                            this.onerrnegotiate(Role.sub, err_1, description, answer);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Client.prototype.onNegotiationNeeded = function () {
        this.renegotiate(false);
    };
    Client.prototype.renegotiate = function (iceRestart) {
        return __awaiter(this, void 0, void 0, function () {
            var offer, answer, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.transports) {
                            throw Error(ERR_NO_SESSION);
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, this.transports[Role.pub].pc.createOffer({ iceRestart: iceRestart })];
                    case 2:
                        offer = _a.sent();
                        return [4 /*yield*/, this.transports[Role.pub].pc.setLocalDescription(offer)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.signal.offer(offer)];
                    case 4:
                        answer = _a.sent();
                        return [4 /*yield*/, this.transports[Role.pub].pc.setRemoteDescription(answer)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        err_2 = _a.sent();
                        /* tslint:disable-next-line:no-console */
                        console.error(err_2);
                        if (this.onerrnegotiate)
                            this.onerrnegotiate(Role.pub, err_2, offer, answer);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Client.prototype.processChannelMessage = function (msg) {
        console.log("client.ts,line 257,API-CHANNEL get msg:" + msg);
        if (msg.method !== undefined && msg.params !== undefined) {
            switch (msg.method) {
                case 'audioLevels':
                    if (this.onspeaker) {
                        this.onspeaker(msg.params);
                    }
                    break;
                case 'activeLayer':
                    if (this.onactivelayer) {
                        this.onactivelayer(msg.params);
                    }
                    break;
                default:
                // do nothing
            }
        }
        else {
            // legacy channel message - payload contains audio levels
            if (this.onspeaker) {
                this.onspeaker(msg);
            }
        }
    };
    return Client;
}());
exports["default"] = Client;
