import { Signal } from './signal';
import { LocalStream, makeRemote, RemoteStream } from './stream';
import * as pb from './_library/proto/rtc/rtc_pb';
import * as sfu_rpc from './_library/proto/rtc/rtc_pb_service';
const API_CHANNEL = 'ion-sfu';
const ERR_NO_SESSION = 'no active session, join first';

export interface Sender {
  stream: MediaStream;
  transceivers: { [kind in 'video' | 'audio']: RTCRtpTransceiver };
}

export interface Configuration extends RTCConfiguration {
  codec: 'vp8' | 'vp9' | 'h264';
}

export interface Trickle {
  candidate: RTCIceCandidateInit;
  //target: Role;
  destination: string;
}

export interface ActiveLayer {
  streamId: string;
  activeLayer: string;
  availableLayers: string[];
}

enum Role {
  pub = 0,
  sub = 1,
}

type Transports<T extends string | symbol | number, U> = {
  [K in T]: U;
};

export class Transport {
  api?: RTCDataChannel;
  signal: Signal;
  pc: RTCPeerConnection;
  candidates: RTCIceCandidateInit[];
  destination: string;

  constructor(destination: string, role: Role, signal: Signal, config: RTCConfiguration) {
    this.signal = signal;

    this.pc = new RTCPeerConnection(config);

    this.candidates = [];
    this.destination = destination;

    if (role === Role.pub) {
      console.log("client.ts,line 48,this.pc.createDataChannel(API_CHANNEL)");
      this.pc.createDataChannel(API_CHANNEL);
      const dataChannel = this.pc.createDataChannel(API_CHANNEL);
      // Get a local stream


      /*
      吴亚雄添加
      双方都没有保存createDataChannel后的channel，也没有处理，
     
      dataChannel.onmessage =(ev)=>{
        console.log("client.ts,line 51,got data:"+ev.data)
      }
     */

    }

    this.pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        console.log("client.ts,line 73,pc.onicecandidate:%o",candidate);        
        this.signal.sendTrickle({ destination: destination, candidate });
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

    this.pc.oniceconnectionstatechange = async (e) => {
      console.log("client.ts,line 67,pc.oniceconnectionstatechange ", this.pc.iceConnectionState, e)
      if (this.pc.iceConnectionState === 'disconnected') {
        if (this.pc.restartIce !== undefined) {
          // this will trigger onNegotiationNeeded
          // this.pc.restartIce();
        }
      }
    };
  }
}

export default class Client {
  transports?: Transports<Role, Transport>;
  transports2?: Transports<Role, Transport>;
  transport?: Transport;
  private config: Configuration;
  private signal: Signal;

  ontrack?: (track: MediaStreamTrack, stream: RemoteStream) => void;
  ondatachannel?: (ev: RTCDataChannelEvent) => void;
  onspeaker?: (ev: string[]) => void;
  onerrnegotiate?: (
    role: Role,
    err: Error,
    offer?: RTCSessionDescriptionInit,
    answer?: RTCSessionDescriptionInit,
  ) => void;
  onactivelayer?: (al: ActiveLayer) => void;

  constructor(
    signal: Signal,
    config: Configuration = {
      codec: 'vp8',
      iceServers: [
        {
          urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'],
        },
      ],
    },
  ) {
    this.signal = signal;
    this.config = config;

    signal.onnegotiate = this.negotiate.bind(this);
    signal.recvTrickle = this.recvTrickle.bind(this);
  }


  // async join(sid: string, uid: string) {
  //   console.log("client.ts,line 105,join");
  //   this.transports = {
  //     [Role.pub]: new Transport(Role.pub, this.signal, this.config),
  //     [Role.sub]: new Transport(Role.sub, this.signal, this.config),
  //   };

  //   this.transports[Role.sub].pc.ontrack = (ev: RTCTrackEvent) => {
  //     const stream = ev.streams[0];
  //     const remote = makeRemote(stream, this.transports![Role.sub]);

  //     if (this.ontrack) {
  //       this.ontrack(ev.track, remote);
  //     }

  //     //连接成功后，从pub发送音频
  //     // const localMedia = navigator.mediaDevices.getUserMedia({
  //     //   audio: true,       
  //     // });
  //     // this.publish(localMedia);      
  //   };    
  //   const apiReady = new Promise<void>((resolve) => {
  //     this.transports![Role.sub].pc.ondatachannel = (ev: RTCDataChannelEvent) => {
  //       console.log("this.transports![Role.sub].pc.ondatachannel,"+ev);
  //       if (ev.channel.label === API_CHANNEL) {
  //         this.transports![Role.sub].api = ev.channel;
  //         this.transports![Role.pub].api = ev.channel;
  //         ev.channel.onmessage = (e) => {
  //           try {
  //             console.log("client.ts,line 126,API-CHANNEL get msg:"+e.data);
  //             const msg = JSON.parse(e.data);
  //             this.processChannelMessage(msg);
  //           } catch (err) {
  //             /* tslint:disable-next-line:no-console */
  //             console.error(err);
  //           }
  //         };
  //         resolve();
  //         return;
  //       }

  //       if (this.ondatachannel) {
  //         this.ondatachannel(ev);
  //       }
  //     };
  //   });

  //   const offer = await this.transports[Role.pub].pc.createOffer();
  //   console.log("client.ts line 142,offer: ",offer)
  //   //console.log(offer)
  //   await this.transports[Role.pub].pc.setLocalDescription(offer);
  //   const answer = await this.signal.join(sid, uid, offer);
  //   console.log("client.ts,line 146,answer: ", answer);
  //   await this.transports[Role.pub].pc.setRemoteDescription(answer);
  //   this.transports[Role.pub].candidates.forEach((c) => this.transports![Role.pub].pc.addIceCandidate(c));
  //   this.transports[Role.pub].pc.onnegotiationneeded = this.onNegotiationNeeded.bind(this);

  //   return apiReady;
  // }

  async wantControl(myID: string, destination: string) {
    console.log("client.ts,wantControl");
    this.transports = {
      [Role.pub]: new Transport(destination, Role.pub, this.signal, this.config),
      [Role.sub]: new Transport(destination, Role.sub, this.signal, this.config),
    };
    //this.transports2.append()
    this.transports[Role.sub].pc.ontrack = (ev: RTCTrackEvent) => {
      const stream = ev.streams[0];
      const remote = makeRemote(stream, this.transports![Role.sub]);
      console.log("client.ts,line 208,ontrack,ev:",ev)
      if (this.ontrack) {
        this.ontrack(ev.track, remote);
      }

      //连接成功后，从pub发送音频
      // const localMedia = navigator.mediaDevices.getUserMedia({
      //   audio: true,       
      // });
      // this.publish(localMedia);


    };

    const apiReady = new Promise<void>((resolve) => {
      this.transports![Role.sub].pc.ondatachannel = (ev: RTCDataChannelEvent) => {
        console.log("this.transports![Role.sub].pc.ondatachannel," + ev);
        // ev.channel.send("client.ts,line 225")
        // if (ev.channel.label === API_CHANNEL) {
        //   this.transports![Role.sub].api = ev.channel;
        //   ev.channel.onmessage = (e) => {
        //     try {
        //       console.log("client.ts,line 126,API-CHANNEL get msg:" + e.data);
        //       const msg = JSON.parse(e.data);
        //       this.processChannelMessage(msg);
        //     } catch (err) {
        //       /* tslint:disable-next-line:no-console */
        //       console.error(err);
        //     }
        //   };
        //   resolve();
        //   return;
        // }
        resolve();
        if (this.ondatachannel) {
          this.ondatachannel(ev);
        }
      };
    });
    //const localMed =await navigator.mediaDevices.getUserMedia({ audio: true,video: true });    
    //localMed.getTracks().forEach(track =>this.transports![Role.pub].pc.addTrack(track,localMed));
    //let options:RTCOfferAnswerOptions;
    //options.offer_to_receive_video = true;
    //const offer = await this.transports[Role.pub].pc.createOffer();
    //console.log("client.ts line 142,offer: ", offer)    
    //await this.transports[Role.pub].pc.setLocalDescription(offer);    

   

    const wantControlReply = await this.signal.wantControl(myID, destination);
    if(!wantControlReply.idleornot){
     alert("视频源正在被控制,还有"+wantControlReply.numofwaiting+"位在等待,当前操作者预计还有"+wantControlReply.resttimesecofcontroling+"秒结束,请稍候再试")
     delete this.transports;
     return ;
    }
    wantControlReply.sdptype=="answer"
    let remoteDescription:RTCSessionDescriptionInit={
    sdp:wantControlReply.sdp,
    type:wantControlReply.sdptype=="answer"?"answer":"offer",
  };
    let answer: RTCSessionDescriptionInit | undefined;
    try {
      console.log("client.ts,line 260,wantControl reply: ", wantControlReply)
      await this.transports[Role.sub].pc.setRemoteDescription(remoteDescription);
      //this.transports[Role.sub].hasRemoteDescription = true;
      this.transports[Role.sub].candidates.forEach((c) => this.transports![Role.sub].pc.addIceCandidate(c));
      this.transports[Role.sub].candidates = [];
      answer = await this.transports[Role.sub].pc.createAnswer();
      console.log("client.ts,line 265,answer:%o",answer);      
      await this.transports[Role.sub].pc.setLocalDescription(answer);
      this.signal.answer2(answer,myID,destination);
    } catch (err) {
      /* tslint:disable-next-line:no-console */
      console.error(err);
      //if (this.onerrnegotiate) this.onerrnegotiate(Role.sub, err, description, answer);
    }   
    
    //this.transports[Role.sub].candidates.forEach((c) => this.transports![Role.sub].pc.addIceCandidate(c));
   // this.transports[Role.sub].pc.onnegotiationneeded = this.onNegotiationNeeded.bind(this);
   // await this.transports[Role.pub].pc.setRemoteDescription(answer);
   // this.transports[Role.pub].candidates.forEach((c) => this.transports![Role.pub].pc.addIceCandidate(c));
    //this.transports[Role.pub].pc.onnegotiationneeded = this.onNegotiationNeeded.bind(this);

    //如果对方回复不能
    //  alert("source is idle");
    //}

    /**
     * export namespace WantControlReply {
    export type AsObject = {
      success: boolean,
      idleornot: boolean,
      resttimesecofcontroling: number,
      numofwaiting: number,
      error?: Error.AsObject,
    }
  }
     */
    // await this.transports[Role.pub].pc.setRemoteDescription(answer);
    // this.transports[Role.pub].candidates.forEach((c) => this.transports![Role.pub].pc.addIceCandidate(c));
    // this.transports[Role.pub].pc.onnegotiationneeded = this.onNegotiationNeeded.bind(this);

    return apiReady;
  }


  leave() {
    if (this.transports) {
      Object.values(this.transports).forEach((t) => t.pc.close());
      delete this.transports;
    }
  }

  getPubStats(selector?: MediaStreamTrack) {
    if (!this.transports) {
      throw Error(ERR_NO_SESSION);
    }
    return this.transports[Role.pub].pc.getStats(selector);
  }

  getSubStats(selector?: MediaStreamTrack) {
    if (!this.transports) {
      throw Error(ERR_NO_SESSION);
    }
    return this.transports[Role.sub].pc.getStats(selector);
  }

  publish(stream: LocalStream, encodingParams?: RTCRtpEncodingParameters[]) {
    if (!this.transports) {
      throw Error(ERR_NO_SESSION);
    }
    stream.publish(this.transports[Role.pub], encodingParams);
  }

  restartIce() {
    this.renegotiate(true);
  }

  createDataChannel(label: string) {
    if (!this.transports) {
      throw Error(ERR_NO_SESSION);
    }
    return this.transports[Role.sub].pc.createDataChannel(label);
  }

  close() {
    if (this.transports) {
      Object.values(this.transports).forEach((t) => t.pc.close());
    }
    this.signal.close();
  }

  private recvTrickle({ candidate, destination }: Trickle) {
    if (!this.transports) {
      throw Error(ERR_NO_SESSION);
    }
    console.log("client.ts,line 334,from:", candidate, destination);
    if (this.transports[Role.sub].pc.remoteDescription) {
      console.log("client.ts line 336,ransports[Role.pub] has pc.remoteDescription");
      this.transports[Role.sub].pc.addIceCandidate(candidate);
    } else {
      console.log("client.ts line 339,ransports[Role.pub] has no pc.remoteDescription");
      this.transports[Role.sub].candidates.push(candidate);
    }
  }

  private async negotiate(description: RTCSessionDescriptionInit) {
    console.log("client.ts,line 365, negotiate:", description);
    if (!this.transports) {
      throw Error(ERR_NO_SESSION);
    }

    let answer: RTCSessionDescriptionInit | undefined;
    try {
      await this.transports[Role.sub].pc.setRemoteDescription(description);
      //this.transports[Role.sub].hasRemoteDescription = true;
      this.transports[Role.sub].candidates.forEach((c) => this.transports![Role.sub].pc.addIceCandidate(c));
      this.transports[Role.sub].candidates = [];
      answer = await this.transports[Role.sub].pc.createAnswer();
      console.log("client.ts,line 249,answer:%o",answer);      
      await this.transports[Role.sub].pc.setLocalDescription(answer);
      this.signal.answer(answer);
    } catch (err) {
      /* tslint:disable-next-line:no-console */
      console.error(err);
      if (this.onerrnegotiate) this.onerrnegotiate(Role.sub, err, description, answer);
    }
  }

  private onNegotiationNeeded() {
    this.renegotiate(false);
  }

  private async renegotiate(iceRestart: boolean) {
    if (!this.transports) {
      throw Error(ERR_NO_SESSION);
    }

    let offer: RTCSessionDescriptionInit | undefined;
    let answer: RTCSessionDescriptionInit | undefined;
    try {
      offer = await this.transports[Role.pub].pc.createOffer({ iceRestart });
      await this.transports[Role.pub].pc.setLocalDescription(offer);
      answer = await this.signal.offer(offer);
      await this.transports[Role.pub].pc.setRemoteDescription(answer);
    } catch (err) {
      /* tslint:disable-next-line:no-console */
      console.error(err);
      if (this.onerrnegotiate) this.onerrnegotiate(Role.pub, err, offer, answer);
    }
  }

  private processChannelMessage(msg: any) {
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
    } else {
      // legacy channel message - payload contains audio levels
      if (this.onspeaker) {
        this.onspeaker(msg);
      }
    }
  }
}
