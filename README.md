# react-native-vpage-sdk

A lightweight and easy-to-use React Native SDK for integrating real-time video calls with WebSocket-based session tracking.

## Usage & Demo

Samples using `react-native-vpage-sdk`

[https://github.com/Nerdya/vpage-app](https://github.com/Nerdya/vpage-app)

## Installation

### Installing (React Native >= 0.60.0)

Install `react-native-vpage-sdk` (^4.0.0):

```shell script
yarn add react-native-vpage-sdk
```

or

```shell script
npm i react-native-vpage-sdk
```

## Methods

### Web APIs

Use `createAPIService(options)` to initialize an instance of APIService that has the following methods:

Method | Description
:- | :-
`getConfigInfo(appointmentId)` | Fetches configuration information for a given appointment.
`getIPAddress(timeoutMs?)` | Retrieves the public IP address of the device using the `react-native-public-ip` library.
`createMeeting(appointmentId, customerIp, agentId?)` | Creates a meeting for a given appointment.
`saveLog(contractAction, detail?, sessionKey?)` | Saves a log entry with contract action and optional details.
`hook(sessionId, sessionKey, agentId?)` | Hooks a session with the given session ID, session key, and optional agent ID.
`closeVideo(sessionKey)` | Closes a video session for a given session key.
`getContractList(sessionKey)` | Retrieves the list of contracts associated with a given session key.
`getContractURL(sessionKey)` | Retrieves the URL of a specific contract associated with a session key.
`confirmContract(sessionKey)` | Confirms a contract associated with a given session key.
`rateCall(callRating, callFeedback, agentRating, agentFeedback)` | Rates a call and provides feedback for both the video call and the agent.

### Crypto

Use `createCryptoService()` to initialize an instance of CryptoService that has the following methods:

Method | Description
:- | :-
`encryptionAES(text, key)` | Encrypts a given text using AES encryption with the provided key.
`decryptionAES(text, key)` | Decrypts a given AES-encrypted text using the provided key.
`decryptWS6Url(url)` | Decrypts the token from a given URL and extracts the base URL, appointment ID, and decrypted token.

### VEKYC

Use `createVekycService()` to initialize an instance of VekycService that has the following methods:

Method | Description
:- | :-
`getPermissions()` | Requests the necessary permissions for audio and video on Android and iOS devices.
`initialize(appId)` | Initializes the RTC engine with the provided App ID.
`registerEventHandler(eventHandler)` | Registers an event handler for receiving RTC engine callbacks.
`joinChannel(token, channelName, localUid, options?)` | Joins a channel as a broadcaster with the specified options.
`enableVideo()` | Enables video functionality in the RTC engine.
`startPreview()` | Starts the local video preview.
`toggleMicrophone(isEnabled)` | Toggles the microphone state for the local user.
`switchCamera()` | Switches the camera between the front and rear cameras.
`stopPreview()` | Stops the local video preview.
`leaveChannel()` | Leaves the current channel.
`unregisterEventHandler()` | Unregisters the event handler from the RTC engine.
`cleanup()` | Cleans up the RTC engine and releases all resources.

### WebSocket

Use `createSocketService()` to initialize an instance of VekycService that has the following methods:

Method | Description
:- | :-
`initialize(serverURL, sessionKey, token, debugCallback?)` | Initializes the STOMP client with the given WebSocket server URL and configuration.
`subscribe(topic, callback)` | Subscribes to a specific topic on the WebSocket server.
`subscribeSessionNotifyTopic(callback)` | Subscribes to the session notification topic.
`subscribeSocketNotifyTopic(callback)` | Subscribes to the socket notification topic.
`subscribeSocketHealthTopic(callback)` | Subscribes to the socket health topic.
`subscribeAppLiveTopic(callback)` | Subscribes to the application live topic.
`send(destination, headers?, body?)` | Sends a message to a specific destination using the STOMP client.
`clearHealthCheck()` | Clears the health check interval.
`startHealthCheck(socketService)` | Starts the interval to send health checks.
`validateToken(socketService)` | Validates the token by sending a health check message.
`sendNetworkStatus(downlinkNetworkQuality, uplinkNetworkQuality, isLow)` | Sends the network status to the server.
`registerEventHandler(handlers)` | Registers event handlers for the STOMP client.
`getDeviceInfo(appName?)` | Retrieves device information including the operating system, device model, and browser name.
`connect(deviceInfo?)` | Connects to the STOMP WebSocket server.
`disconnect()` | Disconnects from the STOMP WebSocket server.
`unregisterEventHandler()` | Unregisters all event handlers for the STOMP client.
`unsubscribe()` | Unsubscribes from a specific topic.
`unsubscribeTopics()` | Unsubscribes from all predefined topics.
`cleanup()` | Cleans up the STOMP client instance by clearing health checks, disconnecting, and unregistering handlers.

## License

MIT
