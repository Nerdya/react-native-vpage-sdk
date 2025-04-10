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
  private engine?: IRtcEngine;
  private eventHandler?: IRtcEngineEventHandler;

  constructor() {
    this.engine = createAgoraRtcEngine();
  }

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
   * @param appId - The App ID for the Agora project.
   */
  initialize(appId: string) {
    if (!this.engine) {
      throw new Error('Engine is not created.');
    }
    return this.engine.initialize({ appId });
  }

  /**
   * Registers event handlers for callbacks.
   * @param eventHandler - An object implementing the IRtcEngineEventHandler interface.
   */
  registerEventHandler(eventHandler: IRtcEngineEventHandler) {
    if (!this.engine) {
      throw new Error('Engine is not created.');
    }
    this.eventHandler = eventHandler;
    this.engine.registerEventHandler(this.eventHandler);
  }

  /**
   * Joins a channel as a host.
   * @param token - The token for authentication.
   * @param channelName - The name of the channel to join.
   * @param localUid - The UID of the local user.
   * @param options - Additional channel media options.
   * @returns A promise that resolves when the user successfully joins the channel.
   */
  joinChannel(token: string, channelName: string, localUid: number, options: ChannelMediaOptions = {}) {
    if (!this.engine) {
      throw new Error('Engine is not created.');
    }
    const opts: ChannelMediaOptions = {
      channelProfile: ChannelProfileType.ChannelProfileCommunication,
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      publishMicrophoneTrack: true,
      publishCameraTrack: true,
      autoSubscribeAudio: true,
      autoSubscribeVideo: true,
      ...options,
    };

    return this.engine.joinChannel(token, channelName, localUid, opts);
  }

  /**
   * Enables video for the RTC engine.
   */
  enableVideo() {
    if (!this.engine) {
      throw new Error('Engine is not created.');
    }
    return this.engine.enableVideo();
  }

  /**
   * Starts the local video preview.
   */
  startPreview() {
    if (!this.engine) {
      throw new Error('Engine is not created.');
    }
    return this.engine.startPreview();
  }

  /**
   * Stops the local video preview.
   */
  stopPreview() {
    if (!this.engine) {
      throw new Error('Engine is not created.');
    }
    return this.engine.stopPreview();
  }

  /**
   * Leaves the current channel.
   */
  leaveChannel() {
    if (!this.engine) {
      throw new Error('Engine is not created.');
    }
    return this.engine.leaveChannel();
  }

  /**
   * Unregisters the event handler from the RTC engine.
   * @returns A boolean indicating whether the event handler was unregistered.
   */
  unregisterEventHandler() {
    if (!this.engine) {
      throw new Error('Engine is not created.');
    }
    if (!this.eventHandler) {
      return false;
    }
    return this.engine.unregisterEventHandler(this.eventHandler);
  }

  /**
   * Cleans up the engine and releases resources.
   */
  cleanup() {
    if (!this.engine) {
      throw new Error('Engine is not created.');
    }
    this.leaveChannel();
    this.stopPreview();
    this.unregisterEventHandler();
    this.engine.release();
    this.engine = undefined;
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
