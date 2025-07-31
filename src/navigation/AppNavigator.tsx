import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Box, Center, Spinner } from 'native-base';
import { useAuthStore } from '../stores/authStore';
import { AuthNavigator } from './AuthNavigator';
import { AdminNavigator } from './AdminNavigator';

// Placeholder for main app screens
const MainScreen: React.FC = () => (
  <Center flex={1} bg="white">
    <Box>Main App - User Authenticated!</Box>
  </Center>
);

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Admin: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, user, checkAuthState } = useAuthStore();

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  if (isLoading) {
    return (
      <Center flex={1} bg="white">
        <Spinner size="lg" color="primary.600" />
      </Center>
    );
  }

  const getMainComponent = () => {
    if (user?.role === 'admin') {
      return AdminNavigator;
    }
    // TODO: Add vendor and customer navigators
    return MainScreen;
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={getMainComponent()} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};