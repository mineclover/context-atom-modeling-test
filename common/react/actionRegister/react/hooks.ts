import { useEffect, useId, useCallback } from 'react';
import { useAtom, WritableAtom } from 'jotai';
import { ActionHandler, HandlerConfig, ActionPayloadMap } from '../core';
import { useAction } from './ActionContext';

// Hook: Action Handler 등록
export const useActionHandler = <T extends ActionPayloadMap, K extends keyof T>(
  action: K,
  handler: ActionHandler<T[K]>,
  config?: HandlerConfig
) => {
  const actionRegister = useAction<T>();
  const componentId = useId();
  
  useEffect(() => {
    const unregister = actionRegister.register(
      action,
      handler,
      { ...config, id: config?.id || componentId }
    );
    
    return unregister;
  }, [action, handler, config, componentId, actionRegister]);
};

// Hook: Atom과 Action 통합
export const useAtomAction = <T,>(
  atom: WritableAtom<T, any, any>,
  actionName: string
) => {
  const [value, setValue] = useAtom(atom);
  const actionRegister = useAction();
  
  useEffect(() => {
    // Atom setter를 action register에 등록
    actionRegister.registerAtomSetter(actionName, setValue);
    
    return () => {
      // cleanup if needed
    };
  }, [actionName, setValue, actionRegister]);
  
  return value;
};

// Hook: Action Dispatcher
export const useActionDispatcher = <T extends ActionPayloadMap = ActionPayloadMap>() => {
  const actionRegister = useAction<T>();
  
  return useCallback(<K extends keyof T>(
    action: K,
    payload: T[K]
  ) => {
    return actionRegister.dispatch(action, payload);
  }, [actionRegister]);
};