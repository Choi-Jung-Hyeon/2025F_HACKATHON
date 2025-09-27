'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  addEdge, // 엣지를 추가하기 위해 import
} from 'reactflow';
import 'reactflow/dist/style.css';

// 컴포넌트, 서비스, 유틸리티 import
import RootNode from './nodes/RootNode';
import ChildNode from './nodes/ChildNode';
import TxtNode from './nodes/TxtNode';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { createInitialNodes, createChildNode } from '@/services/nodeService'; // createChildNode import
import { convertApiToFlow } from '@/lib/flowUtils';

// 커스텀 노드 타입 등록
const nodeTypes = {
  rootNode: RootNode,
  childNode: ChildNode,
  txtNode: TxtNode,
};

export default function MindMapCanvas() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newNodeName, setNewNodeName] = useState(''); // Dialog Input의 상태
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog의 열림/닫힘 상태

  const searchParams = useSearchParams();

  // 초기 노드 생성 로직
  useEffect(() => {
    const topic = searchParams.get('topic');
    if (topic && nodes.length === 0) {
      setIsLoading(true);
      const fetchInitialNodes = async () => {
        try {
          const apiData = await createInitialNodes(topic);
          if (apiData && apiData.length > 0) {
            const { nodes: flowNodes, edges: flowEdges } = convertApiToFlow(apiData);
            setNodes(flowNodes);
            setEdges(flowEdges);
          }
        } catch (error) {
          console.error("초기 노드를 불러오는 데 실패했습니다.", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchInitialNodes();
    } else {
      setIsLoading(false);
    }
  }, [searchParams, nodes.length]);

  // '새 노드 추가' 기능 핸들러
  const handleCreateNode = async () => {
    if (!newNodeName.trim()) {
      alert('노드 이름을 입력하세요.');
      return;
    }
    if (selectedNodeIds.length !== 1) {
      alert('부모로 지정할 노드 하나를 먼저 선택해주세요.');
      return;
    }
    
    const parentId = parseInt(selectedNodeIds[0]);
    const projectId = 1; // 임시 프로젝트 ID

    try {
      const newNodeData = await createChildNode(newNodeName, projectId, parentId);
      
      const parentNode = nodes.find(n => n.id === String(parentId));
      const newPosition = parentNode 
        ? { x: parentNode.position.x + Math.random() * 200 - 100, y: parentNode.position.y + 150 }
        : { x: Math.random() * 400, y: Math.random() * 400 };

      const newNode: Node = {
        id: String(newNodeData.id),
        type: 'childNode',
        position: newPosition,
        data: { label: newNodeData.name },
      };

      const newEdge: Edge = {
        id: `edge-${newNodeData.parentId}-${newNodeData.id}`,
        source: String(newNodeData.parentId),
        target: String(newNodeData.id),
      };

      setNodes((nds) => nds.concat(newNode));
      setEdges((eds) => addEdge(newEdge, eds));
      
      setNewNodeName('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('새 노드 생성에 실패했습니다:', error);
      alert('노드 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onSelectionChange = useCallback(({ nodes }: { nodes: Node[] }) => {
    setSelectedNodeIds(nodes.map(node => node.id));
  }, []);

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">캔버스를 불러오는 중...</div>;
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="absolute top-10 right-10 z-10 shadow-lg">새 노드 추가</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>새로운 노드 생성</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-500">
            {selectedNodeIds.length === 1 
              ? `'${nodes.find(n => n.id === selectedNodeIds[0])?.data.label}' 노드의 자식으로 생성됩니다.`
              : '자식을 추가할 부모 노드 하나를 먼저 선택해주세요.'}
          </p>
          <Input 
            placeholder="노드의 내용을 입력하세요..."
            value={newNodeName}
            onChange={(e) => setNewNodeName(e.target.value)}
            disabled={selectedNodeIds.length !== 1}
          />
          <DialogFooter>
            <Button onClick={handleCreateNode} disabled={selectedNodeIds.length !== 1}>
              생성하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>

      {selectedNodeIds.length > 1 && (
        <Button
          className="absolute bottom-10 right-10 z-10 shadow-lg"
          onClick={() => console.log('조합할 노드들:', selectedNodeIds)}
        >
          선택된 노드 조합하기
        </Button>
      )}
    </div>
  );
}