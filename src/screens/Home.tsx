import React, {useEffect, useRef, useState} from 'react';
import {WebView} from 'react-native-webview';
import {Alert, BackHandler, Button, Text, View} from 'react-native';
import {WebViewNativeEvent} from 'react-native-webview/lib/WebViewTypes';
import {useNavigation} from '@react-navigation/native';
import {HeaderBackButton} from '@react-navigation/elements';
import { NativeSyntheticEvent } from 'react-native';

const Home = () => {
  const ref = useRef<WebView>(null);
  const [navState, setNavState] = useState<WebViewNativeEvent>();

  const navigation = useNavigation();

  useEffect(() => {
    const onPress = () => {
        if (canGoBack) {
          ref?.current?.goBack();
          return true;
        } else {
          return false;
        }
      };

    const canGoBack = navState?.canGoBack;

    navigation.setOptions({
      headerLeft: () =>
        canGoBack ? (
          <HeaderBackButton onPress={onPress} tintColor="#58595B" />
        ) : (
          null
        ),
    });

    BackHandler.addEventListener('hardwareBackPress', onPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onPress);
    };
  }, [navState?.canGoBack]);

  //WebView NativeSyntheticEvent<{ data: string }>
  const sendMessageToWebView = (message: NativeSyntheticEvent<{ data: string }>) => {
    if (ref.current) {
      const injectedJavaScript = `
        window.postMessage('${message}', '*');
        true;
      `;
      ref.current.injectJavaScript(injectedJavaScript);
    }
  };

  const sendMessageToReact = () => {
    const message = 'Data from React Native';
    const injectedJavaScript = `
      window.postMessage('${message}', '*');
      true;
    `;
    ref.current?.injectJavaScript(injectedJavaScript);
  };

  const handleWebMessage = (event: NativeSyntheticEvent<{ data: string }>) => {
    const message = event.nativeEvent.data;
    console.log('WebView 에서의 메세지: ', message);

    sendMessageToReact()
  } 



  return (
    <View style={{ flex: 1 }}>
        <WebView
            source={{uri: 'https://survirun-test-2.web.app/test'}}
            ref={ref}
            onNavigationStateChange={e => setNavState(e)}
            onMessage={handleWebMessage}
        />
    </View>
  );
};
export default Home;