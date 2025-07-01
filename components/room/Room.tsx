"use client";
import type { INoiseCancellation } from '@stream-io/audio-filters-web';
import {
  BackgroundFiltersProvider,
  Call,
  CallingState,
  CallRequest,
  NoiseCancellationProvider,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
} from '@stream-io/video-react-sdk';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TranslationLanguages } from 'stream-chat';

import { useAppEnvironment } from '../../context/AppEnvironmentContext';
import { useSettings } from '../../context/SettingsContext';
import { TourProvider } from '../../context/TourContext';
import { createTokenProvider, getClient } from '../../helpers/client';
import { useCreateStreamChatClient } from '../../hooks';

import {
  
  ServerSideCredentialsProps,
} from '../../lib/getServerSideCredentialsProps';

import { RingingCallNotification } from '../../components/Ringing/RingingCallNotification';
import { MeetingUI } from '../MeetingUI';



// Extend the Window interface to include 'call' and 'client'
declare global {
  interface Window {
    call?: Call;
    client?: StreamVideoClient;
  }
}
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const CallRoom = (props: ServerSideCredentialsProps) => {
  const router = useRouter();
  const {
    settings: { language, fallbackLanguage },
  } = useSettings();
  const callId = props.callId || '';
  const callType =  'default' ;

  const { apiKey, userToken, user} = props;

  const environment = useAppEnvironment();

  const [client, setClient] = useState<StreamVideoClient>();
  useEffect(() => {
    const _client = getClient({ apiKey, user, userToken }, environment);
    setClient(_client);
    window.client = _client;

    return () => {
      setClient(undefined);
      window.client = undefined;
    };
  }, [apiKey, environment, user, userToken]);

  const tokenProvider = useMemo(
    () => createTokenProvider(user.id, environment),
    [environment, user.id],
  );
  const chatClient = useCreateStreamChatClient({
    apiKey,
    tokenOrProvider: tokenProvider,
    userData: {
      id: '!anon',
      ...(user as Omit<User, 'type' | 'push_notifications'>),
      language: user.language as TranslationLanguages | undefined,
    },
  });

  const [call, setCall] = useState<Call>();
  useEffect(() => {
    if (!client) return;
    const _call = client.call(callType, callId, { reuseInstance: true });
    setCall(_call);

    window.call = _call;

    return () => {
      if (_call.state.callingState !== CallingState.LEFT) {
        _call.leave().catch((e) => console.error('Failed to leave call', e));
        setCall(undefined);

        window.call = undefined;
      }
    };
  }, [callId, callType, client]);

  useEffect(() => {
    if (!call) return;
    // "restricted" is a special call type that only allows
    // `call_member` role to join the call
     const data: CallRequest = { members: [{ user_id: user.id || '!anon', role: 'admin' }] }
    

    call.getOrCreate(data).catch((err) => {
      console.error(`Failed to get or create call`, err);
    });
  }, [call, callType, user.id]);

  // apple-itunes-app meta-tag is used to open the app from the browser
  // we need to update the app-argument to the current URL so that the app
  // can open the correct call
 

  
  const [noiseCancellation, setNoiseCancellation] =
    useState<INoiseCancellation>();
  const ncLoader = useRef<Promise<void>>(undefined);
  useEffect(() => {
    const load = (ncLoader.current || Promise.resolve())
      .then(() => import('@stream-io/audio-filters-web'))
      .then(({ NoiseCancellation }) => {
        // const modelsPath = `${basePath}/krispai/models`;
        // const nc = new NoiseCancellation({ basePath: modelsPath });
        const nc = new NoiseCancellation();
        setNoiseCancellation(nc);
      });
    return () => {
      ncLoader.current = load.then(() => setNoiseCancellation(undefined));
    };
  }, []);

  if (!client || !call) return null;

  return (
    <>
      <Head>
        <title>Stream Calls: {callId}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <StreamVideo
        client={client}
             
      >
        <StreamCall call={call}>
          <TourProvider>
            <BackgroundFiltersProvider
              basePath={`${basePath}/tf`}
              backgroundImages={[
                `${basePath}/backgrounds/amsterdam-1.jpg`,
                `${basePath}/backgrounds/amsterdam-2.jpg`,
                `${basePath}/backgrounds/boulder-1.jpg`,
                `${basePath}/backgrounds/boulder-2.jpg`,
                `${basePath}/backgrounds/gradient-1.jpg`,
                `${basePath}/backgrounds/gradient-2.jpg`,
                `${basePath}/backgrounds/gradient-3.jpg`,
              ]}
              
            >
              {noiseCancellation && (
                <NoiseCancellationProvider
                  noiseCancellation={noiseCancellation}
                >
                  <RingingCallNotification />
                  <MeetingUI key={call.cid} chatClient={chatClient} queryParams={props.searchParams}  />
                </NoiseCancellationProvider>
              )}
            </BackgroundFiltersProvider>
          </TourProvider>
        </StreamCall>
      </StreamVideo>
    </>
  );
};

export default CallRoom;


