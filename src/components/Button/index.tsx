import React from 'react';

import {
  Container,
  Title,
} from './styles';

interface ButtonProps {
  title: string;
  color?: string;
  onPress: () => void;
}

export function Button({ title, onPress, ...rest }: ButtonProps) {
  return (
    <Container onPress={onPress} {...rest} >
      <Title>{title}</Title>
    </Container>
  );
}