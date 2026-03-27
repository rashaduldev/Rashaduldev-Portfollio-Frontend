"use client";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Typography } from "@/components/ui/Typography";

type ControlledTextareaProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  requiredMark?: string;
  control: Control<T>;
  placeholder?: string;
};

export const ControlledTextarea = <T extends FieldValues>({
  name,
  label,
  requiredMark,
  control,
  placeholder,
}: ControlledTextareaProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 mb-1">
            {label && <Label>{label}</Label>}
            {requiredMark && (
              <Typography size="sm" color="destructive">
                {requiredMark}
              </Typography>
            )}
          </div>

          <Textarea
            {...field}
            placeholder={placeholder}
            value={field.value || ""}
          />

          {fieldState.error && (
            <Typography size="xs" color="destructive">
              {fieldState.error.message}
            </Typography>
          )}
        </div>
      )}
    />
  );
};
