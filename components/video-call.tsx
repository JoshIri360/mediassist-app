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
import { useAuthContext } from "@/context/AuthContext";

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

const VideoCall: React.FC<VideoCallProps> = ({ userId }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callId, setCallId] = useState<string>("");
  const { user, role } = useAuthContext();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  const patientId = "TOnFPD4v1ydA3tjjwxsh1ryPoOE3";

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing webcam: ", error);
      }
    };

    startWebcam();

    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (role === "doctor") {
      createCall(patientId);
    } else if (role === "patient") {
      answerCall();
    }

    return () => {
      pcRef.current?.close();
    };
  }, [role]);

  const createCall = async (patientId: string) => {
    try {
      pcRef.current = new RTCPeerConnection(servers);

      localStream?.getTracks().forEach((track) => {
        pcRef.current?.addTrack(track, localStream);
      });

      pcRef.current.ontrack = (event) => {
        const [stream] = event.streams;
        setRemoteStream(stream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      };

      const callDoc = await addDoc(collection(db, "calls"), {
        created: new Date(),
      });
      setCallId(callDoc.id);

      const patientRef = doc(db, "users", patientId);
      await updateDoc(patientRef, { calls: callDoc.id });

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
        offer: {
          type: offerDescription.type,
          sdp: offerDescription.sdp,
        },
      });

      onSnapshot(callDoc, (snapshot) => {
        const data = snapshot.data();
        if (data?.answer && !pcRef.current?.currentRemoteDescription) {
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
    } catch (error) {
      console.error("Error creating call: ", error);
    }
  };

  const answerCall = async () => {
    if (!user) return;

    try {
      pcRef.current = new RTCPeerConnection(servers);

      const userRef = doc(db, "users", user.uid);
      const userData = (await getDoc(userRef)).data();

      if (!userData) {
        console.error("User data not found");
        return;
      }

      const callId = userData.calls;

      localStream?.getTracks().forEach((track) => {
        pcRef.current?.addTrack(track, localStream);
      });

      pcRef.current.ontrack = (event) => {
        const [stream] = event.streams;
        setRemoteStream(stream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      };

      const callDoc = doc(db, "calls", callId);
      const answerCandidates = collection(
        db,
        `calls/${callId}/answerCandidates`
      );
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
        answer: {
          type: answerDescription.type,
          sdp: answerDescription.sdp,
        },
      });

      onSnapshot(offerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const candidate = new RTCIceCandidate(change.doc.data());
            pcRef.current?.addIceCandidate(candidate);
          }
        });
      });
    } catch (error) {
      console.error("Error answering call: ", error);
    }
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
    </div>
  );
};

export default VideoCall;
