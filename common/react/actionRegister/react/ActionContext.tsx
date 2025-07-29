import React, { createContext, useContext, useRef } from 'react';
import { ActionRegister, ActionPayloadMap } from '../core';

// Context 생성
const ActionContext = createContext<ActionRegister | null>(null);

// Provider 컴포넌트
export const ActionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const actionRegisterRef = useRef<ActionRegister>();
  
  if (!actionRegisterRef.current) {
    actionRegisterRef.current = new ActionRegister();
  }
  
  return (
    <ActionContext.Provider value={actionRegisterRef.current}>
      {children}
    </ActionContext.Provider>
  );
};

// Hook: Action 사용
export const useAction = <T extends ActionPayloadMap = ActionPayloadMap>() => {
  const actionRegister = useContext(ActionContext);
  if (!actionRegister) {
    throw new Error('useAction must be used within ActionProvider');
  }
  return actionRegister as ActionRegister<T>;
};