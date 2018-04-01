import React from 'react';
import Expo from 'expo'
import { Dimensions, StyleSheet, View, PanResponder, ImageBackground } from 'react-native';

import map from './images/map.png'

export default class Fight extends React.Component {
  state = {
    pos: {
      x: 0,
      y: 0,
    },
    mov: {
      x: 0,
      y: 0,
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
      this.setState(state => ({
        mov: {
          x: gestureState.dx,
          y: gestureState.dy,
        },
      }), () => console.log('move', this.state))

      // The accumulated gesture distance since becoming responder is
      // gestureState.d{x,y}
    },
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {
      // The user has released all touches while this view is the
      // responder. This typically means a gesture has succeeded
      this.setState(state => ({
        pos: {
          x: state.pos.x + state.mov.x,
          y: state.pos.y + state.mov.y,
        },
        mov: {
          x: 0,
          y: 0,
        },
      }), () => console.log('release', this.state))
    },
    onPanResponderTerminate: (evt, gestureState) => {
      // Another component has become the responder, so this gesture
      // should be cancelled
      this.setState(state => ({
        pos: {
          x: state.pos.x + state.mov.x,
          y: state.pos.y + state.mov.y,
        },
        mov: {
          x: 0,
          y: 0,
        },
      }), () => console.log('terminate', this.state))
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

  render() {
    return (
      <View style={styles.viewport} {...this.panResponder.panHandlers}>
        <ImageBackground
          style={{
            width: 4000,
            height: 4000,
            left: this.state.pos.x + this.state.mov.x,
            top: this.state.pos.y + this.state.mov.y,
          }}
          source={map}
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
