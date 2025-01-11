import React from 'react';
import {Image, Text, View, Animated, StyleSheet, Modal} from 'react-native';
import {Button} from 'react-native-paper';
import NfcManager from 'react-native-nfc-manager';
import {useOutlet} from 'reconnect.js';

function NfcPromptAndroid(props) {
  const [visible, setVisible] = React.useState(false);
  const animValue = React.useRef(new Animated.Value(0)).current;
  const scaleValue = React.useRef(new Animated.Value(1)).current; // Animation value for scaling
  const [_data, _setData] = useOutlet('androidPrompt');
  const {visible: _visible, message = ''} = _data || {};

  React.useEffect(() => {
    if (_visible) {
      setVisible(true);
      Animated.timing(animValue, {
        duration: 300,
        toValue: 1,
        useNativeDriver: true,
      }).start();

      // Start the continuous scale animation for the icon
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 1.2, // Grow the icon to 120%
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1, // Shrink back to original size
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      Animated.timing(animValue, {
        duration: 200,
        toValue: 0,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
      });

      // Stop scaling animation when prompt is not visible
      scaleValue.stopAnimation();
    }
  }, [_visible, animValue, scaleValue]);

  function cancelNfcScan() {
    setTimeout(() => {
      NfcManager.cancelTechnologyRequest().catch(() => 0);
    }, 200);
    _setData({visible: false, message});
  }

  const bgAnimStyle = {
    backgroundColor: 'rgba(0,0,0,0.3)',
    opacity: animValue,
  };

  const promptAnimStyle = {
    transform: [
      {
        translateY: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [300, 0],
        }),
      },
    ],
  };

  const iconStyle = {
    transform: [{scale: scaleValue}], // Apply the scaling animation to the icon
  };

  return (
    <Modal transparent={true} visible={visible}>
      <View style={[styles.wrapper]}>
        <View style={{flex: 1}} />

        <Animated.View style={[styles.prompt, promptAnimStyle]}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Animated.Image
              source={require('../../images/nfc-512.png')}
              style={[{width: 120, height: 120, padding: 20}, iconStyle]} // Apply scale to the icon
              resizeMode="contain"
            />

            <Text style={{marginTop:30}} >{message}</Text>
          </View>

          <Button mode="contained" onPress={cancelNfcScan}>
            CANCEL
          </Button>
        </Animated.View>

        <Animated.View style={[styles.promptBg, bgAnimStyle]} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  promptBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  prompt: {
    height: 300,
    alignSelf: 'stretch',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 20,
    zIndex: 2,
  },
});

export default NfcPromptAndroid;
