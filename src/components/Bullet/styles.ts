import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

interface BulletIndexProps {
  active: boolean;
}

export const Container = styled.View<BulletIndexProps>`
  width: ${RFValue(6)}px;
  height: ${RFValue(6)}px;

  margin-left: ${RFValue(8)}px;
  border-radius: ${RFValue(3)}px;

  background-color: ${({ theme, active }) =>
    active ? theme.colors.title : theme.colors.shape
  };
`;