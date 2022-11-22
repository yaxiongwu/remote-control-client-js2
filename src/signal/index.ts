import { Trickle } from '../client';
export { Trickle };

import * as pb from '../_library/proto/rtc/rtc_pb';

export interface Signal {
  onnegotiate?: (jsep: RTCSessionDescriptionInit) => void;
  recvTrickle?: (trickle: Trickle) => void;

  //join(sid: string, uid: null | string, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit>;
  offer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit>;
  answer(answer: RTCSessionDescriptionInit): void;
  answer2(answer: RTCSessionDescriptionInit,from:string,to:string): void;
  sendTrickle(trickle: Trickle): void;
  close(): void;
   
  getOnlineSources(sourceType: pb.SourceTypeMap ): Promise<Array<pb.OnLineSources>>;
  //wantConnect(from:  string, to:string, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit>;
  wantConnect(from:  string, to:string): Promise<pb.WantConnectReply.AsObject>;
  
}
