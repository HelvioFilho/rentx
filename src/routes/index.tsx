import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useAuth } from '../hooks/auth';
import { AppTabRoutes } from './app.tab.routes';
import { AuthRoutes } from './auth.routes';
import { LoadAnimation } from '../components/LoadAnimation';

export function Routes() {
  const { loading, user } = useAuth();
  return (
    loading ? <LoadAnimation /> :
    <GestureHandlerRootView style={{ flex: 1 }} >
      <NavigationContainer>
        {user.email ? <AppTabRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}