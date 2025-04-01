import { PermissionsAndroid, Platform } from 'react-native';
import {
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  RtcConnection,
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
  private isJoined: boolean = false;
  private remoteUid: number = 0;

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
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    }
    
    this.engine = createAgoraRtcEngine();
    await this.engine.initialize({ appId: this.appId });
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
    this.eventHandler = eventHandler;
    this.engine?.registerEventHandler(this.eventHandler);
  }

  /**
   * Joins a channel as a host.
   * @param token - The token for authentication.
   * @param channelName - The name of the channel to join.
   * @param localUid - The UID of the local user.
   * @throws Will throw an error if the user is already joined or the engine is not initialized.
   */
  async joinChannel(token: string, channelName: string, localUid: number) {
    if (this.isJoined) return;
    
    this.engine?.joinChannel(token, channelName, localUid, {
      channelProfile: ChannelProfileType.ChannelProfileCommunication,
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      publishMicrophoneTrack: true,
      publishCameraTrack: true,
      autoSubscribeAudio: true,
      autoSubscribeVideo: true,
    });
  }

  /**
   * Enables video and starts the local video preview.
   */
  enableVideo() {
    this.engine?.enableVideo();
    this.engine?.startPreview();
  }

  /**
   * Leaves the current channel.
   * Resets the internal state (`isJoined` and `remoteUid`).
   */
  leaveChannel() {
    this.engine?.leaveChannel();
    this.isJoined = false;
    this.remoteUid = 0;
  }

  /**
   * Cleans up the engine and releases resources.
   * Ensures the channel is left, video preview is stopped, and the engine is released.
   */
  cleanup() {
    this.leaveChannel();
    this.engine?.stopPreview();
    this.engine?.unregisterEventHandler(this.eventHandler!);
    this.engine?.release();
    this.engine = undefined;
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
