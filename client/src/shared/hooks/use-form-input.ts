import React, { useState } from 'react';

interface InputProps<T> {
  value: T;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: (value: T) => void;
}
export function useFormInput<T>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value as T);
  }

  const inputProps: InputProps<T> = {
    value,
    onChange: handleChange,
    setValue,
  };

  return inputProps;
}
