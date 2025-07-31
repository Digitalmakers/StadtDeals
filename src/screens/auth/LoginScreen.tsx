import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Heading,
  FormControl,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../stores/authStore';
import { LoginFormData } from '../../types/auth';
import { Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login, isLoading, error } = useAuthStore();
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email);
      // Navigate to OTP verification screen
      navigation.navigate('OTPVerification', { 
        email: data.email,
        type: 'login'
      });
    } catch (loginError) {
      // Error is handled by the store
      console.error('Login error:', loginError);
    }
  };

  return (
    <KeyboardAvoidingView 
      flex={1} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView flex={1} bg="white">
        <Box flex={1} px={4} py={8} justifyContent="center">
          <VStack space={6}>
            <Heading size="xl" textAlign="center" color="primary.600">
              Welcome Back
            </Heading>
            
            <Text textAlign="center" color="gray.600">
              Enter your email to receive an OTP
            </Text>

            {error && (
              <Alert status="error" rounded="md">
                <Alert.Icon />
                <Text color="error.600">{error}</Text>
              </Alert>
            )}

            <VStack space={4}>
              <FormControl isInvalid={!!errors.email}>
                <FormControl.Label>Email</FormControl.Label>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Enter your email"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      variant="outline"
                      size="lg"
                    />
                  )}
                />
                <FormControl.ErrorMessage>
                  {errors.email?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            </VStack>

            <Button
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
              isLoadingText="Sending OTP..."
              size="lg"
              bg="primary.600"
              _pressed={{ bg: 'primary.700' }}
            >
              Send OTP
            </Button>

            <HStack justifyContent="center" space={2}>
              <Text color="gray.600">Don't have an account?</Text>
              <Button
                variant="link"
                onPress={() => navigation.navigate('Register')}
                _text={{ color: 'primary.600' }}
              >
                Sign Up
              </Button>
            </HStack>
          </VStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};