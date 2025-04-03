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

## Available Functions

### API

| Function                                                         | Description                                                             |
|------------------------------------------------------------------|-------------------------------------------------------------------------|
| `getConfigInfo(appointmentId)`                                   | Retrieves configuration details for a specific appointment.             |
| `createMeeting(appointmentId, agentId?)`                         | Initiates an eKYC meeting for the given appointment and optional agent. |
| `saveLog(actionHistory, detail?, sessionKey?)`                   | Logs an action with optional details and session key for tracking.      |
| `submit(appointmentId, agentId?)`                                | Submits eKYC data for the specified appointment and optional agent.     |
| `checkSelfKYC(sessionKey)`                                       | Verifies if the session is eligible for self-KYC.                       |
| `hook(sessionId, sessionKey, agentId?)`                          | Creates a hook for the specified session and optional agent.            |
| `closeVideo(sessionKey)`                                         | Ends the video session for the provided session key.                    |
| `rateCall(callRating, callFeedback, agentRating, agentFeedback)` | Submits ratings and feedback for the video call and agent.              |

### VEKYC

```Check demo project```

## Demo

Check out the [Demo Application](https://github.com/Nerdya/my-video-app) to see how to use this SDK in a real-world project.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
