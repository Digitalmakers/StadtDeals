import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
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
import { OTPFormData } from '../../types/auth';
import { Platform } from 'react-native';

// Validation schema
const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

interface OTPVerificationScreenProps {
  navigation: any;
  route: {
    params: {
      email: string;
      type: 'login' | 'register';
    };
  };
}

export const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { email, type } = route.params;
  const { verifyOTP, login, isLoading, error, setError } = useAuthStore();
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const onSubmit = async (data: OTPFormData) => {
    try {
      await verifyOTP(data.otp);
      // Navigate to main app on successful verification
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (otpError) {
      // Error is handled by the store
      console.error('OTP verification error:', otpError);
    }
  };

  const handleResendOTP = async () => {
    try {
      setError(null);
      if (type === 'login') {
        await login(email);
      } else {
        // For register, we'd need to store the registration data
        // This is a simplified version
        console.log('Resending OTP for registration...');
      }
      setCountdown(60);
      setCanResend(false);
    } catch (resendError) {
      console.error('Resend OTP error:', resendError);
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
              Verify OTP
            </Heading>
            
            <Text textAlign="center" color="gray.600">
              Enter the 6-digit code sent to{'\n'}
              <Text fontWeight="medium">{email}</Text>
            </Text>

            {error && (
              <Alert status="error" rounded="md">
                <Alert.Icon />
                <Text color="error.600">{error}</Text>
              </Alert>
            )}

            <VStack space={4}>
              <FormControl isInvalid={!!errors.otp}>
                <FormControl.Label textAlign="center">
                  Verification Code
                </FormControl.Label>
                <Controller
                  control={control}
                  name="otp"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="000000"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="number-pad"
                      maxLength={6}
                      textAlign="center"
                      fontSize="xl"
                      variant="outline"
                      size="lg"
                      letterSpacing={4}
                    />
                  )}
                />
                <FormControl.ErrorMessage textAlign="center">
                  {errors.otp?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            </VStack>

            <Button
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
              isLoadingText="Verifying..."
              size="lg"
              bg="primary.600"
              _pressed={{ bg: 'primary.700' }}
            >
              Verify OTP
            </Button>

            <VStack space={2} alignItems="center">
              <Text color="gray.600">Didn't receive the code?</Text>
              
              {canResend ? (
                <Button
                  variant="link"
                  onPress={handleResendOTP}
                  _text={{ color: 'primary.600' }}
                >
                  Resend OTP
                </Button>
              ) : (
                <Text color="gray.500">
                  Resend in {countdown}s
                </Text>
              )}
            </VStack>

            <Button
              variant="ghost"
              onPress={() => navigation.goBack()}
              _text={{ color: 'gray.600' }}
            >
              Change Email
            </Button>
          </VStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};