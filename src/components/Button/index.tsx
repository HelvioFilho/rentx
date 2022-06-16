import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components';
import { RectButtonProps } from 'react-native-gesture-handler';

import {
  Container,
  Title,
} from './styles';

interface ButtonProps extends RectButtonProps {
  title: string;
  color?: string;
  loading?: boolean;
  light?: boolean;
}

export function Button({
  title,
  onPress,
  enabled = true,
  loading = false,
  light = false,
  ...rest
}: ButtonProps) {
  const theme = useTheme();

  return (
    <Container
      onPress={onPress}
      enabled={enabled}
      {...rest}
      style={{ opacity: (enabled === false || loading === true) ? .5 : 1 }}
    >
      {loading
        ?
        <ActivityIndicator color={theme.colors.shape} />
        :
        <Title light={light}>{title}</Title>
      }
    </Container>
  );
}