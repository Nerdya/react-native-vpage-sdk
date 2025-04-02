import { PermissionsAndroid, Platform } from 'react-native';
import {
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  IRtcEngineEventHandler,
  createAgoraRtcEngine,
  RtcSurfaceView,
  VideoSourceType,
} from 'react-native-agora';

/**
 * VekycService provides an abstraction for managing video calls.
 * It encapsulates SDK functionality such as initialization, joining/leaving channels,
 * handling events, and managing video streams.
 */
class VekycService {
  private engine?: IRtcEngine;
  private eventHandler?: IRtcEngineEventHandler;

  /**
   * Creates an instance of VekycService.
   * @param appId - The App ID used to initialize the engine.
   */
  constructor(private appId: string) {}

  /**
   * Initializes the engine and requests necessary permissions (on Android).
   * @throws Will throw an error if permissions are denied or initialization fails.
   */
  async initialize() {
    try {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ]);
      }
  
      this.engine = createAgoraRtcEngine();
      await this.engine.initialize({ appId: this.appId });
    } catch (error) {
      console.error('Failed to initialize the engine:', error);
      throw error;
    }
  }

  /**
   * Registers event handlers for callbacks.
   * 
   * This function allows you to handle key events during the video call lifecycle, such as when the user successfully joins a channel, 
   * when a remote user joins, or when a remote user leaves the channel.
   * 
   * @param eventHandler - An object implementing the IRtcEngineEventHandler interface.
   */
  registerEventHandler(eventHandler: IRtcEngineEventHandler) {
    try {
      this.eventHandler = eventHandler;
      this.engine?.registerEventHandler(this.eventHandler);
    } catch (error) {
      console.error('Failed to register event handler:', error);
    }
  }

  /**
   * Joins a channel as a host.
   * @param token - The token for authentication.
   * @param channelName - The name of the channel to join.
   * @param localUid - The UID of the local user.
   * @throws Will throw an error if the user is already joined or the engine is not initialized.
   */
  async joinChannel(token: string, channelName: string, localUid: number) {
    try {
      this.engine?.setChannelProfile(ChannelProfileType.ChannelProfileCommunication);
      this.engine?.setClientRole(ClientRoleType.ClientRoleBroadcaster);
  
      await this.engine?.joinChannel(token, channelName, localUid, {
        publishMicrophoneTrack: true,
        publishCameraTrack: true,
        autoSubscribeAudio: true,
        autoSubscribeVideo: true,
      });
    } catch (error) {
      console.error('Failed to join the channel:', error);
      throw error;
    }
  }

  /**
   * Enables video and starts the local video preview.
   */
  enableVideo() {
    try {
      this.engine?.enableVideo();
      this.engine?.startPreview();
    } catch (error) {
      console.error('Failed to enable video:', error);
    }
  }

  /**
   * Leaves the current channel.
   * Resets the internal state (`isJoined` and `remoteUid`).
   */
  leaveChannel() {
    try {
      this.engine?.leaveChannel();
    } catch (error) {
      console.error('Failed to leave the channel:', error);
    }
  }

  /**
   * Cleans up the engine and releases resources.
   * Ensures the channel is left, video preview is stopped, and the engine is released.
   */
  cleanup() {
    try {
      this.leaveChannel();
      this.engine?.stopPreview();
      this.engine?.unregisterEventHandler(this.eventHandler!);
      this.engine?.release();
      this.engine = undefined;
    } catch (error) {
      console.error('Failed to clean up the engine:', error);
    }
  }
}

/**
 * Factory function to create an instance of VekycService.
 * @param appId - The App ID used to initialize the engine.
 * @returns A new instance of VekycService.
 */
export function createVekycService(appId: string) {
  return new VekycService(appId);
}

// Export for external use
export { RtcSurfaceView, VideoSourceType, IRtcEngineEventHandler };
