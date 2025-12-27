import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import useAuthUser from "../hooks/useAuthUser";
import { getStreamToken } from "../lib/api";
import PageLoader from "../components/PageLoader";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  StreamTheme,
  CallingState,
  useCallStateHooks,
  useParticipants,
  ParticipantView,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    let videoClient;
    let callInstance;

    const initCall = async () => {
      if (!tokenData?.token || !authUser || !callId) return;

      try {
        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };

        videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Join call error:", error);
        toast.error("Could not join the call");
        navigate("/");
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();

    // ✅ CLEANUP (VERY IMPORTANT)
    return () => {
      if (callInstance) {
        callInstance.leave();
      }
      if (videoClient) {
        videoClient.disconnectUser();
      }
    };
  }, [tokenData, authUser, callId, navigate]);

  if (isLoading || isConnecting) {
    return <PageLoader />;
  }

  return (
    <div className="h-screen bg-base-200">
      {client && call ? (
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <CallContent />
          </StreamCall>
        </StreamVideo>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>Unable to initialize call</p>
        </div>
      )}
    </div>
  );
};

/* ---------------- CALL CONTENT ---------------- */

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) {
    navigate("/");
    return null;
  }

  return (
    <StreamTheme>
      <CustomLayout />
      <CallControls />
    </StreamTheme>
  );
};

/* ---------------- CUSTOM LAYOUT ---------------- */

const CustomLayout = () => {
  const participants = useParticipants();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 h-full">
      {participants.map((participant) => {
        const isSpeaking = participant.isSpeaking;

        return (
          <div
            key={participant.sessionId}
            className={`relative rounded-xl overflow-hidden bg-black transition-all
              ${isSpeaking ? "ring-4 ring-green-500" : "ring-1 ring-gray-700"}
            `}
          >
            <ParticipantView participant={participant} />

            {/* NAME + AVATAR */}
            <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full">
              <img
                src={participant.user?.image}
                alt={participant.user?.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-white">
                {participant.user?.name}
              </span>
            </div>

            {/* SPEAKING BADGE */}
            {isSpeaking && (
              <div className="absolute top-2 right-2 bg-green-500 text-black text-xs font-semibold px-2 py-1 rounded">
                Speaking
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CallPage;
