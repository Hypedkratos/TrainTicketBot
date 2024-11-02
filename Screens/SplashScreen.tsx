import {Text, StyleSheet, View} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import LottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';

const SplashScreen: React.FC = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('ChatScreen' as never);
    }, 4000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View style={styles.main}>
      <Text style={styles.textMain}>Train Ticket Bot</Text>
      <LottieView
        source={require('../Animations/TrainSplash.json')}
        autoPlay
        loop
        style={styles.animation}
      />
      <View style={styles.lake}>
        <Text style={styles.text}>Made with ♥ by Hypedkratos</Text>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#a2d2ff',
    position: 'relative',
  },
  textMain: {
    textAlign: 'center',
    position: 'absolute',
    top: '30%',
    width: '100%',
    fontSize: 40,
    fontWeight: 'bold',
    color: '#0096c7',
  },
  animation: {
    width: '100%',
    height: 700,
    position: 'absolute',
    bottom: -10,
  },
  lake: {
    width: '100%',
    height: 126,
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#023047',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    color: 'white',
    paddingTop: 30,
    fontSize: 16,
  },
});
