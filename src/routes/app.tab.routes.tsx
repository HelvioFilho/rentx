import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MyCars } from '../screens/MyCars';
import { Home } from '../screens/Home';
import { AppStackRoutes } from './app.stack.routes';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppTabRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Screen
        name="HomeBase"
        component={AppStackRoutes}
      />
      <Screen
        name="Profile"
        component={Home}
      />
      <Screen
        name="MyCars"
        component={MyCars}
      />
    </Navigator>
  )
}