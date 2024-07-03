import { useEffect, useRef, useState } from "react";
import { db } from "@/firebase/config";
import {
  collection,
  addDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

const VideoCall = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [callId, setCallId] = useState<string>("");
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);

  useEffect(() => {
    const initLocalStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    };
    initLocalStream();
  }, []);

  const startCall = async () => {
    const pc = new RTCPeerConnection();
    setPeerConnection(pc);

    const localStream = localVideoRef.current?.srcObject as MediaStream;
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

    const callDoc = await addDoc(collection(db, "calls"), {});
    setCallId(callDoc.id);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(
          collection(db, "calls", callDoc.id, "offerCandidates"),
          event.candidate.toJSON()
        );
      }
    };

    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await updateDoc(callDoc, { offer });

    onSnapshot(doc(db, "calls", callDoc.id), (snapshot) => {
      const data = snapshot.data();
      if (!pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(answerDescription);
      }
    });

    onSnapshot(
      collection(db, "calls", callDoc.id, "answerCandidates"),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.addIceCandidate(candidate);
          }
        });
      }
    );
  };

  const joinCall = async (id: string) => {
    const pc = new RTCPeerConnection();
    setPeerConnection(pc);

    const callDoc = doc(db, "calls", id);
    setCallId(id);

    const localStream = localVideoRef.current?.srcObject as MediaStream;
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(
          collection(db, "calls", id, "answerCandidates"),
          event.candidate.toJSON()
        );
      }
    };

    onSnapshot(callDoc, async (snapshot) => {
      const data = snapshot.data();
      if (data?.offer) {
        const offerDescription = new RTCSessionDescription(data.offer);
        pc.setRemoteDescription(offerDescription);

        const answerDescription = await pc.createAnswer();
        await pc.setLocalDescription(answerDescription);

        const answer = {
          sdp: answerDescription.sdp,
          type: answerDescription.type,
        };

        await updateDoc(callDoc, { answer });
      }
    });

    onSnapshot(collection(db, "calls", id, "offerCandidates"), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });
  };

  return (
    <div className="video-call">
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className="local-video"
      />
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="remote-video"
      />
      <div>
        <button onClick={startCall} className="start-call-btn">
          Start Call
        </button>
        <input
          type="text"
          placeholder="Enter call ID"
          value={callId}
          onChange={(e) => setCallId(e.target.value)}
        />
        <button onClick={() => joinCall(callId)} className="join-call-btn">
          Join Call
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
