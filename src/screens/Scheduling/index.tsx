import React, { useState } from 'react';
import { Alert, StatusBar } from 'react-native';
import { useTheme } from 'styled-components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';

import {
  Container,
  Header,
  Title,
  RentalPeriod,
  DateInfo,
  DateTitle,
  DateValue,
  Content,
  Footer,
} from './styles';

import { BackButton } from '../../components/BackButton';
import { Button } from '../../components/Button';
import {
  Calendar,
  DayProps,
  generateInterval,
  MarkedDateProps
} from '../../components/Calendar';

import { getPlatformDate } from '../../utils/getPlatformDate';
import { CarDTO } from '../../dtos/CarDTO';

import ArrowSvg from '../../assets/arrow.svg'
interface RentalPeriodProps {
  start: number;
  startFormatted: string;
  end: number;
  endFormatted: string;
}

interface Params {
  car: CarDTO
}

interface NavigateParamList {
  navigate: (
    screen: string,
    carObject: {
      car: CarDTO;
      dates: string[];
    }
  ) => void;
  goBack(): void;
};

export function Scheduling() {
  const [lastSelectedDate, setLastSelectedDate] = useState<DayProps>({} as DayProps);
  const [markedDates, setMarkedDates] = useState<MarkedDateProps>({} as MarkedDateProps);
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriodProps>({} as RentalPeriodProps);

  const theme = useTheme();
  const { navigate, goBack } = useNavigation<NavigateParamList>();
  const route = useRoute();
  const { car } = route.params as Params;

  function handleConfirmRental() {
    if (!rentalPeriod.start || !rentalPeriod.end) {
      Alert.alert('Atenção', 'Selecione o intervalo para alugar.');
    } else {
      navigate('SchedulingDetails', {
        car,
        dates: Object.keys(markedDates)
      });
    }
  }

  function handleGoBack() {
    goBack();
  }

  function handleChangeDate(date: DayProps) {
    let start = !lastSelectedDate.timestamp ? date : lastSelectedDate;
    let end = date;

    if (start.timestamp > end.timestamp) {
      start = end;
      end = start;
    }

    setLastSelectedDate(end);
    const interval = generateInterval(start, end);
    setMarkedDates(interval);

    setRentalPeriod({
      start: start.timestamp,
      startFormatted: format(getPlatformDate(new Date(start.timestamp)), 'dd/MM/yyyy'),
      end: end.timestamp,
      endFormatted: format(getPlatformDate(new Date(end.timestamp)), 'dd/MM/yyyy'),
    });
  }

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
          Escolha uma {'\n'}
          data de início e{'\n'}
          fim do aluguel
        </Title>
        <RentalPeriod>
          <DateInfo>
            <DateTitle>de</DateTitle>
            <DateValue
              selected={!!rentalPeriod.startFormatted}
            >
              {rentalPeriod.startFormatted}
            </DateValue>
          </DateInfo>
          <ArrowSvg />
          <DateInfo>
            <DateTitle>até</DateTitle>
            <DateValue
              selected={!!rentalPeriod.endFormatted}
            >
              {rentalPeriod.endFormatted}
            </DateValue>
          </DateInfo>
        </RentalPeriod>
      </Header>
      <Content>
        <Calendar
          markedDates={markedDates}
          onDayPress={handleChangeDate}
        />
      </Content>
      <Footer>
        <Button title="Confirmar" onPress={handleConfirmRental} />
      </Footer>
    </Container>
  );
}

