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
} from 'reactflow';
import 'reactflow/dist/style.css';

// 컴포넌트, 서비스, 유틸리티 import
import RootNode from './nodes/RootNode';
import ChildNode from './nodes/ChildNode';
import TxtNode from './nodes/TxtNode';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createInitialNodes } from '@/services/nodeService';
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
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  
  const searchParams = useSearchParams();

  // 페이지가 로드되면 URL에서 'topic'을 읽어와 API를 호출합니다.
  useEffect(() => {
    const topic = searchParams.get('topic');
    if (topic) {
      setIsLoading(true);
      const fetchInitialNodes = async () => {
        const apiData = await createInitialNodes(topic);
        if (apiData && apiData.length > 0) {
          const { nodes: flowNodes, edges: flowEdges } = convertApiToFlow(apiData);
          setNodes(flowNodes);
          setEdges(flowEdges);
        }
        setIsLoading(false);
      };
      fetchInitialNodes();
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

  const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onSelectionChange = useCallback(({ nodes }: { nodes: Node[] }) => {
    setSelectedNodeIds(nodes.map(node => node.id));
  }, []);

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">로딩 중...</div>;
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="absolute top-10 right-10 z-10 shadow-lg">새 노드 추가</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>새로운 노드 생성</DialogTitle></DialogHeader>
          <Input placeholder="노드의 내용을 입력하세요..." />
          <DialogFooter>
            <Button onClick={() => console.log('새 노드 생성 API 호출')}>생성하기</Button>
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