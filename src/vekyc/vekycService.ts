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
  RtcEngineContext,
} from 'react-native-agora';

/**
 * Wrapper function to create and return an RTC engine instance.
 * This is retained for debugging purposes.
 * @returns A new instance of IRtcEngine.
 */
export function createVekycEngine(): IRtcEngine {
  return createAgoraRtcEngine();
}

class VekycService {
  private eventHandler?: IRtcEngineEventHandler;

  /**
   * Requests necessary permissions for audio and video on Android.
   */
  async getPermissions() {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    }
  }

  /**
   * Initializes the RTC engine with the provided App ID.
   * @param engine - The RTC engine instance.
   * @param appId - The App ID for the Agora project.
   */
  initialize(engine: IRtcEngine, appId: string) {
    return engine?.initialize({ appId });
  }

  /**
   * Registers event handlers for callbacks.
   * @param engine - The RTC engine instance.
   * @param eventHandler - An object implementing the IRtcEngineEventHandler interface.
   */
  registerEventHandler(engine: IRtcEngine, eventHandler: IRtcEngineEventHandler) {
    this.eventHandler = eventHandler;
    engine?.registerEventHandler(this.eventHandler);
  }

  /**
   * Joins a channel as a host.
   * @param engine - The RTC engine instance.
   * @param token - The token for authentication.
   * @param channelName - The name of the channel to join.
   * @param localUid - The UID of the local user.
   * @param options - Additional channel media options.
   * @returns A promise that resolves when the user successfully joins the channel.
   */
  joinChannel(engine: IRtcEngine, token: string, channelName: string, localUid: number, options: ChannelMediaOptions = {}) {
    const opts: ChannelMediaOptions = {
      channelProfile: ChannelProfileType.ChannelProfileCommunication,
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      publishMicrophoneTrack: true,
      publishCameraTrack: true,
      autoSubscribeAudio: true,
      autoSubscribeVideo: true,
      ...options,
    };

    return engine?.joinChannel(token, channelName, localUid, opts);
  }

  /**
   * Enables video for the RTC engine.
   * @param engine - The RTC engine instance.
   */
  enableVideo(engine: IRtcEngine) {
    return engine?.enableVideo();
  }

  /**
   * Starts the local video preview.
   * @param engine - The RTC engine instance.
   */
  startPreview(engine: IRtcEngine) {
    return engine?.startPreview();
  }

  /**
   * Stops the local video preview.
   * @param engine - The RTC engine instance.
   */
  stopPreview(engine: IRtcEngine) {
    return engine?.stopPreview();
  }

  /**
   * Leaves the current channel.
   * @param engine - The RTC engine instance.
   */
  leaveChannel(engine: IRtcEngine) {
    return engine?.leaveChannel();
  }

  /**
   * Unregisters the event handler from the RTC engine.
   * @param engine - The RTC engine instance.
   * @returns A boolean indicating whether the event handler was unregistered.
   */
  unregisterEventHandler(engine: IRtcEngine) {
    if (!this.eventHandler) {
      return false;
    }
    return engine?.unregisterEventHandler(this.eventHandler);
  }

  /**
   * Cleans up the engine and releases resources.
   * @param engine - The RTC engine instance.
   */
  cleanup(engine: IRtcEngine) {
    this.leaveChannel(engine);
    this.stopPreview(engine);
    this.unregisterEventHandler(engine);
    engine?.release();
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
export { RtcSurfaceView, VideoSourceType, IRtcEngineEventHandler, IRtcEngine, RtcEngineContext };
