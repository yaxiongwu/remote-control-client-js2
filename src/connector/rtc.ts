import { grpc } from '@improbable-eng/grpc-web';
import { Service, Connector } from './ion';
import Client, { Configuration, Trickle } from '../client';
import { Signal } from '../signal';
import { EventEmitter } from 'events';
import * as sfu_rpc from '../_library/proto/rtc/rtc_pb_service';
import * as pb from '../_library/proto/rtc/rtc_pb';
import { LocalStream, RemoteStream } from '../stream';
import { NIL, v4 as uuidv4 } from 'uuid';

/**
 * TrackState: track state
 */
export enum TrackState {
  ADD = 0,
  UPDATE,
  REMOVE,
}

/**
 * TrackEvent: track event
 */
export interface TrackEvent {
  state: TrackState;
  uid: string;
  tracks: TrackInfo[];
}

/**
 * MediaType: media type
 */
export enum MediaType {
  MEDIAUNKNOWN = 0,
  USERMEDIA = 1,
  SCREENCAPTURE = 2,
  CAVANS = 3,
  STREAMING = 4,
  VOIP = 5,
}

/**
 * TrackInfo: track info
 */
export interface TrackInfo {
  id: string;
  kind: string;
  muted: boolean;
  type: MediaType;
  stream_id: string;
  label: string;
  layer: string;
  width: number;
  height: number;
  frame_rate: number;
}

/**
 * Subscription: subscription
 */
export interface Subscription {
  track_id: string;
  muted: boolean;
  subscribe: boolean;
  layer: string;
}

/**
 * JoinConfig: join config
 */
export interface JoinConfig {
  no_publish: boolean;
  no_subscribe: boolean;
  no_auto_subscribe: boolean;
}

/**
 * Error: error interface
 */
export interface Error {
  code: number;
  reason: string;
}

/**
 * Result: result interface
 */
export interface Result {
  success: boolean;
  error: Error | undefined;
}

/**
 * RTC: rtc class
 */
export class RTC implements Service {
  name: string;
  //id:string;
  connector: Connector;
  connected: boolean;
  config?: Configuration;
  protected _rpc?: grpc.Client<pb.Request, pb.Reply>;
  private _rtc?: Client;
  private _sig?: RTCGRPCSignal;
  ontrack?: (track: MediaStreamTrack, stream: RemoteStream) => void;
  ondatachannel?: (ev: RTCDataChannelEvent) => void;
  onspeaker?: (ev: string[]) => void;
  ontrackevent?: (ev: TrackEvent) => void;

  /**
   * constructor
   * @date 2021-11-03
   * @param {any} connector:Connector
   * @param {any} config?:Configuration
   * @returns
   */
  constructor(connector: Connector, config?: Configuration) {
    this.name = 'rtc';
    //this.id= uuidv4();
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
  // async join(sid: string, uid: string, config: JoinConfig | undefined) {
  //   this._sig!.config = config;
  //   return this._rtc?.join(sid, uid);
  // }


  /**
 * getOnlineSources
 * @date 2021-11-03
 * @param {any} sourceType: pb.SourceTypeMap
 * @returns
 */
  async getOnlineSources(sourceType: pb.SourceTypeMap[keyof pb.SourceTypeMap]) {

    return this._sig?.getOnlineSources(sourceType);
  }

  /**
* getOnlineSources
* @date 2021-11-03
* @param {any} sourceType: pb.SourceTypeMap
* @returns
*/
  async wantConnect(myID:string, destination: string,connectType:pb.ConnectTypeMap[keyof pb.ConnectTypeMap], config: JoinConfig | undefined) {
    //this.id=uid;
    console.log("rtc.ts,line 159,connectType: " + connectType)
    return this._rtc?.wantConnect(myID,destination,connectType);
  }


  /**
   * leave session
   * @date 2021-11-03
   * @returns
   */
  leave() {
    return this._rtc?.leave();
  }

  /**
   * get pub stats
   * @date 2021-11-03
   * @param {any} selector?:MediaStreamTrack
   * @returns {any}
   */
  getPubStats(selector?: MediaStreamTrack) {
    return this._rtc?.getPubStats(selector);
  }

  /**
   * get sub stats
   * @date 2021-11-03
   * @param {any} selector?:MediaStreamTrack
   * @returns {any}
   */
  getSubStats(selector?: MediaStreamTrack) {
    return this._rtc?.getSubStats(selector);
  }

  /**
   * publish local stream
   * @date 2021-11-03
   * @param {any} stream:LocalStream
   * @returns {any}
   */
  publish(stream: LocalStream) {
    this._sig!.buildTrackInfos(stream);
    this._rtc?.publish(stream);
  }

  /**
   * subscribe
   * @date 2021-11-03
   * @param {any} trackInfos:Subscription[]
   * @returns {any}
   */
  subscribe(trackInfos: Subscription[]): Promise<Result> | undefined {
    return this._sig?.subscribe(trackInfos);
  }

  /**
   * createDataChannel
   * @date 2021-11-03
   * @param {any} label:string
   * @returns {any}
   */
  createDataChannel(label: string) {
    return this._rtc?.createDataChannel(label);
  }

  /**
   * connect to signal
   * @date 2021-11-03
   * @returns {any}
   */
  connect(): void {
    if (!this._sig) {
      this._sig = new RTCGRPCSignal(this, this.connector);
    }
    if (!this._rtc) {
      this._rtc = new Client(this._sig, this?.config);
      this._rtc.ontrack = (track: MediaStreamTrack, stream: RemoteStream) => {
        // TODO: Attach track info to RemoteStream.
        this.ontrack?.call(this, track, stream);
      };
      this._rtc.ondatachannel = (ev: RTCDataChannelEvent) => this.ondatachannel?.call(this, ev);
      this._rtc.onspeaker = (ev: string[]) => this.onspeaker?.call(this, ev);
      this._sig.ontrackevent = (ev: TrackEvent) => {
        // TODO: Attach RemoteStream info to track event.
        this.ontrackevent?.call(this, ev);
      };
    }
  }

  /**
   * close rtc
   * @date 2021-11-03
   * @returns {any}
   */
  close(): void {
    if (this._rtc) {
      this._rtc.close();
    }
  }
}

/**
 * RTCGRPCSignal: rtc grpc signal
 */
class RTCGRPCSignal implements Signal {
  connector: Connector;
  id?: string;
  protected _client: grpc.Client<pb.Request, pb.Reply>;
  private _event: EventEmitter = new EventEmitter();
  private _tracksInfos?: pb.TrackInfo[];
  onnegotiate?: ((jsep: RTCSessionDescriptionInit) => void) | undefined;
  recvTrickle?: ((trickle: Trickle) => void) | undefined;
  ontrackevent?: (ev: TrackEvent) => void;
  private _config?: JoinConfig;
  set config(config: JoinConfig | undefined) {
    this._config = config;
  }
  constructor(service: Service, connector: Connector) {
    this.connector = connector;
    const client = grpc.client(sfu_rpc.RTC.Signal, this.connector.grpcClientRpcOptions()) as grpc.Client<
      pb.Request,
      pb.Reply
    >;
    client.onEnd((status: grpc.Code, statusMessage: string, trailers: grpc.Metadata) =>
      connector.onEnd(service, status, statusMessage, trailers),
    );
    client.onHeaders((headers: grpc.Metadata) => connector.onHeaders(service, headers));
    client.onMessage((reply: pb.Reply) => {
      //console.log("rtc.ts,line 258,reply:",reply);
      switch (reply.getPayloadCase()) {
        case pb.Reply.PayloadCase.JOIN:
          const result = reply.getJoin();
          console.log("rtc.ts,line 261,pb.Reply.PayloadCase.JOIN:")
          //console.log(result);
          this._event.emit('join-reply', result);
          break;
        case pb.Reply.PayloadCase.ONLINESOURCE:
          const onlineSources = reply.getOnlinesource();
          console.log("rtc.ts,line 283,pb.Reply.PayloadCase.ONLINESOURCE:%o",onlineSources);
          
          this._event.emit('onlineSources-reply', onlineSources);
          break;
        case pb.Reply.PayloadCase.WANTCONNECT:
          const wantConnectReply = reply.getWantconnect();
          console.log("rtc.ts,line 298,pb.Reply.PayloadCase.WANTCONNECT:%o",wantConnectReply);
          
          this._event.emit('wantConnect-reply', wantConnectReply);
          break;
        case pb.Reply.PayloadCase.DESCRIPTION:
          const desc = reply.getDescription();
          console.log("rtc.ts,line 267,pb.Reply.PayloadCase.DESCRIPTION:%o",desc);
          
          if (desc?.getType() === 'offer') {
            if (this.onnegotiate) this.onnegotiate({ sdp: desc.getSdp(), type: 'offer' });
          } else if (desc?.getType() === 'answer') {
            this._event.emit('description', { sdp: desc.getSdp(), type: 'answer' });
          }
          if (desc?.getTrackinfosList() && desc?.getTrackinfosList().length > 0) {
            // TODO: process metadata.
          }
          break;
        case pb.Reply.PayloadCase.TRICKLE:
          const pbTrickle = reply.getTrickle();
          //console.log("rtc.ts,line 280,pb.Reply.PayloadCase.TRICKLE:")
          //console.log(pbTrickle);         
          if (pbTrickle?.getInit() !== undefined) {
            const candidate = JSON.parse(pbTrickle.getInit() as string);
            const trickle = { candidate, destination:pbTrickle?.getFrom()};
            console.log("rtc.ts line 326,pb.Reply.PayloadCase.TRICKLE:%o",trickle);
            if (this.recvTrickle) this.recvTrickle(trickle);
          }
          break;
        case pb.Reply.PayloadCase.TRACKEVENT:
          {
            const evt = reply.getTrackevent();
            console.log("rtc.ts,line 291,pb.Reply.PayloadCase.TRACKEVENT:"+evt)
            
            let state = TrackState.ADD;
            switch (evt?.getState()) {
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
            const tracks = Array<TrackInfo>();
            const uid = evt?.getUid() || '';
            evt?.getTracksList().forEach((rtcTrack: pb.TrackInfo) => {
              tracks.push({
                id: rtcTrack.getId(),
                kind: rtcTrack.getKind(),
                label: rtcTrack.getLabel(),
                stream_id: rtcTrack.getStreamid(),
                muted: rtcTrack.getMuted(),
                type: rtcTrack.getType() || MediaType.MEDIAUNKNOWN,
                layer: rtcTrack.getLayer(),
                width: rtcTrack.getWidth() || 0,
                height: rtcTrack.getHeight() || 0,
                frame_rate: rtcTrack.getFramerate() || 0,
              });
            });
            this.ontrackevent?.call(this, { state, tracks, uid });
          }
          break;
        case pb.Reply.PayloadCase.SUBSCRIPTION:
          const subscription = reply.getSubscription();
          console.log("rtc.ts,line 368,pb.Reply.PayloadCase.SUBSCRIPTION::")
          //console.log(subscription);
          this._event.emit('subscription', {
            success: subscription?.getSuccess() || false,
            error: subscription?.getError(),
          });
        case pb.Reply.PayloadCase.ERROR:
          break;
      }
    });
    this._client = client;
    this._client.start(this.connector.metadata);
  }

  /**
   * join a session
   * @date 2021-11-03
   * @param {any} sid:string
   * @param {any} uid:null|string
   * @param {any} offer:RTCSessionDescriptionInit
   * @returns {any}
   */
  join(sid: string, uid: null | string, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    const request = new pb.Request();
    const join = new pb.JoinRequest();
    join.setSid(sid);
    join.setUid(uid || '');
    if (this._config) {
      join.getConfigMap().set('NoPublish', this._config?.no_publish ? 'true' : 'false');
      join.getConfigMap().set('NoSubscribe', this._config?.no_subscribe ? 'true' : 'false');
      join.getConfigMap().set('NoAutoSubscribe', this._config?.no_auto_subscribe ? 'true' : 'false');
    }

    const dest = new pb.SessionDescription();
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
    return new Promise<any>((resolve, reject) => {
      const handler = (result: pb.JoinReply) => {
        console.log("rtc.ts,line 372,handler", result);
        if (result.getSuccess()) {
          resolve({
            sdp: result.getDescription()!.getSdp(),
            type: result.getDescription()!.getType(),
          });
        } else {
          reject(result.getError()?.toObject());
        }
        this._event.removeListener('join-reply', handler);
      };
      this._event.addListener('join-reply', handler);
    });
  }

  /**
   * join a session
   * @date 2021-11-03
   * @param {any} sid:string
   * @param {any} uid:null|string
   * @param {any} offer:RTCSessionDescriptionInit
   * @returns {any}
   */
  //wantConnect(from: string,to:string, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
   // wantConnect(from: string,to:string): Promise<RTCSessionDescriptionInit> {
    wantConnect(from: string,to:string,connectType:pb.ConnectTypeMap[keyof pb.ConnectTypeMap]): Promise<pb.WantConnectReply.AsObject> {
    this.id = from;    //this.id= uuidv4()

    const request = new pb.Request();
    const wantConnectReq = new pb.WantConnectRequest();    
    wantConnectReq.setFrom(from );
    wantConnectReq.setTo( to );     
    wantConnectReq.setConnecttype(connectType);    
    //wantConnectReq.setSdp(offer.sdp || '');
    //wantConnectReq.setSdptype(offer.type || '');
    console.log("rtc.ts,line,451,wantConnectReq:", wantConnectReq);
    request.setWantconnect(wantConnectReq);
    this._client.send(request);
    return new Promise<any>((resolve, reject) => {
      const handler = (result: pb.WantConnectReply) => {
        console.log("rtc.ts,line 454 WantConnectReply,handler", result);
        if (result.getSuccess()) {
          // if (!result.getIdleornot()){
          //   alert("????????????????????????,??????"+result.getNumofwaiting()+"????????????,???????????????")
          //   this._event.removeListener('wantConnect-reply', handler);
          //   resolve({sdp:NIL,type:})
          //   return
          // }
          resolve({
             idleornot: result.getIdleornot(),
             resttimesecofcontroling: result.getResttimesecs(),
             numofwaiting: result.getNumofwaiting(),
            sdp:result.getSdp(),
            type:result.getSdptype(),
          });
        } else {
          reject(result.getError()?.toObject());
        }
        this._event.removeListener('wantConnect-reply', handler);
      };
      this._event.addListener('wantConnect-reply', handler);
    });
  }


  /**
   * getOnlineSources
   * @date 2021-11-03
   * @param {any} sourceType: pb.SourceTypeMap
   * @returns {any} Promise<Array<pb.OnLineSources>
   */
  getOnlineSources(sourceType: pb.SourceTypeMap[keyof pb.SourceTypeMap]): Promise<Array<pb.OnLineSources>> {
    const request = new pb.Request();
    const onlineSourceRequest = new pb.OnLineSourceRequest();
    onlineSourceRequest.setSourcetype(sourceType);
    console.log("rtc.ts,line 491,onlineSourceRequest: ");
    console.log(onlineSourceRequest)
    request.setOnlinesource(onlineSourceRequest);
    this._client.send(request);
    return new Promise<any>((resolve, reject) => {
      const handler = (result: pb.OnLineSourceReply) => {
        console.log("rtc.ts,line 422,getOnlineSources:", result.getOnlinesourcesList());
        if (result.getSuccess()) {
          resolve(result.getOnlinesourcesList());
        } else {
          reject(result.getError()?.toObject());
        }
        this._event.removeListener('onlineSources-reply', handler);
      };
      this._event.addListener('onlineSources-reply', handler);
    });
  }


  /**
   * send trickle
   * @date 2021-11-03
   * @param {any} trickle:Trickle
   * @returns {any}
   */
   sendTrickle(trickle: Trickle) {
    //alert(this.id)
    const request = new pb.Request();
    const pbTrickle = new pb.Trickle();
    pbTrickle.setInit(JSON.stringify(trickle.candidate));
    pbTrickle.setTo(trickle.destination)
    request.setTrickle(pbTrickle);
    this._client.send(request);
  }

  /**
   * send offer request
   * @date 2021-11-03
   * @param {any} offer:RTCSessionDescriptionInit
   * @returns {any}
   */
  offer(offer: RTCSessionDescriptionInit) {
    const request = new pb.Request();
    const dest = new pb.SessionDescription();
    dest.setSdp(offer.sdp || '');
    dest.setType(offer.type || '');
    dest.setTarget(pb.Target.PUBLISHER);
    if (this._tracksInfos) {
      dest.setTrackinfosList(this._tracksInfos);
    }
    request.setDescription(dest);
    this._client.send(request);
    return new Promise<RTCSessionDescriptionInit>((resolve, reject) => {
      const handler = (desc: RTCSessionDescriptionInit) => {
        resolve(desc);
        this._event.removeListener('description', handler);
      };
      this._event.addListener('description', handler);
    });
  }

  /**
   * send answer request
   * @date 2021-11-03
   * @param {any} answer:RTCSessionDescriptionInit
   * @returns {any}
   */
  answer(answer: RTCSessionDescriptionInit) {
    const request = new pb.Request();
    const desc = new pb.SessionDescription();
    desc.setSdp(answer.sdp || '');
    desc.setType(answer.type || '');
    desc.setTarget(pb.Target.SUBSCRIBER);
    request.setDescription(desc);
    this._client.send(request);
  }

  answer2(answer: RTCSessionDescriptionInit,from:string,to:string) {
    const request = new pb.Request();
    const desc = new pb.SessionDescription();
    desc.setSdp(answer.sdp || '');
    desc.setType(answer.type || '');
    //desc.setTarget(pb.Target.SUBSCRIBER);
    desc.setFrom(from);
    desc.setTo(to);
    request.setDescription(desc);
    this._client.send(request);
  }

  /**
   * close client
   * @date 2021-11-03
   * @returns {any}
   */
  close(): void {
    this._client?.close();
  }

  /**
   * subscribe
   * @date 2021-11-03
   * @param {any} infos:Subscription[]
   * @returns {any}
   */
  subscribe(infos: Subscription[]): Promise<Result> {
    const request = new pb.Request();
    const subscription = new pb.SubscriptionRequest();
    const tracksInfos = Array<pb.Subscription>();

    infos.forEach((t: Subscription) => {
      const trackInfo = new pb.Subscription();
      trackInfo.setTrackid(t.track_id);
      trackInfo.setMute(t.muted);
      trackInfo.setLayer(t.layer);
      trackInfo.setSubscribe(t.subscribe);
      tracksInfos.push(trackInfo);
    });
    subscription.setSubscriptionsList(tracksInfos);
    request.setSubscription(subscription);
    this._client.send(request);

    return new Promise<Result>((resolve, reject) => {
      const handler = (res: Result) => {
        resolve(res);
        this._event.removeListener('subscription', handler);
      };
      this._event.addListener('subscription', handler);
    });
  }

  /**
   * build TrackInfos
   * @date 2021-11-03
   * @param {any} stream:LocalStream
   * @returns {any}
   */
  buildTrackInfos(stream: LocalStream): void {
    const tracks = stream.getTracks();
    const trackInfos = new Array<pb.TrackInfo>();
    for (const track of tracks) {
      const trackInfo = new pb.TrackInfo();
      trackInfo.setId(track.id);
      trackInfo.setKind(track.kind);
      trackInfo.setLabel(track.label);
      trackInfo.setStreamid(stream.id);
      trackInfo.setMuted(!track.enabled);
      trackInfo.setType(MediaType.USERMEDIA);
      trackInfos.push(trackInfo);
    }
    this._tracksInfos = trackInfos;
  }
}
