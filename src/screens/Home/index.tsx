import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Dimensions, StatusBar } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
} from 'react-native-reanimated';

import Logo from '../../assets/logo.svg';
import { Car } from '../../components/Car';
import { Load } from '../../components/Load';

import {
  Container,
  Header,
  TotalCars,
  HeaderContent,
  CarList,
} from './styles';
import { api } from '../../services/api';
import { CarDTO } from '../../dtos/CarDTO';
import { useTheme } from 'styled-components';
import { RectButton, PanGestureHandler } from 'react-native-gesture-handler';

type NavigateParamList = {
  navigate: (
    screen: string,
    carObject?: {
      car: CarDTO;
    }
  ) => void
};

const ButtonAnimated = Animated.createAnimatedComponent(RectButton);

export function Home() {
  const { width, height } = Dimensions.get('window');
  const boundX = -(width - 90);
  const boundY = -(height - 120);
  const [cars, setCars] = useState<CarDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const { navigate } = useNavigation<NavigateParamList>();
  const theme = useTheme();

  const positionY = useSharedValue(0);
  const positionX = useSharedValue(0);

  const myCarsButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: positionX.value },
        { translateY: positionY.value },
      ]
    }
  });

  function clamp(value: number, lowerBound: number, upperBound: number): number {
    "worklet";
    return Math.min(Math.max(lowerBound, value), upperBound);
  }

  const onGestureEvent = useAnimatedGestureHandler({
    onStart(_, ctx: any) {
      ctx.positionX = positionX.value;
      ctx.positionY = positionY.value;
    },
    onActive(event, ctx: any) {
      positionX.value = withSpring(clamp(ctx.positionX + event.translationX, boundX, 10));
      positionY.value = withSpring(clamp(ctx.positionY + event.translationY, boundY, 0));
    }
  });

  function handleCarDetails(car: CarDTO) {
    navigate('CarDetails', { car });
  }

  function handleOpenMyCars() {
    navigate('MyCars');
  }

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await api.get('/cars');
        setCars(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCars();
  }, []);

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Header>
        <HeaderContent>
          <Logo
            width={RFValue(108)}
            height={RFValue(12)}
          />
          <TotalCars>
            Total de {cars.length} carros
          </TotalCars>
        </HeaderContent>
      </Header>
      {loading ?
        <Load />
        :
        <CarList
          data={cars}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Car data={item} onPress={() => handleCarDetails(item)} />
          )}
        />
      }
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
      >
        <Animated.View
          style={[
            myCarsButtonStyle,
            {
              position: 'absolute',
              bottom: 13,
              right: 22,
              width: 60,
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 30,
              backgroundColor: theme.colors.main,
            }
          ]}
        >
          <ButtonAnimated
            onPress={handleOpenMyCars}
          >
            <Ionicons
              name="ios-car-sport"
              size={38}
              color={theme.colors.shape}
            />
          </ButtonAnimated>
        </Animated.View>
      </PanGestureHandler>
    </Container>
  );
}