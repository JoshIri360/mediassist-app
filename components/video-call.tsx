import React, { useEffect, useState, useCallback } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import {
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  Call,
  User,
} from "@stream-io/video-react-sdk";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface MyUILayoutProps {
  onEndCall: () => void;
}

const MyUILayout: React.FC<MyUILayoutProps> = ({ onEndCall }) => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2 text-lg">Connecting...</span>
      </div>
    );
  }

  return (
    <div className="h-full">
      <StreamTheme>
        <SpeakerLayout participantsBarPosition="bottom" />
        <CallControls onLeave={onEndCall} />
      </StreamTheme>
    </div>
  );
};

const VideoCall: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [callId, setCallId] = useState<string>("");
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId");
  const router = useRouter();

  const apiKey = "ar3ggb2jdcct";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiam9zaCJ9.9rsxyPBjUSCwjlyzKJP_fmtv9exujcVAvMIPM3Gio1g";

  const { user, role } = useAuthContext();

  const initializeCall = useCallback(async () => {
    if (client && callId) {
      const newCall = client.call("default", callId);
      await newCall.join({ create: role === "doctor" });
      setCall(newCall);

      // Only send the call ID to the patient after the call has been created and joined
      if (role === "doctor" && patientId) {
        const patientDocRef = doc(db, "users", patientId);
        await updateDoc(patientDocRef, { call: callId });
      }
    }
  }, [client, callId, role, patientId]);

  useEffect(() => {
    if (role === "doctor" && patientId && user?.uid) {
      const newCallId = `${patientId}-${user.uid}-${Math.floor(
        Math.random() * 99
      )}`;
      setCallId(newCallId);
    } else if (role === "patient" && user?.uid) {
      const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
        const data = doc.data();
        if (data?.call) {
          setCallId(data.call);
        }
      });

      return () => unsubscribe();
    }
  }, [patientId, user, role]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setName(userData.name || "");
      }
    };

    fetchData();
  }, [user]);

  const removeCallFromPatient = async () => {
    if (role === "doctor" && patientId) {
      const patientDocRef = doc(db, "users", patientId);
      await updateDoc(patientDocRef, { call: "" });
    }
  };

  useEffect(() => {
    if (name && role) {
      const streamUser: User = {
        id: role === "doctor" ? "josh" : "patient",
        type: role === "doctor" ? "authenticated" : "guest",
        name: name,
      };

      const newClient = new StreamVideoClient({
        apiKey,
        user: streamUser,
        token,
      });

      setClient(newClient);
    }
  }, [name, role]);

  useEffect(() => {
    if (client && callId) {
      initializeCall();
    }
  }, [client, callId, initializeCall]);

  const handleEndCall = useCallback(async () => {
    await removeCallFromPatient();
    if (role === "doctor") {
      router.push("/protected/doctor/appointments");
    } else if (role === "patient") {
      router.push("/protected/patient");
    } else {
      router.push("/");
    }
  }, [role, router]);

  if (!client) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin" />
        <span className="ml-3 text-xl">Initializing video call...</span>
      </div>
    );
  }

  if (!call || callId === "") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Card className="w-96">
          <CardHeader>
            <h2 className="text-2xl font-bold text-center">Video Call</h2>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">
              {role === "doctor"
                ? "Initializing call..."
                : "Waiting for the doctor to start the call..."}
            </p>
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.back()}>Cancel</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <MyUILayout onEndCall={handleEndCall} />
        </StreamCall>
      </StreamVideo>
    </div>
  );
};

export default VideoCall;
