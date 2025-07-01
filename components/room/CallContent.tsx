"use client";
import {
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
  useCall,
  Call,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PageLoader from "../shared/Loader";

type Props={
    setShow:React.Dispatch<React.SetStateAction<string>>
}
const CallContent = ({setShow}:Props) => {
  const { useCallCallingState ,useCameraState,useMicrophoneState} = useCallStateHooks();
  const callingState = useCallCallingState();
  const call = useCall();
    const cameraState = useCameraState();
    const microphoneState = useMicrophoneState();
  
  console.log("Call state:", callingState);
  console.log("Call object:", call);

  const router = useRouter();

  const handleLeaving = async () => {
    console.log("Leaving the call...");
    await cameraState.camera.disable(); // Dispose of the camera
    await microphoneState.microphone.disable();
    await call?.screenShare.disable(); // Stop screen sharing if active
    console.log("callingState:", callingState);
    if(callingState === CallingState.LEFT ) {
    await call?.leave(); // Leave the call
    
    }
    await call?.endCall()
    router.push("/"); // Redirect to the home page
  };

  

if (callingState !== CallingState.JOINED) {
return (
    <PageLoader  />
)
}

  return (
    <StreamTheme>
      <SpeakerLayout participantsBarPosition="bottom" />
      <CallControls
        onLeave={handleLeaving}
      />
    </StreamTheme>
  );
};

export default CallContent;
