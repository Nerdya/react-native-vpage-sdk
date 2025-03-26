import { createAgoraRtcEngine, IRtcEngine } from 'react-native-agora';

class AgoraManager {
  private engine: IRtcEngine | null = null;

  initialize(appId: string) {
    console.log('Initializing Agora with App ID:', appId);
    if (!this.engine) {
      this.engine = createAgoraRtcEngine();
      this.engine.initialize({ appId });
      this.engine.enableVideo();
    }
  }

  joinChannel(token: string, channelName: string, uid: number) {
    if (!this.engine) {
      console.error('Agora engine is not initialized.');
      return;
    }
    console.log(`Joining channel: ${channelName} with UID: ${uid}`);
    this.engine.joinChannel(token, channelName, uid, { clientRoleType: 1 });
  }

  leaveChannel() {
    if (!this.engine) {
      console.error('Agora engine is not initialized.');
      return;
    }
    console.log('Leaving channel');
    this.engine.leaveChannel();
  }

  release() {
    console.log('Releasing Agora engine');
    this.engine?.release();
    this.engine = null;
  }
}

export default new AgoraManager();
