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
 * 
 * @returns {IRtcEngine} A new instance of the RTC engine.
 * 
 * Example usage:
 * ```typescript
 * const engine = createVekycEngine();
 * ```
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
   * 
   * @returns {Promise<void>} A promise that resolves when permissions are granted or rejected.
   * 
   * Example usage:
   * ```typescript
   * await vekycService.getPermissions();
   * ```
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
   * 
   * @param {string} appId - The App ID for the project.
   * @returns {number} 0 if successful, or a negative value if initialization fails.
   * 
   * Example usage:
   * ```typescript
   * const result = vekycService.initialize('your-app-id');
   * ```
   */
  initialize(appId: string) {
    if (!this.engine) {
      this.engine = createAgoraRtcEngine();
    }
    return this.engine.initialize({ appId });
  }

  /**
   * Registers an event handler for receiving RTC engine callbacks.
   * 
   * @param {IRtcEngineEventHandler} eventHandler - An object implementing the IRtcEngineEventHandler interface.
   * @returns {boolean | undefined} True if the handler was successfully registered, false otherwise.
   * 
   * Example usage:
   * ```typescript
   * vekycService.registerEventHandler(eventHandler);
   * ```
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
   * 
   * @param {string} token - The token for authentication.
   * @param {string} channelName - The name of the channel to join.
   * @param {number} localUid - The UID of the local user.
   * @param {ChannelMediaOptions} [options={}] - Additional channel media options.
   * @returns {number | undefined} 0 if successful, or a negative value if the operation fails.
   * 
   * Example usage:
   * ```typescript
   * vekycService.joinChannel('your-token', 'channel-name', 12345);
   * ```
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
   * 
   * @returns {number | undefined} 0 if successful, or a negative value if the operation fails.
   * 
   * Example usage:
   * ```typescript
   * vekycService.enableVideo();
   * ```
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
   * 
   * @returns {number | undefined} 0 if successful, or a negative value if the operation fails.
   * 
   * Example usage:
   * ```typescript
   * vekycService.startPreview();
   * ```
   */
  startPreview() {
    if (!this.engine) {
      console.error('Engine is not initialized.');
      return;
    }
    return this.engine.startPreview();
  }

  /**
   * Stops the local video preview.
   * 
   * @returns {number | undefined} 0 if successful, or a negative value if the operation fails.
   * 
   * Example usage:
   * ```typescript
   * vekycService.stopPreview();
   * ```
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
   * 
   * @returns {number | undefined} 0 if successful, or a negative value if the operation fails.
   * 
   * Example usage:
   * ```typescript
   * vekycService.leaveChannel();
   * ```
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
   * 
   * @returns {boolean | undefined} True if the event handler was successfully unregistered, false otherwise.
   * 
   * Example usage:
   * ```typescript
   * vekycService.unregisterEventHandler();
   * ```
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
   * This method stops the preview, leaves the channel, unregisters the event handler, and releases the engine.
   * 
   * @returns {void}
   * 
   * Example usage:
   * ```typescript
   * vekycService.cleanup();
   * ```
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
 * Factory function to create a new instance of VekycService.
 * 
 * @returns {VekycService} A new instance of VekycService.
 * 
 * Example usage:
 * ```typescript
 * const vekycService = createVekycService();
 * ```
 */
export function createVekycService() {
  return new VekycService();
}

// Export for external use
export { RtcSurfaceView, VideoSourceType, IRtcEngineEventHandler, IRtcEngine, RtcEngineContext };
