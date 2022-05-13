import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StackRoutes } from './stack.routes';

export function Routes() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }} >
      <NavigationContainer>
        <StackRoutes />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}