import { useEffect } from 'react';


/**
 * Syntactic sugar for using an async function within an effect.
 *
 * *** Must be used in combination with useCallback ***
 *
 * Async functions can't be used by default with useEffect because they return
 * a generator and useEffect requires the return value of an effect to be a
 * cleanup function for the effect. So in order to use async/await syntax
 * within an effect, you need to declare an async function using syntax similar
 * to this component's implementation.
 *
 * @param effect - The async effect to use
 *
 * @example
 * ```ts
 * import { useCallback } from 'react';
 *
 * useAsyncEffect(useCallback(async() => {
 *     // async effect code goes here
 * }, [deps])); // deps here refers to dependencies, if any
 * ```
 */
export default function useAsyncEffect(effect: () => Promise<any>) {
    useEffect(() => {
        (async () => {
            await effect();
        })();
    }, [ effect ]);
}
