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
  addEdge,
  NodeMouseHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { toast } from "sonner";

// 컴포넌트 import
import RootNode from './nodes/RootNode';
import ChildNode from './nodes/ChildNode';
import TxtNode from './nodes/TxtNode';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
// [수정] 더미 API와 유틸리티 import
import { createInitialDummyNodes, createChildDummyNode, mergeDummyNodes, deleteDummyNodes, createSubDummyNodes } from '@/lib/dummyApi';
import { convertApiToFlow } from '@/lib/flowUtils';

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
  const [newNodeName, setNewNodeName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    const topic = searchParams.get('topic');
    if (topic && nodes.length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        const apiData = createInitialDummyNodes(topic);
        const { nodes: flowNodes, edges: flowEdges } = convertApiToFlow(apiData);
        setNodes(flowNodes);
        setEdges(flowEdges);
        setIsLoading(false);
        toast.success(`'${topic}' 주제로 캔버스가 생성되었습니다.`);
      }, 500);
    } else {
      setIsLoading(false);
    }
  }, [searchParams, nodes.length]);

  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    if (node.type === 'childNode') {
      const hasChildren = edges.some(edge => edge.source === node.id);
      if (hasChildren) {
        console.log("이미 확장된 노드입니다.");
        return;
      }

      toast.info(`'${node.data.label}'에 대한 하위 주제를 생성합니다...`);
      const subNodesData = createSubDummyNodes(node.data.label, parseInt(node.id));
      
      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];
      const angleStep = Math.PI / (subNodesData.length + 1);
      const radius = 150;

      subNodesData.forEach((subNode, index) => {
        const angle = angleStep * (index + 1) - Math.PI / 2;
        const x = node.position.x + radius * Math.cos(angle);
        const y = node.position.y + radius * Math.sin(angle) + 100;
        
        newNodes.push({
          id: String(subNode.id),
          type: subNode.type === 'TXT' ? 'txtNode' : 'childNode',
          position: { x, y },
          data: { label: subNode.name },
        });

        newEdges.push({
          id: `edge-${subNode.parentId}-${subNode.id}`,
          source: String(subNode.parentId),
          target: String(subNode.id),
        });
      });
      setNodes(nds => nds.concat(newNodes));
      setEdges(eds => eds.concat(newEdges));
    }
  }, [edges, nodes]);

  const handleCreateNode = async () => {
    if (!newNodeName.trim()) return alert('노드 이름을 입력하세요.');
    if (selectedNodeIds.length !== 1) return alert('부모로 지정할 노드 하나를 먼저 선택해주세요.');
    const parentId = parseInt(selectedNodeIds[0]);
    const newNodeData = createChildDummyNode(newNodeName, parentId);
    const parentNode = nodes.find(n => n.id === String(parentId));
    const newPosition = parentNode 
      ? { x: parentNode.position.x + Math.random() * 200 - 100, y: parentNode.position.y + 150 }
      : { x: 0, y: 0 };
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
    setNodes(nds => nds.concat(newNode));
    setEdges(eds => addEdge(newEdge, eds));
    setNewNodeName('');
    setIsDialogOpen(false);
    toast.success("새로운 노드를 추가했습니다.");
  };

  const handleMergeNodes = async () => {
    if (selectedNodeIds.length < 2) return;
    const idsToMerge = selectedNodeIds.map(id => parseInt(id));
    const newNodeData = mergeDummyNodes(idsToMerge);
    const parentNode = nodes.find(n => n.id === String(newNodeData.parentId));
    const newPosition = parentNode 
      ? { x: parentNode.position.x - 200, y: parentNode.position.y + 150 }
      : { x: 0, y: 0 };
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
    setNodes(nds => nds.concat(newNode));
    setEdges(eds => addEdge(newEdge, eds));
    toast.success("노드를 성공적으로 조합했습니다.");
  };

  const onNodesDelete = useCallback((deletedNodes: Node[]) => {
    const idsToDelete = deletedNodes.map(node => parseInt(node.id));
    if (idsToDelete.length === 0) return;
    deleteDummyNodes(idsToDelete);
    toast.success("노드를 삭제했습니다.");
  }, []);

  const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onSelectionChange = useCallback(({ nodes }: { nodes: Node[] }) => {
    setSelectedNodeIds(nodes.map(node => node.id));
  }, []);

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">캔버스를 생성하는 중...</div>;
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
              <Button onClick={handleCreateNode} disabled={selectedNodeIds.length !== 1}>생성하기</Button>
            </DialogFooter>
          </DialogContent>
      </Dialog>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onSelectionChange={onSelectionChange}
        onNodesDelete={onNodesDelete}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
      {selectedNodeIds.length > 1 && (
        <Button
          className="absolute bottom-10 right-10 z-10 shadow-lg"
          onClick={handleMergeNodes}
        >
          선택된 노드 조합하기
        </Button>
      )}
    </div>
  );
}