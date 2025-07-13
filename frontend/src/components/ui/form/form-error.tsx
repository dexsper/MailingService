import { Alert, AlertDescription } from '@/components/ui/shared/alert';

interface ErrorsProps {
  id: string;
  errors?: string[];
}

export default function FormErrors({ id, errors }: ErrorsProps) {
  if (!errors || errors.length === 0) return null;

  return (
    <Alert variant="destructive">
      <AlertDescription>
        <ul className="list-inside list-disc text-sm">
          {errors.map((error, idx) => (
            <li key={`${id}_error_${idx}`}>{error}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
