export const validateEmail = (email: string): boolean => {
  return email.includes('@ics.edu.sg');
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const getEmailError = (email: string): string | null => {
  if (!validateRequired(email)) {
    return 'Email is required';
  }
  if (!validateEmail(email)) {
    return 'Email must contain @ics.edu.sg';
  }
  return null;
};

export const getRequiredFieldError = (value: string, fieldName: string): string | null => {
  if (!validateRequired(value)) {
    return `${fieldName} is required`;
  }
  return null;
};