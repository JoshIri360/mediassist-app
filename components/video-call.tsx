import React, { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import WebRTCService from "@/services/WebRTCService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const VideoCallPage: React.FC = () => {
  const { user, role } = useAuthContext();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callId, setCallId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [joinCallId, setJoinCallId] = useState("");

  useEffect(() => {
    // Clean up function to end the call when component unmounts
    return () => {
      WebRTCService.endCall();
    };
  }, []);

  const setupStreams = async () => {
    try {
      await WebRTCService.setupMediaDevices();
      setLocalStream(WebRTCService.getLocalStream());
      setRemoteStream(WebRTCService.getRemoteStream());
    } catch (error) {
      console.error("Error setting up media devices:", error);
      throw new Error(
        "Failed to access camera and microphone. Please check your permissions."
      );
    }
  };

  const startCall = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await setupStreams();
      const newCallId = await WebRTCService.startCall(user!.uid);
      setCallId(newCallId);
    } catch (error) {
      console.error("Error starting call:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to start the call. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const joinCall = async () => {
    if (!joinCallId) {
      setError("Please enter a valid call ID");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await setupStreams();
      await WebRTCService.joinCall(joinCallId, user!.uid);
      setCallId(joinCallId);
    } catch (error) {
      console.error("Error joining call:", error);
      setError(
        "Failed to join the call. Please check the call ID and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const endCall = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await WebRTCService.endCall();
      setLocalStream(null);
      setRemoteStream(null);
      setCallId(null);
    } catch (error) {
      console.error("Error ending call:", error);
      setError("Failed to end the call. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-lg shadow-md w-full max-w-4xl">
        <div className="relative aspect-video">
          <video
            className="w-full h-full rounded object-cover"
            ref={(videoRef) => {
              if (videoRef && localStream) {
                videoRef.srcObject = localStream;
              }
            }}
            autoPlay
            playsInline
            muted
          />
          <p className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            You
          </p>
        </div>
        <div className="relative aspect-video">
          {remoteStream ? (
            <video
              className="w-full h-full rounded object-cover"
              ref={(videoRef) => {
                if (videoRef && remoteStream) {
                  videoRef.srcObject = remoteStream;
                }
              }}
              autoPlay
              playsInline
            />
          ) : (
            <div className="w-full h-full rounded bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">
                Waiting for {role === "doctor" ? "Patient" : "Doctor"} to
                join...
              </p>
            </div>
          )}
          {remoteStream && (
            <p className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
              {role === "doctor" ? "Patient" : "Doctor"}
            </p>
          )}
        </div>
      </div>
      <div className="mt-4 space-y-4 w-full max-w-4xl">
        {!callId && (
          <>
            {role === "doctor" ? (
              <Button
                className="w-full"
                onClick={startCall}
                disabled={isLoading}
              >
                {isLoading ? "Starting Call..." : "Start Call"}
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Enter Call ID"
                  value={joinCallId}
                  onChange={(e) => setJoinCallId(e.target.value)}
                  disabled={isLoading}
                />
                <Button onClick={joinCall} disabled={isLoading || !joinCallId}>
                  {isLoading ? "Joining..." : "Join Call"}
                </Button>
              </div>
            )}
          </>
        )}
        {callId && (
          <Button
            variant="destructive"
            className="w-full"
            onClick={endCall}
            disabled={isLoading}
          >
            {isLoading ? "Ending Call..." : "End Call"}
          </Button>
        )}
        {callId && role === "doctor" && (
          <p className="text-center mt-2">
            Share this Call ID with your patient: <strong>{callId}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoCallPage;
