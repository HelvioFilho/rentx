import styled, { css } from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

interface buttonProps {
  color: string;
}

interface FooterProps {
  itens: number;
}

interface TitleProps {
  textColor: string;
}

interface ContainerProps {
  height: number;
}

interface MessageProps {
  align: boolean;
}

export const Container = styled.View`
  flex: 1;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: rgba(0,0,0,0.8);
`;

export const IconX = styled(Ionicons)``;

export const ContainerModal = styled.View<ContainerProps>`
  width: 90%;
  height: ${({ height }) => height}px;
  justify-content: center;
  align-items: center;
  
  background-color: ${({ theme }) => theme.colors.header};
  
  border-radius: 20px;
  padding: 15px;
`;

export const Close = styled.TouchableOpacity`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 8px;
`;

export const Message = styled.Text<MessageProps>`
  width: 80%;
  font-size: ${RFValue(14)}px;
  ${({ align }) => align && css`
    text-align: center;
  `};

  color: ${({ theme }) => theme.colors.line};
  
  padding-top: 10px;
`;

export const Footer = styled.View<FooterProps>`
  width: 90%;
  height: 50px;
  padding: 20px 30px 0;
  
  flex-direction: row;
  justify-content: ${({ itens }) => itens === 1 ? "center" : "space-between"} ;
`;

export const Button = styled.TouchableOpacity<buttonProps>`
  width: 90px;
  height: 40px;
  justify-content: center;
  align-items: center;
  
  background-color: ${({ color }) => color};
  
  border-radius: 10px;
`;

export const Title = styled.Text<TitleProps>`
  font-size: ${RFValue(13)}px;

  color: ${({ textColor }) => textColor};
`;

export const TitleAlert = styled.Text`
  font-size: ${RFValue(20)}px;
  font-weight: bold;

  color: ${({ theme }) => theme.colors.line};
`;