import React from 'react';
import { StatusBar, useWindowDimensions } from 'react-native';

import LogoSvg from '../../assets/logo_background_gray.svg';
import DoneSvg from '../../assets/done.svg';

import {
  Container,
  Content,
  Title,
  Message,
  Footer,
} from './styles';
import { ConfirmButton } from '../../components/ConfirmButton';
import { useNavigation, useRoute } from '@react-navigation/native';

interface Params {
  title: string;
  message: string;
  nextScreenRoute: string;
}

interface NavigationProps {
  navigate: (value: string) => void;
}

export function Confirmation() {
  const { width } = useWindowDimensions();
  const { navigate } = useNavigation<NavigationProps>();
  const { params } = useRoute();
  const { title, message, nextScreenRoute } = params as Params;

  function handleConfirm() {
    navigate(nextScreenRoute);
  }

  return (
    <Container>
      <StatusBar
        barStyle='light-content'
        translucent
        backgroundColor="transparent"

      />
      <LogoSvg
        width={width}
      />
      <Content>
        <DoneSvg width={80} height={80} />
        <Title>{title}</Title>
        <Message>{message}</Message>
      </Content>
      <Footer>
        <ConfirmButton title="ok" onPress={handleConfirm} />
      </Footer>
    </Container>
  );
}

