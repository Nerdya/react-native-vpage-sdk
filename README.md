# react-native-vpage-sdk

`react-native-vpage-sdk` is a lightweight and easy-to-use React Native SDK for integrating Agora-powered real-time video calls with WebSocket-based session tracking. Designed for Android and iOS, this SDK simplifies the implementation of Agora video calls, ensuring seamless connection management and agent-based call routing.

Features:

✅ Easy Agora Integration – Initialize and start calls with minimal setup.

✅ WebSocket Session Tracking – Keep track of live sessions in real time.

✅ Agent-Based Call Handling – Connect users with agents dynamically.

## Installation

To install `react-native-vpage-sdk`, use Yarn:

```sh
yarn add react-native-vpage-sdk
```

or npm:

```sh
npm install react-native-vpage-sdk
```

## iOS Setup

After installing the package, navigate to your project's `ios/` directory and run:

```sh
cd ios && pod install
```

This ensures that all necessary dependencies, including `react-native-agora`, are properly linked to your iOS project.

## Usage

```js
import { multiply } from 'react-native-vpage-sdk';

// ...

const result = await multiply(3, 7);
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
