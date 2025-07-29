import { BaseActionPayloadMap } from '../core/types';
import { UserActionPayloadMap } from './user';
import { UIActionPayloadMap } from './ui';
import { DataActionPayloadMap } from './data';

// 모든 액션 맵을 통합
export interface AppActionPayloadMap extends 
  BaseActionPayloadMap,
  UserActionPayloadMap,
  UIActionPayloadMap,
  DataActionPayloadMap {}

// 다시 내보내기
export * from './user';
export * from './ui';
export * from './data';