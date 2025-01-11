import * as React from 'react';
import {
  Alert,
  Text,
  View,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-paper';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';

function ToolKitScreen(props) {
  const { navigation } = props;
  const [isScannerVisible, setScannerVisible] = React.useState(false);
  const [isFlashEnabled, setFlashEnabled] = React.useState(false);
  const [currentBorderColor, setCurrentBorderColor] = React.useState('rgb(0, 255, 0)');
  const padding = 40;
  const width = Dimensions.get('window').width - 2 * padding;

  React.useEffect(() => {
    let interval;
    if (isScannerVisible) {
      interval = setInterval(() => {
        setCurrentBorderColor((prevColor) => {
          if (prevColor === 'rgb(0, 255, 0)') {
            return 'rgb(0, 0, 255)'; // Change to blue
          } else if (prevColor === 'rgb(0, 0, 255)') {
            return 'rgb(255, 255, 255)'; // Change to white
          } else {
            return 'rgb(0, 255, 0)'; // Change to green
          }
        });
      }, 300);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval); // Clean up on unmount or visibility change
  }, [isScannerVisible]);

  const handleScan = (e) => {
    Alert.alert('QR Code Scanned', `Data: ${e.data}`);
    setScannerVisible(false); // Hide the scanner after scanning
  };

  return (
    <>
      {!isScannerVisible && (
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              source={require('../../../images/nfc-rewriter-icon.png')}
              style={{ width: 250, height: 250 }}
              resizeMode="contain"
            />
            <Text style={styles.headerText}>SCAN QR READY TAG</Text>
            <Text style={styles.descriptionText}>
              SCAN QR READY TAG TO WRITE DATA TO YOUR NFC TAG
            </Text>
          </View>
          <View style={styles.scanButtonContainer}>
            <Button
              mode="contained"
              onPress={() => setScannerVisible(true)} // Show the QR scanner on button press
              style={{ width }}
            >
              SCAN QR CODE
            </Button>
          </View>
        </View>
      )}

      {isScannerVisible && (
        <>
          <QRCodeScanner
            onRead={handleScan}
            reactivate={true}
            reactivateTimeout={3000}
            flashMode={
              isFlashEnabled
                ? RNCamera.Constants.FlashMode.torch
                : RNCamera.Constants.FlashMode.off
            }
            showMarker={true}
            customMarker={
              <View style={styles.customMarkerContainer}>
                <View
                  style={[
                    styles.marker,
                    {
                      borderColor: currentBorderColor, // Toggle border color
                    },
                  ]}
                />
              </View>
            }
            cameraStyle={{ height: '100%' }}
          />

          {/* Overlay Icons */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => setScannerVisible(false)}>
              <Icon name="close" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFlashEnabled((prev) => !prev)}
            >
              <Icon
                name={isFlashEnabled ? 'flash-on' : 'flash-off'}
                size={30}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  headerText: {
    padding: 20,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#666',
  },
  descriptionText: {
    padding: 10,
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
  },
  scanButtonContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  customMarkerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  marker: {
    width: 250,
    height: 250,
    borderWidth: 4, // Border width
    borderRadius: 10, // Rounded corners
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
    zIndex: 2,
  },
});

export default ToolKitScreen;
