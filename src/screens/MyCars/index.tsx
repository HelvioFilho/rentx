import React, { useEffect, useState } from 'react';
import { FlatList, Image, Modal, StatusBar, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import uuid from 'react-native-uuid';

import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { BackButton } from '../../components/BackButton';

import { CarDTO } from '../../dtos/CarDTO';
import { api } from '../../services/api';

import cancelado from '../../assets/cancelado.png';

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
  TitleButton,
} from './styles';
import { Car } from '../../components/Car';
import { LoadAnimation } from '../../components/LoadAnimation';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { WarningModal } from '../../components/WarningModal';

interface CarProps {
  id: string;
  user_id: string;
  car: CarDTO;
  startDate: string;
  endDate: string;
  status: string;
}

interface ExtraProps {
  data: CarProps;
  statusChange: string;
}

export function MyCars() {
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [extraData, setExtraData] = useState('');
  const [schedules, setSchedules] = useState(0);
  const [updateSchedules, setUpdateSchedules] = useState(true);
  const [visible, setVisible] = useState(false);
  const [cancelId, setCancelId] = useState('');

  const { goBack } = useNavigation();
  const theme = useTheme();

  function sortCar(cars: CarProps[]): CarProps[] {
    const scheduleActive = cars.filter((item) => item.status === '1');
    const scheduleCancelled = cars.filter((item) => item.status === '0');
    const data = [
      ...scheduleActive,
      ...scheduleCancelled
    ]
    return data;
  }

  function cancelSchedule(id: string) {
    setCancelId(id);
    setVisible(true);
  }

  function checkSchedules() {
    const schedule = cars.filter((item) => item.status !== '0');
    setSchedules(schedule.length);
  }

  async function handleCancelScheduling() {
    const id = cancelId;
    setVisible(false);
    const index = cars.findIndex(car => { return car.id === id });
    const updatedCars = cars.map(car => ({ ...car }));
    updatedCars[index].status = "0";
    setCars(sortCar(updatedCars));
    setExtraData(id);
    setUpdateSchedules(!updateSchedules);
    try {
      await api.get(`/cancel?id=${id}`);
    } catch (error) {
      console.log(error);
    }
  }

  function CarContent(item: ExtraProps) {
    return (
      <CarWrapper>
        {
          item.statusChange === '0' &&
          <Image
            source={cancelado}
            resizeMode="contain"
            style={{
              position: "absolute",
              zIndex: 300,

            }}
          />
        }
        <Car data={item.data.car} />
        <CarFooter>
          <CarFooterTitle>Período</CarFooterTitle>
          <CarFooterPeriod>
            <CarFooterDate>{item.data.startDate}</CarFooterDate>
            <AntDesign
              name="arrowright"
              size={20}
              color={theme.colors.title}
              style={{ marginHorizontal: 10 }}
            />
            <CarFooterDate>{item.data.endDate}</CarFooterDate>
          </CarFooterPeriod>
        </CarFooter>
      </CarWrapper>
    );
  }

  function rightActions(id: string) {
    return (
      <TouchableOpacity
        style={{
          position: 'relative',
          top: 0,
          left: 10,
          width: RFPercentage(14),
          height: RFValue(75),
        }}
        activeOpacity={0.8}
        onPress={() => cancelSchedule(id)}
      >
        <View
          style={{
            borderTopRightRadius: 7,
            borderBottomRightRadius: 7,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'red',
            paddingVertical: 23,
          }}
        >
          <MaterialCommunityIcons
            name="cancel"
            color="white"
            size={28}
          />
          <TitleButton>
            Cancelar
          </TitleButton>
        </View>
      </TouchableOpacity>
    );
  }

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
        const data = response.data as CarProps[];
        setCars(sortCar(data));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        setUpdateSchedules(!updateSchedules);
      }
    }
  }

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    checkSchedules();
  }, [updateSchedules]);
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
            <AppointmentsQuantity>{schedules}</AppointmentsQuantity>
          </Appointments>
          <FlatList
            data={cars}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              const statusChange = item.id === extraData ? "0" : item.status;
              const data = {
                data: item,
                statusChange
              }
              return (
                <>
                  {
                    statusChange === '1' ?
                      <Swipeable renderRightActions={() => rightActions(item.id)}>

                        <CarContent {...data} />
                      </Swipeable>
                      :
                      <CarContent {...data} />
                  }
                </>
              )
            }
            }
            extraData={extraData}
            showsVerticalScrollIndicator={false}
          />
        </Content>
      }
      <Modal
        animationType="fade"
        transparent
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <WarningModal
          message={`Tem certeza que deseja cancelar o agendamento?${'\n'}Essa ação não pode ser desfeita!`}
          button={[
            {
              title: "Não",
              color: theme.colors.success,
              close: true,
            },
            {
              title: "Sim",
              color: theme.colors.main,
              close: false,
            },
          ]}
          closeModal={() => setVisible(false)}
          primaryFunction={handleCancelScheduling}
        />
      </Modal>
    </Container >
  );
}