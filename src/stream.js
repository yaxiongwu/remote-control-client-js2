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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.makeRemote = exports.LocalStream = exports.VideoConstraints = void 0;
var resolutions = ['qvga', 'vga', 'shd', 'hd', 'fhd', 'qhd'];
exports.VideoConstraints = {
    qvga: {
        resolution: {
            width: { ideal: 320 },
            height: { ideal: 180 },
            frameRate: {
                ideal: 15,
                max: 30
            }
        },
        encodings: {
            maxBitrate: 150000,
            maxFramerate: 15.0
        }
    },
    vga: {
        resolution: {
            width: { ideal: 640 },
            height: { ideal: 360 },
            frameRate: {
                ideal: 30,
                max: 60
            }
        },
        encodings: {
            maxBitrate: 500000,
            maxFramerate: 30.0
        }
    },
    shd: {
        resolution: {
            width: { ideal: 960 },
            height: { ideal: 540 },
            frameRate: {
                ideal: 30,
                max: 60
            }
        },
        encodings: {
            maxBitrate: 1200000,
            maxFramerate: 30.0
        }
    },
    hd: {
        resolution: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: {
                ideal: 30,
                max: 60
            }
        },
        encodings: {
            maxBitrate: 2500000,
            maxFramerate: 30.0
        }
    },
    fhd: {
        resolution: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: {
                ideal: 30,
                max: 60
            }
        },
        encodings: {
            maxBitrate: 4000000,
            maxFramerate: 30.0
        }
    },
    qhd: {
        resolution: {
            width: { ideal: 2560 },
            height: { ideal: 1440 },
            frameRate: {
                ideal: 30,
                max: 60
            }
        },
        encodings: {
            maxBitrate: 8000000,
            maxFramerate: 30.0
        }
    }
};
var defaults = {
    resolution: 'hd',
    codec: 'vp8',
    audio: true,
    video: true,
    simulcast: false
};
var LocalStream = /** @class */ (function (_super) {
    __extends(LocalStream, _super);
    function LocalStream(stream, constraints) {
        var _this = _super.call(this, stream) || this;
        _this.constraints = constraints;
        return _this;
    }
    LocalStream.getUserMedia = function (constraints) {
        if (constraints === void 0) { constraints = defaults; }
        return __awaiter(this, void 0, void 0, function () {
            var stream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigator.mediaDevices.getUserMedia({
                            audio: LocalStream.computeAudioConstraints(__assign(__assign({}, defaults), constraints)),
                            video: LocalStream.computeVideoConstraints(__assign(__assign({}, defaults), constraints))
                        })];
                    case 1:
                        stream = _a.sent();
                        return [2 /*return*/, new LocalStream(stream, __assign(__assign({}, defaults), constraints))];
                }
            });
        });
    };
    LocalStream.getDisplayMedia = function (constraints) {
        if (constraints === void 0) { constraints = {
            codec: 'vp8',
            resolution: 'hd',
            audio: false,
            video: true,
            simulcast: false
        }; }
        return __awaiter(this, void 0, void 0, function () {
            var stream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigator.mediaDevices.getDisplayMedia(constraints)];
                    case 1:
                        stream = _a.sent();
                        return [2 /*return*/, new LocalStream(stream, __assign(__assign({}, defaults), constraints))];
                }
            });
        });
    };
    LocalStream.computeAudioConstraints = function (constraints) {
        return constraints.audio;
    };
    LocalStream.computeVideoConstraints = function (constraints) {
        if (constraints.video instanceof Object) {
            return constraints.video;
        }
        else if (constraints.video && constraints.resolution) {
            return __assign({}, exports.VideoConstraints[constraints.resolution].resolution);
        }
        return constraints.video;
    };
    LocalStream.prototype.getTrack = function (kind) {
        var tracks;
        if (kind === 'video') {
            tracks = this.getVideoTracks();
            return tracks.length > 0 ? this.getVideoTracks()[0] : undefined;
        }
        tracks = this.getAudioTracks();
        return tracks.length > 0 ? this.getAudioTracks()[0] : undefined;
    };
    LocalStream.prototype.getNewTrack = function (kind) {
        return __awaiter(this, void 0, void 0, function () {
            var stream;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, navigator.mediaDevices.getUserMedia((_a = {},
                            _a[kind] = kind === 'video'
                                ? LocalStream.computeVideoConstraints(this.constraints)
                                : LocalStream.computeAudioConstraints(this.constraints),
                            _a))];
                    case 1:
                        stream = _b.sent();
                        return [2 /*return*/, stream.getTracks()[0]];
                }
            });
        });
    };
    LocalStream.prototype.publishTrack = function (track) {
        if (this.pc) {
            var init = {
                streams: [this],
                direction: 'sendonly'
            };
            if (track.kind === 'video') {
                if (this.encodingParams) {
                    init.sendEncodings = this.encodingParams;
                }
                else if (this.constraints.simulcast) {
                    var idx = resolutions.indexOf(this.constraints.resolution);
                    var encodings = [
                        {
                            rid: 'f',
                            maxBitrate: exports.VideoConstraints[resolutions[idx]].encodings.maxBitrate,
                            maxFramerate: exports.VideoConstraints[resolutions[idx]].encodings.maxFramerate
                        },
                    ];
                    if (idx - 1 >= 0) {
                        encodings.push({
                            rid: 'h',
                            scaleResolutionDownBy: 2.0,
                            maxBitrate: exports.VideoConstraints[resolutions[idx - 1]].encodings.maxBitrate,
                            maxFramerate: exports.VideoConstraints[resolutions[idx - 1]].encodings.maxFramerate
                        });
                    }
                    if (idx - 2 >= 0) {
                        encodings.push({
                            rid: 'q',
                            scaleResolutionDownBy: 4.0,
                            maxBitrate: exports.VideoConstraints[resolutions[idx - 2]].encodings.maxBitrate,
                            maxFramerate: exports.VideoConstraints[resolutions[idx - 2]].encodings.maxFramerate
                        });
                    }
                    init.sendEncodings = encodings;
                }
                else {
                    init.sendEncodings = [exports.VideoConstraints[this.constraints.resolution].encodings];
                }
            }
            var transceiver = this.pc.addTransceiver(track, init);
            this.setPreferredCodec(transceiver, track.kind);
        }
    };
    LocalStream.prototype.setPreferredCodec = function (transceiver, kind) {
        var _this = this;
        if ('setCodecPreferences' in transceiver) {
            var cap = RTCRtpSender.getCapabilities(kind);
            if (!cap)
                return;
            var selCodec = void 0;
            if (this.constraints.preferredCodecProfile && kind === 'video') {
                var allCodecProfiles = cap.codecs.filter(function (c) { return c.mimeType.toLowerCase() === "video/".concat(_this.constraints.codec.toLowerCase()); });
                if (!allCodecProfiles) {
                    return;
                }
                selCodec = allCodecProfiles.find(function (c) { var _a; return c.sdpFmtpLine && ((_a = c.sdpFmtpLine) === null || _a === void 0 ? void 0 : _a.indexOf("profile-level-id=".concat(_this.constraints.preferredCodecProfile))) >= 0; });
                if (!selCodec) {
                    // get first one
                    selCodec = allCodecProfiles[0];
                }
            }
            else {
                selCodec = cap.codecs.find(function (c) {
                    return c.mimeType.toLowerCase() === "video/".concat(_this.constraints.codec.toLowerCase()) ||
                        c.mimeType.toLowerCase() === "audio/opus";
                });
            }
            if (selCodec) {
                transceiver.setCodecPreferences([selCodec]);
            }
        }
    };
    LocalStream.prototype.updateTrack = function (next, prev) {
        var _this = this;
        this.addTrack(next);
        // If published, replace published track with track from new device
        if (prev) {
            this.removeTrack(prev);
            prev.stop();
            if (this.pc) {
                this.pc.getSenders().forEach(function (sender) { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        if (((_a = sender === null || sender === void 0 ? void 0 : sender.track) === null || _a === void 0 ? void 0 : _a.kind) === next.kind) {
                            (_b = sender.track) === null || _b === void 0 ? void 0 : _b.stop();
                            sender.replaceTrack(next);
                        }
                        return [2 /*return*/];
                    });
                }); });
            }
        }
        else {
            if (this.pc) {
                this.publishTrack(next);
            }
        }
    };
    LocalStream.prototype.initAudioEmptyTrack = function () {
        // @ts-ignore
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        var ctx = new AudioContext();
        var oscillator = ctx.createOscillator();
        oscillator.frequency.setValueAtTime(20000, ctx.currentTime);
        var dst = oscillator.connect(ctx.createMediaStreamDestination());
        oscillator.start();
        return dst.stream.getAudioTracks()[0];
    };
    LocalStream.prototype.initVideoEmptyTrack = function (width, height) {
        var _a;
        var canvas = Object.assign(document.createElement('canvas'), { width: width, height: height });
        (_a = canvas.getContext('2d')) === null || _a === void 0 ? void 0 : _a.fillRect(0, 0, width, height);
        var stream = canvas.captureStream();
        return stream.getVideoTracks()[0];
    };
    LocalStream.prototype.publish = function (transport, encodingParams) {
        this.pc = transport.pc;
        this.api = transport.api;
        this.encodingParams = encodingParams;
        this.getTracks().forEach(this.publishTrack.bind(this));
    };
    LocalStream.prototype.unpublish = function () {
        var _this = this;
        if (this.pc) {
            var tracks_1 = this.getTracks();
            this.pc.getSenders().forEach(function (s) {
                if (s.track && tracks_1.includes(s.track)) {
                    _this.pc.removeTrack(s);
                }
            });
        }
    };
    LocalStream.prototype.switchDevice = function (kind, deviceId) {
        return __awaiter(this, void 0, void 0, function () {
            var prev, next;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.constraints = __assign(__assign({}, this.constraints), (_a = {}, _a[kind] = this.constraints[kind] instanceof Object
                            ? __assign(__assign({}, this.constraints[kind]), { deviceId: deviceId }) : { deviceId: deviceId }, _a));
                        prev = this.getTrack(kind);
                        // Firefox/Safari have issues when multiple input devices are used by same origin. We need to stop previous track before creating new one.
                        if (prev)
                            prev.stop();
                        return [4 /*yield*/, this.getNewTrack(kind)];
                    case 1:
                        next = _b.sent();
                        this.updateTrack(next, prev);
                        return [2 /*return*/];
                }
            });
        });
    };
    LocalStream.prototype.mute = function (kind) {
        var track = this.getTrack(kind);
        if (track && this.constraints.sendEmptyOnMute) {
            var emptyTrack = kind === 'audio'
                ? this.initAudioEmptyTrack()
                : this.initVideoEmptyTrack((track === null || track === void 0 ? void 0 : track.getSettings().width) || 640, (track === null || track === void 0 ? void 0 : track.getSettings().height) || 360);
            emptyTrack.enabled = false;
            this.updateTrack(emptyTrack, track);
            return;
        }
        if (track) {
            track.stop();
        }
    };
    LocalStream.prototype.unmute = function (kind) {
        return __awaiter(this, void 0, void 0, function () {
            var prev, track;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prev = this.getTrack(kind);
                        return [4 /*yield*/, this.getNewTrack(kind)];
                    case 1:
                        track = _a.sent();
                        this.updateTrack(track, prev);
                        return [2 /*return*/];
                }
            });
        });
    };
    LocalStream.prototype.enableLayers = function (layers) {
        return __awaiter(this, void 0, void 0, function () {
            var call, callStr, layerValues;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        call = {
                            streamId: this.id,
                            layers: layers
                        };
                        callStr = JSON.stringify(call);
                        if (this.api) {
                            if (this.api.readyState !== 'open') {
                                // queue call if we aren't open yet
                                this.api.onopen = function () { var _a; return (_a = _this.api) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify(call)); };
                            }
                            else {
                                this.api.send(JSON.stringify(call));
                            }
                        }
                        layerValues = ['high', 'medium', 'low'];
                        return [4 /*yield*/, Promise.all(layerValues.map(function (layer) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.updateMediaEncodingParams({ active: layers.includes(layer) }, layer)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LocalStream.prototype.updateMediaEncodingParams = function (encodingParams, layer) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var tracks;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.pc)
                            return [2 /*return*/];
                        tracks = this.getTracks();
                        return [4 /*yield*/, Promise.all((_a = this.pc) === null || _a === void 0 ? void 0 : _a.getSenders().filter(function (sender) { return sender.track && tracks.includes(sender.track); }).map(function (sender) { return __awaiter(_this, void 0, void 0, function () {
                                var params, idx, rid_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            params = sender.getParameters();
                                            if (!params.encodings) {
                                                params.encodings = [{}];
                                            }
                                            idx = 0;
                                            if (this.constraints.simulcast && layer) {
                                                rid_1 = layer === 'high' ? 'f' : layer === 'medium' ? 'h' : 'q';
                                                idx = params.encodings.findIndex(function (encoding) { return encoding.rid === rid_1; });
                                                if (params.encodings.length < idx + 1)
                                                    return [2 /*return*/];
                                            }
                                            params.encodings[idx] = __assign(__assign({}, params.encodings[idx]), encodingParams);
                                            return [4 /*yield*/, sender.setParameters(params)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return LocalStream;
}(MediaStream));
exports.LocalStream = LocalStream;
function makeRemote(stream, transport) {
    var remote = stream;
    remote.audio = true;
    remote.video = 'none';
    remote.framerate = 'high';
    remote._videoPreMute = 'high';
    var select = function () {
        var call = {
            streamId: remote.id,
            video: remote.video,
            audio: remote.audio,
            framerate: remote.framerate
        };
        if (transport.api) {
            if (transport.api.readyState !== 'open') {
                // queue call if we aren't open yet
                transport.api.onopen = function () { var _a; return (_a = transport.api) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify(call)); };
            }
            else {
                transport.api.send(JSON.stringify(call));
            }
        }
    };
    remote.preferLayer = function (layer) {
        remote.video = layer;
        select();
    };
    remote.preferFramerate = function (layer) {
        remote.framerate = layer;
        select();
    };
    remote.mute = function (kind) {
        if (kind === 'audio') {
            remote.audio = false;
        }
        else if (kind === 'video') {
            remote._videoPreMute = remote.video;
            remote.video = 'none';
        }
        select();
    };
    remote.unmute = function (kind) {
        if (kind === 'audio') {
            remote.audio = true;
        }
        else if (kind === 'video') {
            remote.video = remote._videoPreMute;
        }
        select();
    };
    return remote;
}
exports.makeRemote = makeRemote;
