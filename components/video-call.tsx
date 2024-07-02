import React, { useEffect, useRef, useState } from "react";
import { db } from "@/firebase/config";
import {
  collection,
  addDoc,
  doc,
  onSnapshot,
  updateDoc,
  getDoc,
} from "firebase/firestore";

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
};

interface VideoCallProps {
  userId: string;
  role: "doctor" | "patient";
}

const VideoCall: React.FC<VideoCallProps> = ({ userId, role }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callId, setCallId] = useState<string>("");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const startWebcam = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    };

    startWebcam();

    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const createCall = async () => {
    pcRef.current = new RTCPeerConnection(servers);

    localStream?.getTracks().forEach((track) => {
      pcRef.current?.addTrack(track, localStream);
    });

    pcRef.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    const callDoc = await addDoc(collection(db, "calls"), {
      created: new Date(),
    });
    setCallId(callDoc.id);

    pcRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(
          collection(db, `calls/${callDoc.id}/offerCandidates`),
          event.candidate.toJSON()
        );
      }
    };

    const offerDescription = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offerDescription);

    await updateDoc(callDoc, {
      offer: { type: offerDescription.type, sdp: offerDescription.sdp },
    });

    onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();
      if (!pcRef.current?.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pcRef.current?.setRemoteDescription(answerDescription);
      }
    });

    onSnapshot(
      collection(db, `calls/${callDoc.id}/answerCandidates`),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const candidate = new RTCIceCandidate(change.doc.data());
            pcRef.current?.addIceCandidate(candidate);
          }
        });
      }
    );
  };

  const answerCall = async (callId: string) => {
    pcRef.current = new RTCPeerConnection(servers);

    localStream?.getTracks().forEach((track) => {
      pcRef.current?.addTrack(track, localStream);
    });

    pcRef.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    const callDoc = doc(db, "calls", callId);
    const answerCandidates = collection(db, `calls/${callId}/answerCandidates`);
    const offerCandidates = collection(db, `calls/${callId}/offerCandidates`);

    pcRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(answerCandidates, event.candidate.toJSON());
      }
    };

    const callData = (await getDoc(callDoc)).data();
    if (!callData) {
      console.error("Call data not found");
      return;
    }
    const offerDescription = callData.offer;
    await pcRef.current.setRemoteDescription(
      new RTCSessionDescription(offerDescription)
    );

    const answerDescription = await pcRef.current.createAnswer();
    await pcRef.current.setLocalDescription(answerDescription);

    await updateDoc(callDoc, {
      answer: { type: answerDescription.type, sdp: answerDescription.sdp },
    });

    onSnapshot(offerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          pcRef.current?.addIceCandidate(candidate);
        }
      });
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-4 mb-4">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-1/2 h-auto"
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-1/2 h-auto"
        />
      </div>
      <div className="flex space-x-4">
        <button
          onClick={createCall}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Start Call
        </button>
        <input
          type="text"
          value={callId}
          onChange={(e) => setCallId(e.target.value)}
          placeholder="Enter Call ID"
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={() => answerCall(callId)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Join Call
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
