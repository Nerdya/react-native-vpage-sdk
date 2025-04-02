import { PermissionsAndroid, Platform } from 'react-native';
import {
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  IRtcEngineEventHandler,
  createAgoraRtcEngine,
  RtcSurfaceView,
  VideoSourceType,
  ChannelMediaOptions,
} from 'react-native-agora';

/**
 * Wrapper function to create and return an RTC engine instance.
 * @returns A new instance of IRtcEngine.
 */
export function createVekycEngine(): IRtcEngine {
  return createAgoraRtcEngine();
}

/**
 * VekycService provides an abstraction for managing video calls.
 * It encapsulates SDK functionality such as initialization, joining/leaving channels,
 * handling events, and managing video streams.
 */
class VekycService {
  private eventHandler?: IRtcEngineEventHandler;

  /**
   * Initializes the engine and requests necessary permissions (on Android).
   * @param engine - The Agora RTC engine instance.
   * @param appId - The App ID used to initialize the engine.
   * @throws Will throw an error if permissions are denied or initialization fails.
   */
  async initialize(engine: IRtcEngine, appId: string) {
    try {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ]);
      }

      await engine.initialize({ appId });
    } catch (error) {
      console.error('Failed to initialize the engine:', error);
      throw error;
    }
  }

  /**
   * Registers event handlers for callbacks.
   * @param engine - The RTC engine instance.
   * @param eventHandler - An object implementing the IRtcEngineEventHandler interface.
   */
  registerEventHandler(engine: IRtcEngine, eventHandler: IRtcEngineEventHandler) {
    try {
      this.eventHandler = eventHandler;
      engine.registerEventHandler(this.eventHandler);
    } catch (error) {
      console.error('Failed to register event handler:', error);
    }
  }

  /**
   * Joins a channel as a host.
   * @param engine - The RTC engine instance.
   * @param token - The token for authentication.
   * @param channelName - The name of the channel to join.
   * @param localUid - The UID of the local user.
   * @throws Will throw an error if the user is already joined or the engine is not initialized.
   */
  async joinChannel(engine: IRtcEngine, token: string, channelName: string, localUid: number, options: ChannelMediaOptions = {}) {
    try {
      const opts: ChannelMediaOptions = {
        channelProfile: ChannelProfileType.ChannelProfileCommunication,
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        publishMicrophoneTrack: true,
        publishCameraTrack: true,
        autoSubscribeAudio: true,
        autoSubscribeVideo: true,
        ...options
      }

      await engine.joinChannel(token, channelName, localUid, opts);
    } catch (error) {
      console.error('Failed to join the channel:', error);
      throw error;
    }
  }

  /**
   * Enables video and starts the local video preview.
   * @param engine - The RTC engine instance.
   */
  enableVideo(engine: IRtcEngine) {
    try {
      engine.enableVideo();
      engine.startPreview();
    } catch (error) {
      console.error('Failed to enable video:', error);
    }
  }

  /**
   * Leaves the current channel.
   * @param engine - The RTC engine instance.
   */
  leaveChannel(engine: IRtcEngine) {
    try {
      engine.leaveChannel();
    } catch (error) {
      console.error('Failed to leave the channel:', error);
    }
  }

  /**
   * Cleans up the engine and releases resources.
   * @param engine - The RTC engine instance.
   */
  cleanup(engine: IRtcEngine) {
    try {
      this.leaveChannel(engine);
      engine.stopPreview();
      if (this.eventHandler) {
        engine.unregisterEventHandler(this.eventHandler);
      }
      engine.release();
    } catch (error) {
      console.error('Failed to clean up the engine:', error);
    }
  }
}

/**
 * Factory function to create an instance of VekycService.
 * @returns A new instance of VekycService.
 */
export function createVekycService() {
  return new VekycService();
}

// Export for external use
export { RtcSurfaceView, VideoSourceType, IRtcEngineEventHandler };
