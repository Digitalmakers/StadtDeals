import React from 'react';
import { Alert, Text } from 'native-base';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onClose 
}) => {
  return (
    <Alert status="error" rounded="md">
      <Alert.Icon />
      <Text color="error.600" flex={1}>
        {message}
      </Text>
      {onClose && (
        <Alert.CloseButton onPress={onClose} />
      )}
    </Alert>
  );
};