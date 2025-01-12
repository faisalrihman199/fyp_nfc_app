import * as React from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  Platform,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import NfcProxy from '../../NfcProxy';
import NfcManager, { NfcEvents, NfcTech } from 'react-native-nfc-manager';
import { Button, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAPI } from '../../Context/APIContext';
import { showToast } from '../../Components/Toast';



function HomeScreen(props) {
  const { navigation } = props;
  const [enabled, setEnabled] = React.useState(null);
  const padding = 40;
  const width = Dimensions.get('window').width - 2 * padding;
  const {addTag}=useAPI();
  const {getUser}=useAPI();
  const user=getUser()?._j;
  

  React.useEffect(() => {
    async function initNfc() {
      try {
        setEnabled(await NfcProxy.isEnabled());

        function onBackgroundTag(bgTag) {
          navigation.navigate('Main', {
            screen: 'TagDetail',
            params: { tag: bgTag },
          });
        }

        function onDeepLink(url, launch) {
          try {
            const customScheme = [
              'com.washow.nfcopenrewriter://', // android
              'com.revteltech.nfcopenrewriter://', // ios
            ].find((scheme) => {
              return scheme === url.slice(0, scheme.length);
            });

            if (!customScheme) {
              return;
            }

            url = url.slice(customScheme.length);

            let action = url;
            let query = '';
            let splitIdx = url.indexOf('?');

            if (splitIdx > -1) {
              action = url.slice(0, splitIdx);
              query = url.slice(splitIdx);
            }

            const params = qs.parse(query);
            if (action === 'share') {
              const sharedRecord = JSON.parse(params.data);
              if (sharedRecord.payload?.tech === NfcTech.Ndef) {
                navigation.navigate('Main', {
                  screen: 'NdefWrite',
                  params: { savedRecord: sharedRecord },
                });
              } else {
                navigation.navigate('Main', {
                  screen: 'CustomTransceive',
                  params: {
                    savedRecord: sharedRecord,
                  },
                });
              }
            }
          } catch (ex) {
            console.warn('fail to parse deep link', ex);
          }
        }

        // get the initial launching tag
        const bgTag = await NfcManager.getBackgroundTag();
        if (bgTag) {
          onBackgroundTag(bgTag);
        } else {
          const link = await Linking.getInitialURL();
          if (link) {
            onDeepLink(link, true);
          }
        }

        // listen to other background tags after the app launched
        NfcManager.setEventListener(
          NfcEvents.DiscoverBackgroundTag,
          onBackgroundTag,
        );

        // listen to the NFC on/off state on Android device
        if (Platform.OS === 'android') {
          NfcManager.setEventListener(
            NfcEvents.StateChanged,
            ({ state } = {}) => {
              NfcManager.cancelTechnologyRequest().catch(() => 0);
              if (state === 'off') {
                setEnabled(false);
              } else if (state === 'on') {
                setEnabled(true);
              }
            },
          );
        }
      } catch (ex) {
        console.warn(ex);
      }
    }

    initNfc();
  }, [navigation]);
  const handleAddTag=(uid)=>{
    if(user?.role!=='admin'){
      showToast({
        message: "Sorry! You are not an Admin",
        type: 'error',
        });
        return;
    }
    addTag({uid})
    .then((res)=>{
      console.log("Response :", res)
      if(res.success){
        showToast({
          message: res.message,
          type: 'success',
        });
      }
      else{
        showToast({
          message: res.message,
          type: 'error',
          });
      }
    })
    .catch((err)=>{
      console.log("Error :", err);
      showToast({
        message: err.message,
        type: 'error',
        });
    })
  }


  function renderNfcButtons() {
    return (
      <View
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          right: 0,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
        }}>
        <Button
          mode="contained"
          onPress={async () => {
            const tag = await NfcProxy.readTag();
            if (tag) {
              handleAddTag(tag.id)
              // navigation.navigate('Main', { screen: 'TagDetail', params: { tag } });
            }
          }}
          style={{ width }}>
          SCAN TAG
        </Button>
      </View>
    );
  }

  function renderNfcNotEnabled() {
    return (
      <View
        style={{
          alignItems: 'stretch',
          alignSelf: 'center',
          width,
        }}>
        <Text style={{ textAlign: 'center', marginBottom: 10 }}>
          Your NFC is not enabled. Please first enable it and hit CHECK AGAIN button
        </Text>

        <Button
          mode="contained"
          onPress={() => NfcProxy.goToNfcSetting()}
          style={{ marginBottom: 10 }}>
          GO TO NFC SETTINGS
        </Button>

        <Button
          mode="outlined"
          onPress={async () => {
            setEnabled(await NfcProxy.isEnabled());
          }}>
          CHECK AGAIN
        </Button>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView />
      <View style={{ flex: 1, padding }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../../images/nfc-rewriter-icon.png')}
            style={{ width: 250, height: 250 }}
            resizeMode="contain"
          />
          <Text
            style={{
              padding: 20,
              fontSize: 24,
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#666',
            }}>
            Make Tag Ready to QR Print
          </Text>
          <Text
            style={{
              padding: 10,
              fontSize: 16,
              textAlign: 'center',
              color: '#888',
            }}>
            Use the button below to scan NFC tags and add print-ready tags.
          </Text>
        </View>
        <IconButton
          icon={() => <Icon name="cog" size={25}  />        }
          style={[
            styles.settingIcon,
            {
              
              borderRadius: 16,        
              elevation: 4,    
            },
          ]}
          onPress={() => {
            navigation.navigate('Settings');
          }}
        />

        {enabled ? renderNfcButtons() : renderNfcNotEnabled()}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  settingIcon: {
    position: 'absolute',
    color: 'black',
    top: Platform.OS === 'android' ? 20 : 0,
    right: 20,
  },
});

export default HomeScreen;
