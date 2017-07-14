import React, { Component } from 'react';
import {
  AsyncStorage,
  Image,
  StyleSheet,
  View,
  LayoutAnimation
} from 'react-native';
import { Constants } from 'expo';

import { colors } from 'config';

//Routes
import { GitPoint } from './routes';

// Redux Store
import { configureStore } from './root.store';
import { Provider } from 'react-redux';

import { persistStore } from 'redux-persist';
import createEncryptor from 'redux-persist-transform-encrypt';

// md5
import md5 from 'md5';

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      rehydrated: false
    };
  }

  componentWillMount() {
    const encryptor = createEncryptor({
      secretKey: md5(Constants.deviceId)
    });

    persistStore(
      configureStore,
      { storage: AsyncStorage, transforms: [encryptor] },
      () => {
        this.setState({ rehydrated: true });
      }
    );
  }

  componentWillUpdate() {
    LayoutAnimation.spring();
  }

  render() {
    if (!this.state.rehydrated)
      return (
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('./src/assets/logo-black.png')}
          />
        </View>
      );
    return (
      <Provider store={configureStore}>
        <GitPoint />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  logoContainer: {
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: 100,
    height: 100
  }
});
