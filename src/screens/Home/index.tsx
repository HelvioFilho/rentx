import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNetInfo } from '@react-native-community/netinfo';
import { synchronize } from '@nozbe/watermelondb/sync';

import {Car as ModelCar} from '../../database/model/Car';

import Logo from '../../assets/logo.svg';
import { Car } from '../../components/Car';
import { LoadAnimation } from '../../components/LoadAnimation';

import {
  Container,
  Header,
  TotalCars,
  HeaderContent,
  CarList,
} from './styles';
import { api } from '../../services/api';
import { CarDTO } from '../../dtos/CarDTO';
import { database } from '../../database';

type NavigateParamList = {
  navigate: (
    screen: string,
    carObject?: {
      car: CarDTO;
    }
  ) => void
};

export function Home() {
  const [cars, setCars] = useState<CarDTO[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { navigate } = useNavigation<NavigateParamList>();
  const netInfo = useNetInfo();

  function handleCarDetails(car: CarDTO) {
    navigate('CarDetails', { car });
  }

  async function offlineSynchronize(){
    await synchronize({
      database,
      pullChanges: async ({lastPulledAt}) => {
        // const {data} = await api.post(`/cars/async`);
        // console.log(lastPulledAt);
        // const {changes, latestVersion} = data;
        return {changes:{}, timestamp: 1657108800};        
      },
      pushChanges: async ({changes}) => {
        const user = changes.user;
        try{
          await api.post('/user/async', user);

        }catch(err){
          console.log(err);
        }
      },
    });
  }

  useEffect(() => {
    let isMounted = true;
    async function fetchCars() {
      try {
        const response = await api.get('/cars');
        // const carCollection = database.get<ModelCar>('cars');
        // const cars = await carCollection.query().fetch();

        if (isMounted) {
          setCars(response.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchCars();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if(netInfo.isConnected === true){
      offlineSynchronize();
    }
  },[netInfo.isConnected]);

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
        hidden={false}
      />
      <Header>
        <HeaderContent>
          <Logo
            width={RFValue(108)}
            height={RFValue(12)}
          />
          {
            !loading &&
            <TotalCars>
              Total de {cars.length} carros
            </TotalCars>
          }
        </HeaderContent>
      </Header>
      {loading ?
        <LoadAnimation />
        :
        <CarList
          data={cars}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Car data={item} onPress={() => handleCarDetails(item)} />
          )}
        />
      }
    </Container>
  );
}