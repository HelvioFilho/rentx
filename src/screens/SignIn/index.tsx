import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  StatusBar,
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import * as Yup from 'yup';

import { useTheme } from 'styled-components';

import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { PasswordInput } from '../../components/PasswordInput';

import {
  Container,
  Header,
  Subtitle,
  Title,
  Form,
  Footer,
} from './styles';
import { WarningModal } from '../../components/WarningModal';
import { useNavigation } from '@react-navigation/native';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { navigate } = useNavigation();

  const theme = useTheme();

  function handleNewAccount() {
    navigate('SignUpFirstStep');
  }

  async function handleSignIn() {
    try {
      const schema = Yup.object().shape({
        password: Yup.string()
          .required('A senha é obrigatória'),
        email: Yup.string()
          .required('E-mail obrigatório')
          .email('Digite um e-mail válido'),
      });

      await schema.validate({ email, password });
      console.log('Tudo certo');
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setErrorMessage(error.message);
        setVisible(true);
      } else {
        setErrorMessage('Error na autenticação, verifique as credenciais');
        setVisible(true);
      }
    }
  }

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
          <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent
          />
          <Header>
            <Title>
              Estamos{'\n'}quase lá.
            </Title>
            <Subtitle>
              faça seu login para começar{'\n'}
              uma experiência incrível.
            </Subtitle>
          </Header>
          <Form>
            <Input
              iconName="mail"
              placeholder="E-mail"
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={setEmail}
              value={email}
            />
            <PasswordInput
              iconName="lock"
              placeholder="Senha"
              onChangeText={setPassword}
              value={password}
            />
          </Form>
          <Footer>
            <Button
              title='Login'
              onPress={handleSignIn}
              enabled={true}
              loading={false}
            />
            <Button
              title='Criar conta gratuita'
              color={theme.colors.background_secondary}
              onPress={handleNewAccount}
              enabled={true}
              light={true}
            />
          </Footer>
          <Modal
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={() => setVisible(false)}
          >
            <WarningModal
              title="Aviso"
              height={170}
              align
              message={errorMessage}
              button={[
                {
                  title: "Fechar",
                  color: theme.colors.main,
                  close: true,
                },
              ]}
              closeModal={() => setVisible(false)}
            />
          </Modal>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}