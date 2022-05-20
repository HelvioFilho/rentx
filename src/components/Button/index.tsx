import React from 'react';

import {
  Container,
  Title,
} from './styles';

interface ButtonProps {
  title: string;
  color?: string;
  onPress: () => void;
  enabled?: boolean;
}

export function Button({ title, onPress, enabled = true, ...rest }: ButtonProps) {
  return (
    <Container
      onPress={onPress}
      enabled={enabled}
      {...rest}
      style={{ opacity: enabled ? 1 : .5 }}
    >
      <Title>{title}</Title>
    </Container>
  );
}