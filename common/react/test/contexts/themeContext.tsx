import { createAtomContext } from '../core/createAtomContext'

// 테마 타입
type Theme = 'light' | 'dark' | 'blue' | 'green'

// 테마 컨텍스트 생성
export const {
  Provider: ThemeProvider,
  useAtomState: useTheme,
  useAtomReadOnly: useThemeValue,
  useAtomSetter: useThemeSetter,
} = createAtomContext<Theme>('light')