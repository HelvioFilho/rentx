import React, { useState } from 'react';
import { ScrollView, TextInputProps } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';

import { Feather } from '@expo/vector-icons';
import { useTheme } from 'styled-components';
import {
  Container,
  IconContainer,
  InputText,
} from './styles';

interface InputProps extends TextInputProps {
  iconName: React.ComponentProps<typeof Feather>['name'];
  value?: string;
}

export function PasswordInput({ iconName, value, ...rest }: InputProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const theme = useTheme();

  return (

    <Container>
      <IconContainer
        isFocused={isFocused}
      >
        <Feather
          name={iconName}
          size={24}
          color={(isFocused || isFilled) ? theme.colors.main : theme.colors.text_detail}
        />
      </IconContainer>
      <InputText
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false)
          setIsFilled(!!value)
        }}
        secureTextEntry={isVisible}
        isFocused={isFocused}
        {...rest}
      />
      <IconContainer
        isFocused={isFocused}
        password
      >
        <BorderlessButton onPress={() => setIsVisible(old => !old)}>
          <Feather
            name={isVisible ? "eye" : "eye-off"}
            size={24}
            color={theme.colors.text_detail}
          />
        </BorderlessButton>
      </IconContainer>
    </Container>

  );
}