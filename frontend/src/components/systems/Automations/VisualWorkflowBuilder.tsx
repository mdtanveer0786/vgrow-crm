import React, { useState, useRef, useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { TriggerNode, ConditionNode, ActionNode } from './CustomNodes';
import { Zap, ListFilter, Play, Save, Settings } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';

const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'trigger',
    data: { label: 'Lead Created', description: 'When a new lead enters the pipeline' },
    position: { x: 250, y: 50 },
  },
];

let id = 10;
const getId = () => `dndnode_${id++}`;

const Flow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let newNodeData = { label: 'New Node', description: 'Configure this node' };
      if (type === 'trigger') newNodeData = { label: 'New Trigger', description: 'When this happens' };
      if (type === 'condition') newNodeData = { label: 'New Condition', description: 'If this is true' };
      if (type === 'action') newNodeData = { label: 'New Action', description: 'Then do this' };

      const newNode = {
        id: getId(),
        type,
        position,
        data: newNodeData,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      {/* Sidebar / Toolbar */}
      <Card
        padding="16px"
        style={{
          width: '280px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          borderRight: '1px solid var(--border-color)',
          borderRadius: 0,
          borderTop: 0,
          borderBottom: 0,
          borderLeft: 0,
          boxShadow: 'none',
          zIndex: 10,
        }}
      >
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-primary)' }}>Nodes</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Drag and drop nodes onto the canvas to build your workflow.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              onDragStart={(event) => onDragStart(event, 'trigger')}
              draggable
              style={{
                padding: '12px',
                border: '1px solid var(--accent-indigo)',
                borderRadius: '8px',
                background: 'rgba(99, 102, 241, 0.05)',
                cursor: 'grab',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <Zap className="w-4 h-4 text-indigo-400" />
              Trigger Node
            </div>

            <div
              onDragStart={(event) => onDragStart(event, 'condition')}
              draggable
              style={{
                padding: '12px',
                border: '1px solid var(--accent-amber)',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.05)',
                cursor: 'grab',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <ListFilter className="w-4 h-4 text-amber-400" />
              Condition Node
            </div>

            <div
              onDragStart={(event) => onDragStart(event, 'action')}
              draggable
              style={{
                padding: '12px',
                border: '1px solid var(--accent-emerald)',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.05)',
                cursor: 'grab',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <Play className="w-4 h-4 text-emerald-400" />
              Action Node
            </div>
          </div>
        </div>
      </Card>

      {/* Canvas */}
      <div style={{ flexGrow: 1, height: '100%', position: 'relative' }} ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          style={{ background: 'var(--bg-default)' }}
        >
          <Background color="var(--border-color)" gap={16} />
          <Controls style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
          
          <Panel position="top-right" style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button variant="primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Save className="w-4 h-4" />
              Save Workflow
            </Button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

export default function VisualWorkflowBuilder() {
  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
        <Flow />
      </div>
    </ReactFlowProvider>
  );
}
