import React from 'react';
import Expo from 'expo'
import {
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
    pos: {
      x: new Animated.Value(-4000),
      y: new Animated.Value(-4000),
    },
  }

  panResponder = PanResponder.create({
    // Ask to be the responder:
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

    onPanResponderGrant: (evt, gestureState) => {
      // The gesture has started. Show visual feedback so the user knows
      // what is happening!

      // gestureState.d{x,y} will be set to zero now
    },
    onPanResponderMove: (evt, gestureState) => {
      // The most recent move distance is gestureState.move{X,Y}

      // The accumulated gesture distance since becoming responder is
      // gestureState.d{x,y}
      const right = gestureState.dx >= 0
      const down = gestureState.dy >= 0
      const viewportWidth = Dimensions.get('window').width
      const viewportHeight = Dimensions.get('window').height
      const xDist = (gestureState.dx / viewportWidth) * 4000
      const yDist = (gestureState.dy / viewportHeight) * 2000
      const xVel = Math.abs(xDist / 10)
      const yVel = Math.abs(yDist / 10)
      console.log(xDist, xVel, yDist, yVel)

      if (xVel > 10) {
        Animated.spring(this.state.pos.x, {
          toValue: this.state.pos.x._value - xDist,
          stiffness: 10,
          damping: 10,
          mass: 1,
          overshootClamping: true,
        }).start()
      } else {
        this.state.pos.x.stopAnimation()
      }

      if (yVel > 10) {
        Animated.spring(this.state.pos.y, {
          toValue: this.state.pos.y._value - yDist,
          stiffness: 10,
          damping: 10,
          mass: 1,
          overshootClamping: true,
        }).start()
      } else {
        this.state.pos.y.stopAnimation()
      }
    },
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {
      // The user has released all touches while this view is the
      // responder. This typically means a gesture has succeeded
      console.log('release')

      this.state.pos.x.stopAnimation()
      this.state.pos.y.stopAnimation()
    },
    onPanResponderTerminate: (evt, gestureState) => {
      // Another component has become the responder, so this gesture
      // should be cancelled
      console.log('terminate')

      this.state.pos.x.stopAnimation()
      this.state.pos.y.stopAnimation()
    },
    onShouldBlockNativeResponder: (evt, gestureState) => {
      // Returns whether this component should block native components from becoming the JS
      // responder. Returns true by default. Is currently only supported on android.
      return true;
    },
  });

  componentWillMount () {
    Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.LANDSCAPE)
  }

  componentDidMount () {
    console.log(this.state)
  }

  componentDidUpdate () {
    console.log(this.state)
  }

  render() {
    return (
      <View style={styles.viewport}>
        <Animated.Image
          style={{
            width: 8000,
            height: 8000,
            left: this.state.pos.x,
            top: this.state.pos.y,
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
