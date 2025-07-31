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
import { RegisterFormData } from '../../types/auth';
import { Platform } from 'react-native';

// Validation schema
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
});

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { register, isLoading, error } = useAuthStore();
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data);
      // Navigate to OTP verification screen
      navigation.navigate('OTPVerification', { 
        email: data.email,
        type: 'register'
      });
    } catch (registrationError) {
      // Error is handled by the store
      console.error('Registration error:', registrationError);
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
              Create Account
            </Heading>
            
            <Text textAlign="center" color="gray.600">
              Enter your details to get started
            </Text>

            {error && (
              <Alert status="error" rounded="md">
                <Alert.Icon />
                <Text color="error.600">{error}</Text>
              </Alert>
            )}

            <VStack space={4}>
              <FormControl isInvalid={!!errors.firstName}>
                <FormControl.Label>First Name</FormControl.Label>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Enter your first name"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      variant="outline"
                    />
                  )}
                />
                <FormControl.ErrorMessage>
                  {errors.firstName?.message}
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.lastName}>
                <FormControl.Label>Last Name</FormControl.Label>
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Enter your last name"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      variant="outline"
                    />
                  )}
                />
                <FormControl.ErrorMessage>
                  {errors.lastName?.message}
                </FormControl.ErrorMessage>
              </FormControl>

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
                    />
                  )}
                />
                <FormControl.ErrorMessage>
                  {errors.email?.message}
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.phone}>
                <FormControl.Label>Phone (Optional)</FormControl.Label>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Enter your phone number"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="phone-pad"
                      variant="outline"
                    />
                  )}
                />
                <FormControl.ErrorMessage>
                  {errors.phone?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            </VStack>

            <Button
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
              isLoadingText="Creating Account..."
              size="lg"
              bg="primary.600"
              _pressed={{ bg: 'primary.700' }}
            >
              Create Account
            </Button>

            <HStack justifyContent="center" space={2}>
              <Text color="gray.600">Already have an account?</Text>
              <Button
                variant="link"
                onPress={() => navigation.navigate('Login')}
                _text={{ color: 'primary.600' }}
              >
                Sign In
              </Button>
            </HStack>
          </VStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};