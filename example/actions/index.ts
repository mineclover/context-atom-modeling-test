import { BaseActionPayloadMap } from '@context-action/core';
import { DataActionPayloadMap } from './data';
import { UIActionPayloadMap } from './ui';
import { UserActionPayloadMap } from './user';

// 모든 액션 맵을 통합
export interface AppActionPayloadMap extends 
  BaseActionPayloadMap,
  UserActionPayloadMap,
  UIActionPayloadMap,
  DataActionPayloadMap {}

// 다시 내보내기
export * from './data';
export * from './ui';
export * from './user';
export * from './extended';
