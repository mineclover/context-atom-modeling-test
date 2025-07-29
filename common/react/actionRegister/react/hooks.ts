import { useEffect } from 'react';
import { useAtom, WritableAtom } from 'jotai';

// 이 파일의 훅들은 createActionContext로 생성된 useAction과 함께 사용해야 합니다.
// 사용 시 createActionContext로 생성된 useAction을 전달받아 사용하세요.

// Hook: Atom과 Action 통합
export const createUseAtomAction = (useAction: () => any) => <T,>(
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