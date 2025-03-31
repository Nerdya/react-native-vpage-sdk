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

## General Usage

```typescript

```

### Available Functions

| Function                                                  | Description                                                      |
|-----------------------------------------------------------|------------------------------------------------------------------|
| `getConfigInfo(appointmentId)`                            | Fetches configuration information for a given appointment.       |
| `createEkycMeeting(appointmentId, agentId?)`              | Creates an eKYC meeting for the specified appointment and agent. |
| `saveLog(actionHistory, detail?, sessionKey?)`            | Saves a log entry with optional details and session key.         |
| `verifyCaptcha(secret, captchaToken)`                     | Verifies a CAPTCHA token using the provided secret.              |
| `createEkycSubmit(captchaToken, appointmentId, agentId?)` | Submits eKYC data for the specified appointment and agent.       |
| `verifyOtp(appointmentId, otp)`                           | Verifies an OTP for the specified appointment.                   |
| `resendOtp(appointmentId)`                                | Resends an OTP for the specified appointment.                    |
| `checkSelfKyc(sessionKey)`                                | Checks if the session is self-KYC enabled.                       |
| `createEkycHook(sessionId, sessionKey, agentId?)`         | Creates an eKYC hook for the specified session and agent.        |
| `closeVideo(sessionKey)`                                  | Closes the video session for the specified session key.          |

## Demo

Check out the [Demo Application](https://github.com/Nerdya/my-video-app) to see how to use this SDK in a real-world project.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
