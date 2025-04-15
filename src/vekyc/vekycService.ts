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
 * This function is primarily used for debugging purposes.
 * @returns {IRtcEngine} A new instance of the RTC engine.
 */
export function createVekycEngine(): IRtcEngine {
  return createAgoraRtcEngine();
}

class VekycService {
  private engine?: IRtcEngine;
  private eventHandler?: IRtcEngineEventHandler;

  /**
   * Requests the necessary permissions for audio and video on Android devices.
   * This method is a no-op on platforms other than Android.
   * @returns {Promise<void>} A promise that resolves when permissions are granted or rejected.
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
   * @param {string} appId - The App ID for the project.
   * @returns 0: Success. < 0: Failure.
   */
  initialize(appId: string) {
    if (!this.engine) {
      this.engine = createAgoraRtcEngine();
    }
    return this.engine.initialize({ appId });
  }

  /**
   * Registers an event handler for receiving RTC engine callbacks.
   * @param {IRtcEngineEventHandler} eventHandler - An object implementing the IRtcEngineEventHandler interface.
   * @returns true: Success. false: Failure.
   * @throws {Error} If the engine is not initialized.
   */
  registerEventHandler(eventHandler: IRtcEngineEventHandler) {
    if (!this.engine) {
      throw new Error('Engine is not initialized.');
    }
    this.eventHandler = eventHandler;
    return this.engine.registerEventHandler(this.eventHandler);
  }

  /**
   * Joins a channel as a broadcaster with the specified options.
   * @param {string} token - The token for authentication.
   * @param {string} channelName - The name of the channel to join.
   * @param {number} localUid - The UID of the local user.
   * @param {ChannelMediaOptions} [options={}] - Additional channel media options.
   * @returns 0: Success. < 0: Failure.
   * @throws {Error} If the engine is not initialized.
   */
  joinChannel(token: string, channelName: string, localUid: number, options: ChannelMediaOptions = {}) {
    if (!this.engine) {
      throw new Error('Engine is not initialized.');
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
   * @returns 0: Success. < 0: Failure.
   * @throws {Error} If the engine is not initialized.
   */
  enableVideo() {
    if (!this.engine) {
      throw new Error('Engine is not initialized.');
    }
    return this.engine.enableVideo();
  }

  /**
   * Starts the local video preview.
   * @returns 0: Success. < 0: Failure.
   * @throws {Error} If the engine is not initialized.
   */
  startPreview() {
    if (!this.engine) {
      throw new Error('Engine is not initialized.');
    }
    return this.engine.startPreview();
  }

  /**
   * Stops the local video preview.
   * @returns 0: Success. < 0: Failure.
   * @throws {Error} If the engine is not initialized.
   */
  stopPreview() {
    if (!this.engine) {
      throw new Error('Engine is not initialized.');
    }
    return this.engine.stopPreview();
  }

  /**
   * Leaves the current channel.
   * @returns 0: Success. < 0: Failure.
   * @throws {Error} If the engine is not initialized.
   */
  leaveChannel() {
    if (!this.engine) {
      throw new Error('Engine is not initialized.');
    }
    return this.engine.leaveChannel();
  }

  /**
   * Unregisters the event handler from the RTC engine.
   * @returns {boolean} True if the event handler was successfully unregistered, false otherwise.
   * @throws {Error} If the engine is not initialized.
   */
  unregisterEventHandler() {
    if (!this.engine) {
      throw new Error('Engine is not initialized.');
    }
    if (!this.eventHandler) {
      return false;
    }
    return this.engine.unregisterEventHandler(this.eventHandler);
  }

  /**
   * Cleans up the RTC engine and releases all resources.
   * This method stops the preview, leaves the channel, unregisters the event handler, and releases the engine.
   * @returns {void} Cleans up the engine.
   * @throws {Error} If the engine is not initialized.
   */
  cleanup() {
    if (!this.engine) {
      throw new Error('Engine is not initialized.');
    }
    this.leaveChannel();
    this.stopPreview();
    this.unregisterEventHandler();
    this.engine.release();
    this.engine = undefined;
  }
}

/**
 * Factory function to create a new instance of VekycService.
 * @returns {VekycService} A new instance of VekycService.
 */
export function createVekycService() {
  return new VekycService();
}

// Export for external use
export { RtcSurfaceView, VideoSourceType, IRtcEngineEventHandler, IRtcEngine, RtcEngineContext };
