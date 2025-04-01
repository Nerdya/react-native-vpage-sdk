# react-native-vpage-sdk

`react-native-vpage-sdk` is a lightweight and easy-to-use React Native SDK for integrating real-time video calls with WebSocket-based session tracking. Designed for Android and iOS, this SDK simplifies the implementation of video calls, ensuring seamless connection management and agent-based call routing.

Features:

✅ Easy Integration – Initialize and start calls with minimal setup.

✅ WebSocket Session Tracking – Keep track of live sessions in real time.

✅ Agent-Based Call Handling – Connect users with agents dynamically.

## Installation

### Installing (React Native >= 0.60.0)

Install `react-native-vpage-sdk` (^4.0.0):

```shell script
yarn add react-native-vpage-sdk
```

or

```shell script
npm i --save react-native-vpage-sdk
```

### iOS Setup

Go to your **ios** folder and run:

```shell script
pod install
```

## Example Usage

```typescript
const VideoComponent = () => {
  const appId = 'YOUR_APP_ID';
  const token = 'YOUR_TOKEN';
  const channelName = 'YOUR_CHANNEL_NAME';
  const localUid = 0;

  const vekycService = createVekycService(appId);
  const [isJoined, setIsJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(0);

  useEffect(() => {
    const init = async () => {
      await vekycService.initialize();
    
      vekycService.registerEventHandler({
        onJoinChannelSuccess: () => {
          vekycService.enableVideo();
          setIsJoined(true);
        },
        onUserJoined: (_connection, uid) => {
          setRemoteUid(uid);
        },
        onUserOffline: (_connection, uid) => {
          if (remoteUid === uid) {
            setRemoteUid(0);
          }
        }
      });
    
      await vekycService.joinChannel(token, channelName, localUid);
    };
    
    init();

    return () => {
      vekycService.cleanup();
    };
  }, []);

  const leave = () => {
    vekycService.leaveChannel();
  }

  return (
    <SafeAreaView style={styles.main}>
      <Text style={styles.head}>Video Call Screen</Text>
      <View style={styles.btnContainer}>
        <Text onPress={leave} style={styles.button}>
          End Call
        </Text>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContainer}>
        {isJoined && (
          <React.Fragment>
            {/* Render local video */}
            <Text>Local user uid: {localUid}</Text>
            <RtcSurfaceView
              canvas={{
                uid: localUid,
                sourceType: VideoSourceType.VideoSourceCamera,
              }}
              style={styles.videoView}
            />

            {/* Render remote video */}
            {remoteUid !== 0 ? (
              <React.Fragment>
                <Text>Remote user uid: {remoteUid}</Text>
                <RtcSurfaceView
                  canvas={{
                    uid: remoteUid,
                    sourceType: VideoSourceType.VideoSourceRemote,
                  }}
                  style={styles.videoView}
                />
              </React.Fragment>
            ) : (
              <Text>Waiting for remote user to join</Text>
            )}
          </React.Fragment>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 25,
    paddingVertical: 4,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#0055cc',
    margin: 5,
  },
  main: { flex: 1, alignItems: 'center' },
  scroll: { flex: 1, backgroundColor: '#ddeeff', width: '100%' },
  scrollContainer: { alignItems: 'center' },
  videoView: { width: '90%', height: 200 },
  btnContainer: { flexDirection: 'row', justifyContent: 'center' },
  head: { fontSize: 20 },
});
```

## Available Functions

### API

| Function                                                         | Description                                                             |
|------------------------------------------------------------------|-------------------------------------------------------------------------|
| `getConfigInfo(appointmentId)`                                   | Retrieves configuration details for a specific appointment.             |
| `createMeeting(appointmentId, agentId?)`                         | Initiates an eKYC meeting for the given appointment and optional agent. |
| `saveLog(actionHistory, detail?, sessionKey?)`                   | Logs an action with optional details and session key for tracking.      |
| `submit(appointmentId, agentId?)`                                | Submits eKYC data for the specified appointment and optional agent.     |
| `verifyOTP(appointmentId, otp)`                                  | Confirms an OTP for the given appointment.                              |
| `resendOTP(appointmentId)`                                       | Sends a new OTP for the specified appointment.                          |
| `checkSelfKYC(sessionKey)`                                       | Verifies if the session is eligible for self-KYC.                       |
| `hook(sessionId, sessionKey, agentId?)`                          | Creates a hook for the specified session and optional agent.            |
| `closeVideo(sessionKey)`                                         | Ends the video session for the provided session key.                    |
| `rateCall(callRating, callFeedback, agentRating, agentFeedback)` | Submits ratings and feedback for the video call and agent.              |

### VEKYC

| Function                                    | Description                                                                                               |
|---------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| `initialize()`                              | Initializes the engine and requests necessary permissions (on Android).                                   |
| `registerEventHandler(eventHandler)`        | Registers event handlers for channel events like join success, remote user join, and leave.               |
| `joinChannel(token, channelName, localUid)` | Joins a channel as a host using the provided token, channel name, and local user ID.                      |
| `enableVideo()`                             | Enables video and starts the local video preview.                                                         |
| `leaveChannel()`                            | Leaves the current channel.                                                                               |
| `cleanup()`                                 | Ensures the channel is left, stops the video preview, unregisters event handlers, and releases resources. |
| `RtcSurfaceView`                            | A React Native component for rendering local or remote video streams.                                     |

## Demo

Check out the [Demo Application](https://github.com/Nerdya/my-video-app) to see how to use this SDK in a real-world project.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
