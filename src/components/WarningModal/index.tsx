import React from 'react';
import { useTheme } from 'styled-components';

import {
  Container,
  ContainerModal,
  Close,
  IconX,
  Message,
  Footer,
  Button,
  Title,
  TitleAlert,
} from './styles';

interface WarningModalProps {
  title?: string;
  message: string;
  height?: number;
  align?: boolean;
  button: {
    title: string;
    color: string;
    textColor?: string;
    close: boolean;
  }[];
  closeModal: () => void;
  primaryFunction?: () => void;
}

export function WarningModal(
  {
    title,
    message,
    height = 200,
    align = false,
    button,
    closeModal,
    primaryFunction
  }: WarningModalProps) {
  const theme = useTheme();
  return (
    <Container>
      <ContainerModal height={height}>
        <Close
          onPress={closeModal}
        >
          <IconX
            name="md-close-circle-outline"
            size={30}
            color={theme.colors.line}
          />
        </Close>
        {
          title &&
          <TitleAlert>
            {title}
          </TitleAlert>
        }
        <Message align={align}>
          {message}
        </Message>
        <Footer itens={button.length}>
          {
            button.map((item) => (
              <Button
                key={item.title}
                color={item.color}
                onPress={item.close ? closeModal : primaryFunction}
              >
                <Title
                  textColor={item.textColor ? item.textColor : 'white'}
                >
                  {item.title}
                </Title>
              </Button>
            )
            )
          }
        </Footer>
      </ContainerModal>
    </Container>
  );
}