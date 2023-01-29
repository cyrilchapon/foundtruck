import { throttle, ThrottleSettings } from 'lodash'
import {
  DependencyList,
  EffectCallback,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

type AnyFunc = (...args: unknown[]) => unknown

export const useThrottleCallback = <T extends AnyFunc>(
  callback: T,
  deps: DependencyList,
  wait?: number,
  options?: ThrottleSettings,
) => {
  const throttled = useMemo(() => throttle(callback, wait, options), [])

  return useCallback((...args: Parameters<T>) => throttled(...args), [deps])
}

export const makeUseThrottleEffect =
  (wait?: number, options?: ThrottleSettings) =>
  (callback: EffectCallback, deps: DependencyList) => {
    return useEffect(throttle(callback, wait, options), [throttle, ...deps])
  }
