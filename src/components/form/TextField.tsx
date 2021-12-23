import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@material-ui/core';
import React from 'react';
import { Controller, PathValue, UnpackNestedValue } from 'react-hook-form';
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';

import addDefaultRequiredRule from './addDefaultRequiredRule';


export type TextFieldProps<
    TFieldValues extends FieldValues,
    TName extends FieldPath<TFieldValues>
> = {
    hideRequiredIndicator?: boolean;
    maxLength?: number;
} & Omit<ControllerProps<TFieldValues, TName>, 'render'> & MuiTextFieldProps;

/**
 * Renders a mui TextField component wrapped in a react-hook-form Controller.
 *
 * @example
 * ```ts
 * import { FormProvider, useForm } from 'react-hook-form';
 *
 * const formMethods = useForm();
 *
 * <FormProvider {...formMethods}>
 *     <TextField name="name" />
 * </FormProvider>
 * ```
 *
 * @param props - The props for the Controller and the underlying TextField
 * @constructor
 */
export function TextField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
    >(props: TextFieldProps<TFieldValues, TName>) {
    const {
        rules: rulesProp, name, hideRequiredIndicator, maxLength, ...otherProps
    } = props;

    const defaultValue = otherProps.SelectProps?.multiple
        ? [] as UnpackNestedValue<PathValue<TFieldValues, TName>>
        : otherProps.defaultValue || '' as UnpackNestedValue<PathValue<TFieldValues, TName>>;

    const rules = addDefaultRequiredRule(rulesProp, otherProps.required, otherProps.label);

    if (otherProps.required && hideRequiredIndicator) {
        otherProps.required = false;
    }

    return (
        <Controller<TFieldValues, TName>
            name={name}
            rules={rules}
            defaultValue={defaultValue}
            render={
                ({
                    field: { ref, ...otherFieldProps },
                    fieldState: { error }
                }) => (
                    <MuiTextField
                        {...otherProps}
                        {...otherFieldProps}
                        inputProps={{
                            maxLength,
                            ...otherProps.inputProps
                        }}
                        inputRef={ref}
                        error={!!error?.message}
                        helperText={error ? error.message : otherProps.helperText}
                    />
                )
            }
        />
    );
}
