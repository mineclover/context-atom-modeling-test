import { AppActionPayloadMap } from './index';
import { AnimationActionPayloadMap } from '../contexts/AnimationContext';
import { ViewActionPayloadMap } from '../contexts/ViewActionContext';

// 확장된 액션 타입 맵 - 모든 모듈의 액션을 통합
export interface ExtendedActionPayloadMap extends 
  AppActionPayloadMap,
  AnimationActionPayloadMap,
  ViewActionPayloadMap {}

// 타입 안전성을 위한 액션 키 유니온 타입
export type ExtendedActionType = keyof ExtendedActionPayloadMap;