import { db } from "@/firebase/config";
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
  getDoc,
} from "firebase/firestore";

class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;

  constructor() {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });
  }

  async setupMediaDevices() {
    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    this.remoteStream = new MediaStream();

    this.localStream.getTracks().forEach((track) => {
      this.peerConnection!.addTrack(track, this.localStream!);
    });

    this.peerConnection!.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream!.addTrack(track);
      });
    };

    return { localStream: this.localStream, remoteStream: this.remoteStream };
  }

  async startCall(userId: string) {
    const callDoc = doc(collection(db, "calls"));
    const offerCandidates = collection(callDoc, "offerCandidates");
    const answerCandidates = collection(callDoc, "answerCandidates");

    this.peerConnection!.onicecandidate = (event) => {
      event.candidate && setDoc(doc(offerCandidates), event.candidate.toJSON());
    };

    const offerDescription = await this.peerConnection!.createOffer();
    await this.peerConnection!.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
      createdBy: userId,
    };

    await setDoc(callDoc, { offer });

    onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();
      if (!this.peerConnection!.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        this.peerConnection!.setRemoteDescription(answerDescription);
      }
    });

    onSnapshot(answerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          this.peerConnection!.addIceCandidate(candidate);
        }
      });
    });

    return callDoc.id;
  }

  async joinCall(callId: string, userId: string) {
    const callDoc = doc(db, "calls", callId);
    const answerCandidates = collection(callDoc, "answerCandidates");
    const offerCandidates = collection(callDoc, "offerCandidates");

    this.peerConnection!.onicecandidate = (event) => {
      event.candidate &&
        setDoc(doc(answerCandidates), event.candidate.toJSON());
    };

    const callData = (await getDoc(callDoc)).data();

    const offerDescription = callData!.offer;
    await this.peerConnection!.setRemoteDescription(
      new RTCSessionDescription(offerDescription)
    );

    const answerDescription = await this.peerConnection!.createAnswer();
    await this.peerConnection!.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
      createdBy: userId,
    };

    await updateDoc(callDoc, { answer });

    onSnapshot(offerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          this.peerConnection!.addIceCandidate(candidate);
        }
      });
    });
  }

  async endCall() {
    this.peerConnection?.close();
    this.localStream?.getTracks().forEach((track) => track.stop());
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
  }

  getLocalStream() {
    return this.localStream;
  }

  getRemoteStream() {
    return this.remoteStream;
  }
}

export default new WebRTCService();
