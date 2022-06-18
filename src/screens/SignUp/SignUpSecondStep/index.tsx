import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Modal } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useTheme } from 'styled-components';
import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { Button } from '../../../components/Button';
import { PasswordInput } from '../../../components/PasswordInput';
import { WarningModal } from '../../../components/WarningModal';
import { api } from '../../../services/api';

import {
  Container,
  Header,
  Steps,
  Title,
  Subtitle,
  Form,
  FormTitle,
} from './styles';

interface Params {
  user: {
    name: string;
    email: string;
    driverLicense: string;
  }
}

export function SignUpSecondStep() {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [height, setHeight] = useState(0);

  const { goBack, navigate } = useNavigation();
  const theme = useTheme();
  const { params } = useRoute();
  const { user } = params as Params;

  async function handleRegister() {
    if (!password) {
      setErrorMessage("A senha não pode ser vazia!");
      setHeight(170);
      setVisible(true);
      return;
    }
    if (!passwordConfirm) {
      setErrorMessage("A confirmação de senha não pode ser vazia!");
      setHeight(200);
      setVisible(true);
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMessage("A senhas não são iguais!");
      setHeight(170);
      setVisible(true);
      return;
    }

    await api.post('/user', {
      name: user.name.trim(),
      email: user.email.trim(),
      driver_license: user.driverLicense.trim(),
      password
    })
      .then((response) => {
        if (!response.data.error) {
          navigate('Confirmation', {
            title: 'Conta Criada!',
            message: `Agora é só fazer login\ne aproveitar.`,
            nextScreenRoute: 'SignIn'
          });
        } else {
          setErrorMessage(`Não foi possível cadastrar!\nUsuário já existe!`);
          setHeight(200);
          setVisible(true);
        }
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("Não foi possível cadastrar!");
        setHeight(170);
        setVisible(true);
      });
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
          <Header>
            <BackButton onPress={goBack} />
            <Steps>
              <Bullet />
              <Bullet active />
            </Steps>
          </Header>
          <Title>
            Crie sua{`\n`}conta
          </Title>
          <Subtitle>
            Faça seu cadastro de{'\n'}forma rápida e fácil.
          </Subtitle>
          <Form>
            <FormTitle>2. Senha</FormTitle>
            <PasswordInput
              iconName="lock"
              placeholder="Senha"
              onChangeText={setPassword}
              value={password}
            />
            <PasswordInput
              iconName="lock"
              placeholder="Repetir senha"
              onChangeText={setPasswordConfirm}
              value={passwordConfirm}
            />
          </Form>
          <Button
            title="Cadastrar"
            color={theme.colors.success}
            onPress={handleRegister}
          />
          <Modal
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={() => setVisible(false)}
          >
            <WarningModal
              title="Aviso"
              height={height}
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
    </ KeyboardAvoidingView>
  );
}