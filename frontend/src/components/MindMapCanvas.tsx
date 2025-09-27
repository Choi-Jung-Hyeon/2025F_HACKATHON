'use client'; // 클라이언트 컴포넌트로 지정

import React, { useState, useCallback } from 'react';
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

// React Flow의 기본 CSS를 import합니다.
import 'reactflow/dist/style.css';

// 필요한 컴포넌트들을 import합니다.
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// 커스텀 노드 타입을 등록합니다.
const nodeTypes = {
  rootNode: RootNode,
  childNode: ChildNode,
  txtNode: TxtNode,
};

// 초기 노드와 엣지 데이터 (TxtNode 포함)
const initialNodes: Node[] = [
  { id: 'root-1', type: 'rootNode', position: { x: 0, y: 0 }, data: { label: '해커톤 주제: 고립' } },
  { id: 'child-1', type: 'childNode', position: { x: -200, y: 150 }, data: { label: '정서적 고립' } },
  { id: 'child-2', type: 'childNode', position: { x: 200, y: 150 }, data: { label: '물리적 고립' } },
  { id: 'txt-1', type: 'txtNode', position: { x: -200, y: 300 }, data: { label: '정서적 고립에 대한 생각' } },
];

const initialEdges: Edge[] = [
  { id: 'edge-1', source: 'root-1', target: 'child-1' },
  { id: 'edge-2', source: 'root-1', target: 'child-2' },
  { id: 'edge-3', source: 'child-1', target: 'txt-1' },
];


export default function MindMapCanvas() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  // 선택된 노드들의 ID를 저장할 상태 추가
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  
  // selection이 변경될 때 호출되는 콜백 함수
  const onSelectionChange = useCallback(({ nodes }: { nodes: Node[] }) => {
    // 선택된 노드들의 id만 추출하여 상태에 저장
    setSelectedNodeIds(nodes.map(node => node.id));
  }, []);

  return (
    // 팝업 버튼들을 absolute 포지션으로 배치하기 위해 relative div로 감쌉니다.
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      
      {/* '새 노드 추가' 버튼 및 Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="absolute top-10 right-10 z-10 shadow-lg">
            새 노드 추가
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새로운 노드 생성</DialogTitle>
          </DialogHeader>
          <Input placeholder="노드의 내용을 입력하세요..." />
          <DialogFooter>
            <Button onClick={() => console.log('새 노드 생성 API 호출')}>
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

      {/* '조합하기' 버튼: 2개 이상의 노드가 선택되었을 때만 렌더링 */}
      {selectedNodeIds.length > 1 && (
        <Button
          className="absolute bottom-10 right-10 z-10 shadow-lg"
          onClick={() => {
            console.log('조합할 노드들:', selectedNodeIds);
            // TODO: 여기에 POST /api/v1/node/merge API 호출 로직 추가
          }}
        >
          선택된 노드 조합하기
        </Button>
      )}
    </div>
  );
}