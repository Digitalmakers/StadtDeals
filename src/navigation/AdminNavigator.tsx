import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AdminScreen } from '../screens/admin/AdminScreen';
import { UserManagementScreen } from '../screens/admin/UserManagementScreen';

export type AdminStackParamList = {
  AdminDashboard: undefined;
  UserManagement: undefined;
};

const Stack = createStackNavigator<AdminStackParamList>();

export const AdminNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f97316', // Orange theme
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="AdminDashboard" 
        component={AdminScreen}
        options={{
          title: 'Admin Dashboard',
        }}
      />
      <Stack.Screen 
        name="UserManagement" 
        component={UserManagementScreen}
        options={{
          title: 'User Management',
          headerBackTitle: 'Dashboard',
        }}
      />
    </Stack.Navigator>
  );
};