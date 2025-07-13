import { useState } from 'react';

import { Eye, EyeOff } from 'lucide-react';

import { Label } from '@/components/ui/shared/label';
import { Input } from '@/components/ui/shared/input';
import { Button } from '@/components/ui/shared/button';
import { Checkbox } from '@/components/ui/shared/checkbox';

import FormErrors from './form-error';

type BaseFieldProps = {
  id: string;
  label?: string;
  errors?: string[];
  wrapperClassName?: string;
  placeholder?: string;
};

type InputFieldProps = BaseFieldProps & {
  type?: Exclude<React.HTMLInputTypeAttribute, 'checkbox'>;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange' | 'type'
  >;

type CheckboxFieldProps = BaseFieldProps & {
  type: 'checkbox';
  value: boolean;
  onChange: (value: boolean) => void;
};

export type FormFieldProps = InputFieldProps | CheckboxFieldProps;

function isCheckboxField(props: FormFieldProps): props is CheckboxFieldProps {
  return props.type === 'checkbox';
}

export default function FormField(props: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  if (isCheckboxField(props)) {
    const {
      id,
      label,
      type, // eslint-disable-line @typescript-eslint/no-unused-vars
      value,
      onChange,
      errors,
      wrapperClassName = 'grid gap-3',
      ...rest
    } = props;

    return (
      <div className={wrapperClassName}>
        <div className="flex items-center gap-3">
          <Checkbox
            id={id}
            checked={value}
            onCheckedChange={(checked) =>
              onChange(checked === true || checked === 'indeterminate')
            }
            {...rest}
          />
          {label && <Label htmlFor={id}>{label}</Label>}
        </div>

        <FormErrors id={id} errors={errors} />
      </div>
    );
  }

  const {
    id,
    label,
    type = 'text',
    value,
    onChange,
    errors,
    placeholder,
    wrapperClassName = 'grid gap-3',
    ...rest
  } = props;

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={wrapperClassName}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <Input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...rest}
          className={isPassword ? 'pr-10' : ''}
        />
        {isPassword && (
          <Button
            onClick={() => setShowPassword(!showPassword)}
            variant="ghost"
            size="icon"
            type="button"
            className="size-8 absolute right-2 top-1/2 -translate-y-1/2"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </Button>
        )}
      </div>

      <FormErrors id={id} errors={errors} />
    </div>
  );
}
