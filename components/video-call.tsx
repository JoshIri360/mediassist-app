import { useAuthContext } from "@/context/AuthContext";
import {
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCall,
  useCallStateHooks,
  User,
} from "@stream-io/video-react-sdk";

const apiKey = "ar3ggb2jdcct";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiam9zaCJ9.9rsxyPBjUSCwjlyzKJP_fmtv9exujcVAvMIPM3Gio1g";
// const userId = "joshua8";
const callId = "001";

const user: User = {
  id: "joshs",
  type: "guest",
  name: "Joshua Aideloje",
};

const client = new StreamVideoClient({
  apiKey,
  user,
  token,
});

const call = client.call("default", callId);

call.join({ create: true });

export const MyUILayout = () => {
  const { user, role } = useAuthContext();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return <div>Connecting...</div>;
  }

  return (
    <div className="h-full">
      <StreamTheme>
        <SpeakerLayout participantsBarPosition={"bottom"} />
        <CallControls />
      </StreamTheme>
    </div>
  );
};

export default function VideoCall() {
  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <MyUILayout />
      </StreamCall>
    </StreamVideo>
  );
}
