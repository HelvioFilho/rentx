import React, { useEffect } from 'react';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';

import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

import { Container } from './styles';

import BrandSvg from '../../assets/brand.svg';
import LogoSvg from '../../assets/logo.svg';
import { StatusBar } from 'react-native';

export function Splash() {
  const splashAnimation = useSharedValue(0);
  const { dispatch } = useNavigation();

  const brandStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(splashAnimation.value,
        [0, 50],
        [1, 0],
      ),
      transform: [
        {
          translateX: interpolate(splashAnimation.value,
            [0, 50],
            [0, -50],
            Extrapolate.CLAMP
          ),
        }
      ]
    }
  });

  const logoStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(splashAnimation.value,
        [0, 50],
        [0, 1],
      ),
      transform: [
        {
          translateX: interpolate(splashAnimation.value,
            [0, 50],
            [-50, 0],
            Extrapolate.CLAMP
          ),
        }
      ]
    }
  });

  function startApp() {
    dispatch(CommonActions.reset({
      index: 0,
      routes: [{ name: 'SignIn' }]
    }))
  }

  useEffect(() => {
    splashAnimation.value = withTiming(
      50,
      {
        duration: 2000,
      },
      () => {
        'worklet'
        runOnJS(startApp)();
      }
    );
  }, []);

  return (
    <Container>
      <StatusBar
        hidden
      />
      <Animated.View
        style={[brandStyle, { position: 'absolute' }]}
      >
        <BrandSvg
          width={RFValue(73)}
          height={RFValue(73)}
        />
      </Animated.View>
      <Animated.View
        style={[logoStyle, { position: 'absolute' }]}
      >
        <LogoSvg
          width={RFValue(180)}
          height={RFValue(20)}
        />
      </Animated.View>
    </Container>
  );
}