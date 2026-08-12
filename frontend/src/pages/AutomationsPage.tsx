import React from 'react';
import { useAppContext } from '../context/AppContext';
import VisualWorkflowBuilder from '../components/systems/Automations/VisualWorkflowBuilder';

export default function AutomationsPage() {
  const { activeTab } = useAppContext();

  return (
    <>
      {activeTab === 'automations' && (
        <div className="animate-fade-in" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <VisualWorkflowBuilder />
        </div>
      )}
    </>
  );
}
