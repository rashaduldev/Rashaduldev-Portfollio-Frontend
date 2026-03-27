"use client";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Typography } from "@/components/ui/Typography";

type ControlledInputProps<T extends FieldValues> = {
  name: Path<T>;
  requiredMark?: string;
  label?: string;
  control: Control<T>;
  type?: string;
  placeholder?: string;
  className?: string;
};

export const ControlledInput = <T extends FieldValues>({
  name,
  label,
  control,
  requiredMark,
  type = "text",
  placeholder,
  className,
}: ControlledInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-1 relative w-full">
          <div className="flex items-center gap-1 mb-1">
            {label && <Label>{label}</Label>}
            {requiredMark && (
              <Typography size="sm" color="destructive">
                {requiredMark}
              </Typography>
            )}
          </div>

          <Input
            {...field}
            type={type}
            placeholder={placeholder}
            value={field.value || ""}
            className={className}
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
