import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { BackButton } from '../../components/BackButton';
import * as ImagePicker from 'expo-image-picker';
import * as Yup from 'yup';

import {
  Container,
  Header,
  HeaderTop,
  HeaderTitle,
  LogoutButton,
  PhotoContainer,
  Photo,
  PhotoButton,
  Content,
  Options,
  Option,
  OptionTitle,
  Section,
} from './styles';
import { Input } from '../../components/Input';
import { Keyboard, KeyboardAvoidingView, Modal } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { PasswordInput } from '../../components/PasswordInput';
import { useAuth } from '../../hooks/auth';
import { Button } from '../../components/Button';
import { WarningModal } from '../../components/WarningModal';

interface ButtonProps {
  title: string;
  color: string;
  close: boolean;
}

interface AlertProps {
  title: string;
  message: string;
  height: number;
}

export function Profile() {
  const { user, signOut, updatedUser } = useAuth();

  const [option, setOption] = useState<'dataEdit' | 'passwordEdit'>('dataEdit');
  const [avatar, setAvatar] = useState(user.photo ? user.photo : `https://ui-avatars.com/api/?bold=true&font-size=0.60&background=1B1B1F&color=fff&name=${user.name}&length=1`);
  const [name, setName] = useState(user.name);
  const [driverLicense, setDriverLicense] = useState(user.driver_license);
  const [alert, setAlert] = useState({} as AlertProps);
  const [button, setButton] = useState({} as ButtonProps[]);
  const [visible, setVisible] = useState(false);
  
  const theme = useTheme();
  const { goBack } = useNavigation();
  
  async function handleAvatarSelect() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1
    });

    if (result.cancelled) {
      return;
    }
    if (result.uri) {
      setAvatar(result.uri)
    }
  }

  async function handleProfileUpdate() {
    try {
      const schema = Yup.object().shape({
        driverLicense: Yup.string()
          .required('CNH não pode ser vazio'),
        name: Yup.string()
          .required('Nome não pode ser vazio')
      });

      const data = { name, driverLicense};
      await schema.validate(data);

      await updatedUser({
        id: user.id,
        email: user.email,
        name,
        driver_license: driverLicense,
        photo: avatar,
        token: user.token
      });
      setAlert({ title: "Aviso", message: "Perfil atualizado!", height: 170 });
      setButton([{
        title: "Fechar",
        color: theme.colors.main,
        close: true,
      }]);
      setVisible(true);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setAlert({ title: "Aviso", message: error.message, height: 170 });
        setButton([{
          title: "Fechar",
          color: theme.colors.main,
          close: true,
        }]);
        setVisible(true);
        if (!name) setName(user.name);
        if (!driverLicense) setDriverLicense(user.driver_license);

      } else {
        console.log("não foi possível salvar as informações");
      }
    }
  }

  async function handleSignOut() {
    setAlert({
      title: "Aviso",
      message: "Se você sair, irá precisar de internet para conectar-se novamente.",
      height: 200,
    });
    setButton([
      {
        title: "Cancelar",
        color: theme.colors.main,
        close: true,
      },
      {
        title: "Sair",
        color: theme.colors.success,
        close: false
      },
    ]);
    setVisible(true);
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
            <HeaderTop>
              <BackButton color={theme.colors.shape} onPress={goBack} />
              <HeaderTitle>Editar Perfil</HeaderTitle>
              <LogoutButton onPress={handleSignOut}>
                <Feather name="power" size={24} color={theme.colors.shape} />
              </LogoutButton>
            </HeaderTop>
            <PhotoContainer>
              <Photo source={{ uri: avatar }} />
              <PhotoButton onPress={handleAvatarSelect}>
                <Feather name="camera" size={24} color={theme.colors.shape} />
              </PhotoButton>
            </PhotoContainer>
          </Header>
          <Content>
            <Options>
              <Option
                onPress={() => setOption('dataEdit')}
                active={option === 'dataEdit'}
                activeOpacity={.9}
              >
                <OptionTitle active={option === 'dataEdit'}>Dados</OptionTitle>
              </Option>
              <Option
                onPress={() => setOption('passwordEdit')}
                active={option === 'passwordEdit'}
                activeOpacity={.9}
              >
                <OptionTitle active={option === 'passwordEdit'}>Trocar senha</OptionTitle>
              </Option>
            </Options>
            {
              option === 'dataEdit' ?
                <Section>
                  <Input
                    iconName="user"
                    placeholder="Nome"
                    autoCorrect={false}
                    marginBottom={8}
                    defaultValue={name}
                    onChangeText={setName}
                  />
                  <Input
                    iconName="mail"
                    editable={false}
                    marginBottom={8}
                    defaultValue={user.email}
                  />
                  <Input
                    iconName="credit-card"
                    placeholder="CNH"
                    keyboardType="numeric"
                    marginBottom={8}
                    defaultValue={driverLicense}
                    onChangeText={setDriverLicense}
                  />
                </Section>
                :
                <Section>
                  <PasswordInput
                    iconName="lock"
                    placeholder="Senha atual"
                  />
                  <PasswordInput
                    iconName="lock"
                    placeholder="Nova senha"
                  />
                  <PasswordInput
                    iconName="lock"
                    placeholder="Repetir nova senha"
                  />
                </Section>
            }
            <Button
              title="Salvar alterações"
              onPress={handleProfileUpdate}
            />
          </Content>
          <Modal
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={() => setVisible(false)}
          >
            <WarningModal
              title={alert.title}
              height={alert.height}
              align
              message={alert.message}
              button={button}
              closeModal={() => setVisible(false)}
              primaryFunction={signOut}
            />
          </Modal>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView >
  );
}