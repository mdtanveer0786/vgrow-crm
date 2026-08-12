import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Zap, Play, CheckCircle2, ListFilter, ArrowRightCircle } from 'lucide-react';

const baseNodeStyle = {
  padding: '16px',
  borderRadius: '12px',
  background: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  minWidth: '220px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  color: 'var(--text-primary)',
} as React.CSSProperties;

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  fontWeight: '600',
  paddingBottom: '8px',
  borderBottom: '1px solid var(--border-color)',
} as React.CSSProperties;

export const TriggerNode = ({ data }: { data: any }) => {
  return (
    <div style={{ ...baseNodeStyle, borderColor: 'var(--accent-indigo)' }}>
      <div style={{ ...headerStyle, color: 'var(--accent-indigo)' }}>
        <Zap className="w-4 h-4" />
        Trigger
      </div>
      <div style={{ fontSize: '13px' }}>
        <strong>{data.label || 'Select Event'}</strong>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          {data.description || 'When this happens...'}
        </p>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: 'var(--accent-indigo)', width: '10px', height: '10px' }} />
    </div>
  );
};

export const ConditionNode = ({ data }: { data: any }) => {
  return (
    <div style={{ ...baseNodeStyle, borderColor: 'var(--accent-amber)' }}>
      <Handle type="target" position={Position.Top} style={{ background: 'var(--accent-amber)', width: '10px', height: '10px' }} />
      <div style={{ ...headerStyle, color: 'var(--accent-amber)' }}>
        <ListFilter className="w-4 h-4" />
        Condition
      </div>
      <div style={{ fontSize: '13px' }}>
        <strong>{data.label || 'Check condition'}</strong>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          {data.description || 'If this is true...'}
        </p>
      </div>
      <Handle type="source" position={Position.Bottom} id="true" style={{ background: 'var(--accent-emerald)', left: '30%', width: '10px', height: '10px' }} />
      <Handle type="source" position={Position.Bottom} id="false" style={{ background: 'var(--accent-rose)', left: '70%', width: '10px', height: '10px' }} />
    </div>
  );
};

export const ActionNode = ({ data }: { data: any }) => {
  return (
    <div style={{ ...baseNodeStyle, borderColor: 'var(--accent-emerald)' }}>
      <Handle type="target" position={Position.Top} style={{ background: 'var(--accent-emerald)', width: '10px', height: '10px' }} />
      <div style={{ ...headerStyle, color: 'var(--accent-emerald)' }}>
        <Play className="w-4 h-4" />
        Action
      </div>
      <div style={{ fontSize: '13px' }}>
        <strong>{data.label || 'Do something'}</strong>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          {data.description || 'Then execute this action.'}
        </p>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: 'var(--accent-emerald)', width: '10px', height: '10px' }} />
    </div>
  );
};
