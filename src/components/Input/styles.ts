import styled, { css } from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

interface LineProps {
  isFocused: boolean;
}

interface InputProps {
  marginBottom?: number;
}

export const Container = styled.View<InputProps>`
  flex-direction: row;
  margin-bottom: ${({ marginBottom }) => marginBottom ? marginBottom : 0}px;
`;

export const IconContainer = styled.View<LineProps>`
  height: 56px;
  width: 55px;
  justify-content: center;
  align-items: center;
  
  margin-right: 2px;

  background-color: ${({ theme }) => theme.colors.background_secondary};

  ${({ isFocused, theme }) => isFocused && css`
    border-bottom-width: 2px;
    border-bottom-color: ${theme.colors.main};
  `};
`;

export const InputText = styled.TextInput<LineProps>`
  flex: 1;

  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background_secondary};

  font-size: ${RFValue(15)}px;
  font-family: ${({ theme }) => theme.fonts.primary_400};
  
  padding: 0% 23px;

  ${({ isFocused, theme }) => isFocused && css`
    border-bottom-width: 2px;
    border-bottom-color: ${theme.colors.main};
  `};
`;