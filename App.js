import React from 'react';
import Expo from 'expo'
import {
  Easing,
  Dimensions,
  StyleSheet,
  View,
  PanResponder,
  ImageBackground,
  Animated,
} from 'react-native';

import map from './images/map.png'

export default class App extends React.Component {
  state = {
    charPos: new Animated.ValueXY({x: -4000, y: -4000}),
    joystickPos: {
      x: 0,
      y: 0,
    },
  }

  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderGrant: () => {
      this.animateStart()
    },
    onPanResponderMove: e => {
      const posPercent = {
        x: (e.nativeEvent.pageX / Dimensions.get('window').width) * 100,
        y: (e.nativeEvent.pageY / Dimensions.get('window').height) * 100,
      }
      const modPosPercentX = posPercent.x * 2
      if (modPosPercentX <= 100) {
        this.setState({
          joystickPos: {
            x: modPosPercentX - 50,
            y: posPercent.y - 50,
          },
        })
      } else {
        this.animateStop()
      }
    },
    onPanResponderTerminationRequest: () => true,
    onPanResponderRelease: () => {
      console.log('release')
      this.animateStop()
      this.setState({
        joystickPos: {
          x: 0,
          y: 0,
        },
      })
    },
    onPanResponderTerminate: () => {
      console.log('terminate')
      this.animateStop()
      this.setState({
        joystickPos: {
          x: 0,
          y: 0,
        },
      })
    },
    onShouldBlockNativeResponder: () => true,
  });

  animate = () => {
    const sensitivityThresh = 1
    const xSign = Math.sign(this.state.joystickPos.x)
    const ySign = Math.sign(this.state.joystickPos.y)
    const xAbs = Math.abs(this.state.joystickPos.x)
    const yAbs = Math.abs(this.state.joystickPos.y)
    let modX = Math.min(xAbs, 25) / 10 * xSign
    let modY = Math.min(yAbs, 25) / 10 * ySign

    if (Math.abs(modX) < sensitivityThresh) {
      modX = 0
    }
    if (Math.abs(modY) < sensitivityThresh) {
      modY = 0
    }

    Animated.timing(this.state.charPos, {
      toValue: {
        x: this.state.charPos.x._value - modX,
        y: this.state.charPos.y._value - modY,
      },
      duration: 0,
      easing: Easing.inOut(Easing.linear),
    }).start()
  }

  animateStart = () => {
    this.animate()
    this.animateInterval = window.setInterval(this.animate, 1)
  }

  animateStop = () => {
    if (this.animateInterval) {
      window.clearInterval(this.animateInterval)
    }
    this.state.charPos.stopAnimation()
  }

  componentWillMount () {
    Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.LANDSCAPE)
  }

  render() {
    return (
      <View style={styles.viewport}>
        <Animated.Image
          style={{
            width: 8000,
            height: 8000,
            left: this.state.charPos.x,
            top: this.state.charPos.y,
          }}
          source={map}
          {...this.panResponder.panHandlers}
        />
        <View style={styles.sprite} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewport: {
    flex: 1,
  },
  sprite: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -10}, {translateY: -10}],
    width: 20,
    height: 20,
    backgroundColor: 'black',
    borderWidth: 2,
    borderColor: 'red',
  }
});
