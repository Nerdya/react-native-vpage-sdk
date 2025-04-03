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
  private engine: IRtcEngine;
  private eventHandler?: IRtcEngineEventHandler;

  constructor() {
    this.engine = createAgoraRtcEngine();
  }

  /**
   * Requests necessary permissions for audio and video on Android.
   * @throws Will throw an error if permissions are denied.
   */
  async getPermissions() {
    try {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ]);
      }
    } catch (error) {
      console.error('Failed to get permissions:', error);
      throw error;
    }
  }

  /**
   * Initializes the RTC engine with the provided context.
   * @param context - The context object containing the App ID and other configurations.
   * @throws Will throw an error if initialization fails.
   */
  initialize(context: RtcEngineContext) {
    try {
      return this.engine.initialize(context);
    } catch (error) {
      console.error('Failed to initialize the engine:', error);
      throw error;
    }
  }

  /**
   * Registers event handlers for callbacks.
   * @param eventHandler - An object implementing the IRtcEngineEventHandler interface.
   * @throws Will throw an error if registration fails.
   */
  registerEventHandler(eventHandler: IRtcEngineEventHandler) {
    try {
      this.eventHandler = eventHandler;
      this.engine.registerEventHandler(this.eventHandler);
    } catch (error) {
      console.error('Failed to register event handler:', error);
      throw error;
    }
  }

  /**
   * Joins a channel as a host.
   * @param token - The token for authentication.
   * @param channelName - The name of the channel to join.
   * @param localUid - The UID of the local user.
   * @param options - Additional channel media options.
   * @throws Will throw an error if the user is already joined or the engine is not initialized.
   */
  joinChannel(token: string, channelName: string, localUid: number, options: ChannelMediaOptions = {}) {
    try {
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
    } catch (error) {
      console.error('Failed to join the channel:', error);
      throw error;
    }
  }

  /**
   * Enables video for the RTC engine.
   * @throws Will throw an error if enabling video fails.
   */
  enableVideo() {
    try {
      return this.engine.enableVideo();
    } catch (error) {
      console.error('Failed to enable video:', error);
      throw error;
    }
  }

  /**
   * Starts the local video preview.
   * @throws Will throw an error if starting the preview fails.
   */
  startPreview() {
    try {
      return this.engine.startPreview();
    } catch (error) {
      console.error('Failed to start preview:', error);
      throw error;
    }
  }

  /**
   * Stops the local video preview.
   * @throws Will throw an error if stopping the preview fails.
   */
  stopPreview() {
    try {
      return this.engine.stopPreview();
    } catch (error) {
      console.error('Failed to stop preview:', error);
      throw error;
    }
  }

  /**
   * Leaves the current channel.
   * @throws Will throw an error if leaving the channel fails.
   */
  leaveChannel() {
    try {
      return this.engine.leaveChannel();
    } catch (error) {
      console.error('Failed to leave the channel:', error);
      throw error;
    }
  }

  /**
   * Unregisters the event handler from the RTC engine.
   * @returns A boolean indicating whether the event handler was unregistered.
   * @throws Will throw an error if unregistering fails.
   */
  unregisterEventHandler() {
    try {
      if (!this.eventHandler) {
        return false;
      }
      return this.engine.unregisterEventHandler(this.eventHandler);
    } catch (error) {
      console.error('Failed to unregister event handler:', error);
      throw error;
    }
  }

  /**
   * Cleans up the engine and releases resources.
   * @throws Will throw an error if cleanup fails.
   */
  cleanup() {
    try {
      this.leaveChannel();
      this.stopPreview();
      this.unregisterEventHandler();
      this.engine.release();
    } catch (error) {
      console.error('Failed to clean up the engine:', error);
      throw error;
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
export { RtcSurfaceView, VideoSourceType, IRtcEngineEventHandler, IRtcEngine, RtcEngineContext };
