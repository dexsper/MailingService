import FormField, { FormFieldProps } from './form-field';

type AutoFormFieldProps = Omit<FormFieldProps, 'id' | 'value' | 'onChange'> & {
  group?: string;
  order?: number;
  required?: boolean;
};

type AutoFormProps<T extends Record<string, any>> = {
  formData: T;
  fieldProps?: Partial<Record<keyof T, Partial<AutoFormFieldProps>>>;
  fieldErrors?: Partial<Record<keyof T, string[]>>;
  groupClassName?: string;
  defaultGroupClassName?: string;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
} & Omit<AutoFormFieldProps, 'type' | 'errors'>;

function parseValue(value: string | boolean, type: string) {
  if (type === 'number') return Number(value);
  if (type === 'checkbox') return Boolean(value);

  return value;
}

const DEFAULT_GROUP_NAME = '__default__';

export default function AutoForm<T extends Record<string, any>>({
  formData,
  fieldProps = {},
  fieldErrors = {},
  groupClassName = 'flex justify-between gap-4',
  defaultGroupClassName = 'grid gap-4',
  setFormData,
  ...commonProps
}: AutoFormProps<T>) {
  const groupedFields: Record<string, [keyof T, any][]> = {};

  for (const [key, value] of Object.entries(formData)) {
    const typedKey = key as keyof T;
    const group = fieldProps[typedKey]?.group || DEFAULT_GROUP_NAME;
    const order = fieldProps[typedKey]?.order ?? 0;

    if (!groupedFields[group]) groupedFields[group] = [];

    const insertIndex = groupedFields[group].findIndex(([existingKey]) => {
      const existingOrder = fieldProps[existingKey]?.order ?? 0;
      return order < existingOrder;
    });

    if (insertIndex === -1) {
      groupedFields[group].push([typedKey, value]);
    } else {
      groupedFields[group].splice(insertIndex, 0, [typedKey, value]);
    }
  }

  const handleChange = (key: keyof T, type: string) => {
    return (e: React.ChangeEvent<HTMLInputElement> | boolean) => {
      const raw = typeof e === 'boolean' ? e : e.target.value;
      const parsed = parseValue(raw, type);
      setFormData((prev) => ({ ...prev, [key]: parsed }));
    };
  };

  return (
    <>
      {Object.entries(groupedFields).map(([groupName, fields]) => (
        <div
          key={groupName}
          className={
            groupName === DEFAULT_GROUP_NAME
              ? defaultGroupClassName
              : groupClassName
          }
        >
          {fields.map(([key, value]) => {
            const { type, ...extraProps } = fieldProps?.[key] || {};

            if (typeof value === 'boolean') {
              return (
                <FormField
                  key={String(key)}
                  id={String(key)}
                  type="checkbox"
                  value={value}
                  onChange={handleChange(key, 'checkbox')}
                  errors={fieldErrors?.[key]}
                  {...commonProps}
                  {...extraProps}
                />
              );
            }

            const defaultType = typeof value === 'number' ? 'number' : 'text';
            const inputType = type ?? defaultType;

            return (
              <FormField
                key={String(key)}
                id={String(key)}
                type={inputType}
                value={value}
                onChange={handleChange(key, inputType)}
                errors={fieldErrors?.[key]}
                {...commonProps}
                {...extraProps}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}
