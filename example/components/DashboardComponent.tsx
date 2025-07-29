import React from 'react';
import { ActionDashboard } from './pure/ActionDashboard';
import { useViewActions, ActionLog } from '../contexts/ViewActionContext';

// 대시보드 컴포넌트 - 순수 뷰와 액션 연결
interface DashboardComponentProps {
  logs: ActionLog[];
}

export const DashboardComponent: React.FC<DashboardComponentProps> = ({ logs }) => {
  const viewActions = useViewActions();

  const handleClearLogs = () => {
    viewActions.clearLogs();
  };

  return <ActionDashboard logs={logs} onClearLogs={handleClearLogs} />;
};