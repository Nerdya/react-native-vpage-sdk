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

class VekycService {
  private eventHandler?: IRtcEngineEventHandler;

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
   * Initializes the RTC engine with the provided App ID.
   * @param engine - The RTC engine instance.
   * @param appId - The App ID for the Agora project.
   * @throws Will throw an error if initialization fails.
   */
  initialize(engine: IRtcEngine, appId: string) {
    try {
      return engine.initialize({ appId });
    } catch (error) {
      console.error('Failed to initialize the engine:', error);
      throw error;
    }
  }

  /**
   * Registers event handlers for callbacks.
   * @param engine - The RTC engine instance.
   * @param eventHandler - An object implementing the IRtcEngineEventHandler interface.
   * @throws Will throw an error if registration fails.
   */
  registerEventHandler(engine: IRtcEngine, eventHandler: IRtcEngineEventHandler) {
    try {
      this.eventHandler = eventHandler;
      engine.registerEventHandler(this.eventHandler);
    } catch (error) {
      console.error('Failed to register event handler:', error);
      throw error;
    }
  }

  /**
   * Joins a channel as a host.
   * @param engine - The RTC engine instance.
   * @param token - The token for authentication.
   * @param channelName - The name of the channel to join.
   * @param localUid - The UID of the local user.
   * @param options - Additional channel media options.
   * @throws Will throw an error if the user is already joined or the engine is not initialized.
   */
  joinChannel(engine: IRtcEngine, token: string, channelName: string, localUid: number, options: ChannelMediaOptions = {}) {
    try {
      const opts: ChannelMediaOptions = {
        channelProfile: ChannelProfileType.ChannelProfileCommunication,
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        publishMicrophoneTrack: true,
        publishCameraTrack: true,
        autoSubscribeAudio: true,
        autoSubscribeVideo: true,
        ...options
      };

      return engine.joinChannel(token, channelName, localUid, opts);
    } catch (error) {
      console.error('Failed to join the channel:', error);
      throw error;
    }
  }

  /**
   * Enables video for the RTC engine.
   * @param engine - The RTC engine instance.
   * @throws Will throw an error if enabling video fails.
   */
  enableVideo(engine: IRtcEngine) {
    try {
      return engine.enableVideo();
    } catch (error) {
      console.error('Failed to enable video:', error);
      throw error;
    }
  }

  /**
   * Starts the local video preview.
   * @param engine - The RTC engine instance.
   * @throws Will throw an error if starting the preview fails.
   */
  startPreiew(engine: IRtcEngine) {
    try {
      return engine.startPreview();
    } catch (error) {
      console.error('Failed to start preview:', error);
      throw error;
    }
  }

  /**
   * Stops the local video preview.
   * @param engine - The RTC engine instance.
   * @throws Will throw an error if stopping the preview fails.
   */
  stopPreview(engine: IRtcEngine) {
    try {
      return engine.stopPreview();
    } catch (error) {
      console.error('Failed to stop preview:', error);
      throw error;
    }
  }

  /**
   * Leaves the current channel.
   * @param engine - The RTC engine instance.
   * @throws Will throw an error if leaving the channel fails.
   */
  leaveChannel(engine: IRtcEngine) {
    try {
      return engine.leaveChannel();
    } catch (error) {
      console.error('Failed to leave the channel:', error);
      throw error;
    }
  }

  /**
   * Unregisters the event handler from the RTC engine.
   * @param engine - The RTC engine instance.
   * @returns A boolean indicating whether the event handler was unregistered.
   * @throws Will throw an error if unregistering fails.
   */
  unregisterEventHandler(engine: IRtcEngine) {
    try {
      if (!this.eventHandler) {
        return false;
      }
      return engine.unregisterEventHandler(this.eventHandler);
    } catch (error) {
      console.error('Failed to unregister event handler:', error);
    }
  }

  /**
   * Cleans up the engine and releases resources.
   * @param engine - The RTC engine instance.
   * @throws Will throw an error if cleanup fails.
   */
  cleanup(engine: IRtcEngine) {
    try {
      this.leaveChannel(engine);
      this.stopPreview(engine);
      this.unregisterEventHandler(engine);
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
export { RtcSurfaceView, VideoSourceType, IRtcEngineEventHandler, IRtcEngine };
