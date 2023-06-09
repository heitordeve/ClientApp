import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string;
}

export default function getValidationErrors(err: ValidationError): Errors {
  const validationErrors: Errors = {};

  err.inner.forEach(error => {
    validationErrors[error.path] = error.message;
  });
  if (err.inner.length === 0) {
    validationErrors[err.path] = err.message;
  }
  return validationErrors;
}
