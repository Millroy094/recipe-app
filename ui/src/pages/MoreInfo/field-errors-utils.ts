import { isEmpty, startCase } from 'lodash';

export const isFieldValid = (fieldName: string, errors: string[]) => {
  const fieldError = getFieldError(fieldName, errors);
  return isEmpty(fieldError);
};

export const getFieldError = (
  fieldName: string,
  errors: string[],
  fieldNameLabel?: string,
) => {
  let fieldError = errors.find((error) => error.startsWith(`${fieldName} `));

  if (fieldNameLabel) {
    fieldError = fieldError
      ?.replace(fieldName, startCase(fieldNameLabel))
      ?.trim();
  }

  return fieldError ?? '';
};
