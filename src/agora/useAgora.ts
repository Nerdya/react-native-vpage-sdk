import { useEffect, useState } from 'react';
import AgoraManager from './AgoraManager';

export const useAgora = (appId: string, channel: string, token: string, uid: number) => {
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    console.log('Initializing Agora hook');
    AgoraManager.initialize(appId);
    AgoraManager.joinChannel(token, channel, uid);
    setIsJoined(true);

    return () => {
      AgoraManager.leaveChannel();
      AgoraManager.release();
      setIsJoined(false);
    };
  }, [appId, channel, token, uid]);

  return { isJoined };
};
