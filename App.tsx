import React from 'react';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { AppNavigator } from './src/navigation/AppNavigator';

// Custom theme configuration
const theme = extendTheme({
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
  },
  config: {
    initialColorMode: 'light',
  },
});

function App(): React.JSX.Element {
  return (
    <NativeBaseProvider theme={theme}>
      <AppNavigator />
    </NativeBaseProvider>
  );
}

export default App;
