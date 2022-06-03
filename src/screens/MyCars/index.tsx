import React, { useEffect, useState } from 'react';
import { FlatList, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import { AntDesign } from '@expo/vector-icons';

import { BackButton } from '../../components/BackButton';

import { CarDTO } from '../../dtos/CarDTO';
import { api } from '../../services/api';

import {
  Container,
  Header,
  Title,
  Subtitle,
  Content,
  Appointments,
  AppointmentsTitle,
  AppointmentsQuantity,
  CarWrapper,
  CarFooter,
  CarFooterTitle,
  CarFooterPeriod,
  CarFooterDate,
} from './styles';
import { Car } from '../../components/Car';
import { LoadAnimation } from '../../components/LoadAnimation';

interface CarProps {
  id: string;
  user_id: string;
  car: CarDTO;
  startDate: string;
  endDate: string;
}

export function MyCars() {
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loading, setLoading] = useState(true);

  const { goBack } = useNavigation();
  const theme = useTheme();

  function handleGoBack() {
    goBack();
  }

  async function fetchCars() {
    const key = "@rentx:user";
    let id = '';
    try {
      const user = await AsyncStorage.getItem(key);
      if (user) {
        const userData = JSON.parse(user);
        id = userData;
      } else {
        id = `user@` + uuid.v4();
        await AsyncStorage.setItem(key, JSON.stringify(id));
      }
    } catch (error) {
      console.log(error);
    } finally {
      try {
        const response = await api.get(`/schedules_byuser?user_id=${id}`);
        setCars(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <Container>
      <Header>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <BackButton
          onPress={handleGoBack}
          color={theme.colors.shape}
        />
        <Title>
          Seus agendamentos,{'\n'}
          estão aqui.
        </Title>
        <Subtitle>
          Conforto, segurança e praticidade.
        </Subtitle>
      </Header>
      {loading
        ?
        <LoadAnimation />
        :
        <Content>
          <Appointments>
            <AppointmentsTitle>Agendamentos feitos</AppointmentsTitle>
            <AppointmentsQuantity>{cars.length}</AppointmentsQuantity>
          </Appointments>
          <FlatList
            data={cars}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <CarWrapper>
                <Car data={item.car} />
                <CarFooter>
                  <CarFooterTitle>Período</CarFooterTitle>
                  <CarFooterPeriod>
                    <CarFooterDate>{item.startDate}</CarFooterDate>
                    <AntDesign
                      name="arrowright"
                      size={20}
                      color={theme.colors.title}
                      style={{ marginHorizontal: 10 }}
                    />
                    <CarFooterDate>{item.endDate}</CarFooterDate>
                  </CarFooterPeriod>
                </CarFooter>
              </CarWrapper>
            )
            }
            showsVerticalScrollIndicator={false}
          />
        </Content>
      }
    </Container>
  );
}