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
 * Creates and returns a new RTC engine instance.
 * @returns A new instance of the RTC engine.
 */
export function createVekycEngine(): IRtcEngine {
  return createAgoraRtcEngine();
}

class VekycService {
  private engine?: IRtcEngine;
  private eventHandler?: IRtcEngineEventHandler;

  /**
   * Requests the necessary permissions for audio and video on Android devices.
   * @returns A promise resolving when permissions are granted or rejected.
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
   * @param appId - The App ID for the project.
   * @returns 0 if successful, or a negative value if initialization fails.
   */
  initialize(appId: string) {
    if (!this.engine) {
      this.engine = createAgoraRtcEngine();
    }
    return this.engine.initialize({ appId });
  }

  /**
   * Registers an event handler for receiving RTC engine callbacks.
   * @param eventHandler - An object implementing the IRtcEngineEventHandler interface.
   * @returns True if the handler was successfully registered, or `undefined` if the engine is not initialized.
   */
  registerEventHandler(eventHandler: IRtcEngineEventHandler) {
    if (!this.engine) {
      console.error('Engine is not initialized.');
      return;
    }
    this.eventHandler = eventHandler;
    return this.engine.registerEventHandler(this.eventHandler);
  }

  /**
   * Joins a channel as a broadcaster with the specified options.
   * @param token - The token for authentication.
   * @param channelName - The name of the channel to join.
   * @param localUid - The UID of the local user.
   * @param options - (Optional) Additional channel media options.
   * @returns 0 if successful, or a negative value if the operation fails.
   */
  joinChannel(token: string, channelName: string, localUid: number, options: ChannelMediaOptions = {}) {
    if (!this.engine) {
      console.error('Engine is not initialized.');
      return;
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
   * Enables video functionality in the RTC engine.
   * @returns 0 if successful, or a negative value if the operation fails.
   */
  enableVideo() {
    if (!this.engine) {
      console.error('Engine is not initialized.');
      return;
    }
    return this.engine.enableVideo();
  }

  /**
   * Starts the local video preview.
   * @returns 0 if successful, or a negative value if the operation fails.
   */
  startPreview() {
    if (!this.engine) {
      console.error('Engine is not initialized.');
      return;
    }
    return this.engine.startPreview();
  }

  /**
   * Toggles the microphone state for the local user.
   * @param isEnabled - Pass `true` to enable the microphone, or `false` to disable it.
   * @returns 0 if successful, or a negative value if the operation fails.
   */
  toggleMicrophone(isEnabled: boolean) {
    if (!this.engine) {
      console.error('Engine is not initialized.');
      return;
    }
    return this.engine.enableLocalAudio(isEnabled);
  }

  /**
   * Switches the camera between the front and rear cameras.
   * @returns 0 if successful, or a negative value if the operation fails.
   */
  switchCamera() {
    if (!this.engine) {
      console.error('Engine is not initialized.');
      return;
    }
    return this.engine.switchCamera();
  }

  /**
   * Stops the local video preview.
   * @returns 0 if successful, or a negative value if the operation fails.
   */
  stopPreview() {
    if (!this.engine) {
      console.error('Engine is not initialized.');
      return;
    }
    return this.engine.stopPreview();
  }

  /**
   * Leaves the current channel.
   * @returns 0 if successful, or a negative value if the operation fails.
   */
  leaveChannel() {
    if (!this.engine) {
      console.error('Engine is not initialized.');
      return;
    }
    return this.engine.leaveChannel();
  }

  /**
   * Unregisters the event handler from the RTC engine.
   * @returns True if the event handler was successfully unregistered, false otherwise.
   */
  unregisterEventHandler() {
    if (!this.engine) {
      console.error('Engine is not initialized.');
      return;
    }
    if (!this.eventHandler) {
      return false;
    }
    return this.engine.unregisterEventHandler(this.eventHandler);
  }

  /**
   * Cleans up the RTC engine and releases all resources.
   * Stops the preview, leaves the channel, unregisters the event handler, and releases the engine.
   */
  cleanup() {
    if (!this.engine) {
      console.error('Engine is not initialized.');
      return;
    }
    this.leaveChannel();
    this.stopPreview();
    this.unregisterEventHandler();
    this.engine.release();
    this.engine = undefined;
  }
}

/**
 * Creates and returns a new instance of VekycService.
 * @returns A new instance of VekycService.
 */
export function createVekycService() {
  return new VekycService();
}

// Export for external use
export { RtcSurfaceView, VideoSourceType, IRtcEngineEventHandler, IRtcEngine, RtcEngineContext };
