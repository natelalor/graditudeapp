import type { ReactNode } from 'react';
import type { ControllerProps } from 'react-hook-form';


/**
 * Adds a default required rule based on the required boolean
 * prop that is passed to form fields.
 *
 * @param rules    - The other rules to be applied to the field
 * @param required - The required prop of the field
 * @param label    - The label of the field
 */
export default function addDefaultRequiredRule(
    rules: ControllerProps['rules'],
    required: boolean | undefined,
    label: ReactNode | undefined
) {
    const labelStr: string = label && typeof label === 'string'
        ? label
        : 'This field';

    return {
        required: {
            value: !!required,
            message: `${labelStr} is required`
        },
        ...rules
    };
}
