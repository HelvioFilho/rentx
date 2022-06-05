import React from 'react';

import {
  Container,
  ContainerModal,
  Close,
  IconX,
  Message,
  Footer,
  Button,
  Title,
} from './styles';

interface WarningModalProps {
  message: string;
  button: {
    title: string;
    color: string;
    textColor?: string;
    close: boolean;
  }[];
  closeModal: () => void;
  primaryFunction?: () => void;
}

export function WarningModal({ message, button, closeModal, primaryFunction }: WarningModalProps) {
  return (
    <Container>
      <ContainerModal>
        <Close
          onPress={closeModal}
        >
          <IconX
            name="md-close-circle-outline"
            size={30}
            color="white"
          />
        </Close>
        <Message>
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