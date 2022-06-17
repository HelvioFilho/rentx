import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Keyboard, KeyboardAvoidingView } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';

import {
  Container,
  Header,
  Steps,
  Title,
  Subtitle,
  Form,
  FormTitle,
} from './styles';

export function SignUpFirstStep() {
  const { goBack } = useNavigation();
  return (
    <KeyboardAvoidingView
      behavior="position"
      enabled
    >
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        accessible={false}
      >
        <Container>
          <Header>
            <BackButton onPress={goBack} />
            <Steps>
              <Bullet active />
              <Bullet />
            </Steps>
          </Header>
          <Title>
            Crie sua{`\n`}conta
          </Title>
          <Subtitle>
            Faça seu cadastro de{'\n'}forma rápida e fácil.
          </Subtitle>
          <Form>
            <FormTitle>1. Dados</FormTitle>
            <Input
              iconName="user"
              placeholder="Nome"
              marginBottom={8}
            />
            <Input
              iconName="mail"
              placeholder="E-mail"
              marginBottom={8}
              keyboardType="email-address"
            />
            <Input
              iconName="credit-card"
              placeholder="CNH"
              marginBottom={8}
              keyboardType="numeric"
            />
          </Form>
          <Button
            title="Próximo"
          />
        </Container>
      </TouchableWithoutFeedback>
    </ KeyboardAvoidingView>
  );
}