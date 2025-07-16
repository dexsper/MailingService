import { Eye, EyeOff } from 'lucide-react';

import { useState } from 'react';

import { Button } from '@/components/ui/shared/button';
import { Checkbox } from '@/components/ui/shared/checkbox';
import { Input } from '@/components/ui/shared/input';
import { Label } from '@/components/ui/shared/label';

import { Textarea } from '../shared/textarea';
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

type TextareaFieldProps = BaseFieldProps & {
  type: 'textarea';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
} & Omit<
    React.InputHTMLAttributes<HTMLTextAreaElement>,
    'value' | 'onChange' | 'type'
  >;

export type FormFieldProps =
  | InputFieldProps
  | CheckboxFieldProps
  | TextareaFieldProps;

function isCheckboxField(props: FormFieldProps): props is CheckboxFieldProps {
  return props.type === 'checkbox';
}

function isTextareaField(props: FormFieldProps): props is TextareaFieldProps {
  return props.type === 'textarea';
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

  if (isTextareaField(props)) {
    const {
      id,
      label,
      value,
      onChange,
      errors,
      wrapperClassName = 'grid gap-3',
      ...rest
    } = props;

    return (
      <div className={wrapperClassName}>
        {label && <Label htmlFor={id}>{label}</Label>}
        <Textarea id={id} value={value} onChange={onChange} {...rest} />
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
