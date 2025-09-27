import { ApiNodeData } from "@/services/nodeService"; // ApiNodeData 타입을 import 합니다.

// 이 파일은 백엔드 API가 완성되기 전까지 프런트엔드 테스트를 위한 가짜(dummy) 데이터와 함수를 제공합니다.

let nextNodeId = 10; // 새 노드 ID 생성을 위한 카운터

export const createInitialDummyNodes = (topic: string): ApiNodeData[] => {
  console.log(`[DUMMY API] 초기 노드 생성: ${topic}`);
  // [수정] 반환되는 배열의 타입을 명확히 합니다.
  return [
    { id: 1, name: topic, type: 'ROOT', parentId: null },
    { id: 2, name: `${topic}의 정의`, type: 'CHILD', parentId: 1 },
    { id: 3, name: `${topic}의 원인`, type: 'CHILD', parentId: 1 },
    { id: 4, name: `${topic} 해결 방안`, type: 'TXT', parentId: 1 },
  ];
};

export const createChildDummyNode = (name: string, parentId: number): ApiNodeData => {
  console.log(`[DUMMY API] 자식 노드 생성: ${name}, 부모 ID: ${parentId}`);
  const newNode: ApiNodeData = { // [수정] 새 노드의 타입을 명확히 합니다.
    id: nextNodeId++,
    name,
    type: 'CHILD',
    parentId,
  };
  return newNode;
};

export const mergeDummyNodes = (nodeIds: number[]): ApiNodeData => {
  console.log(`[DUMMY API] 노드 병합:`, nodeIds);
  const newNode: ApiNodeData = { // [수정] 병합된 노드의 타입을 명확히 합니다.
    id: nextNodeId++,
    name: `병합된 아이디어`,
    type: 'CHILD',
    parentId: 1, // 병합된 노드는 항상 Root에 연결 (테스트용)
  };
  return newNode;
};

export const deleteDummyNodes = (nodeIds: number[]) => {
  console.log(`[DUMMY API] 노드 삭제:`, nodeIds);
  return;
};

export const getAiSuggestionDummy = async (nodeId: number) => {
    console.log(`[DUMMY API] AI 제안 요청: Node ID ${nodeId}`);
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    return {
        content: "이 주제에 대해 더 깊이 생각해보기 위해 관련 책을 읽어보는 것은 어떨까요? 예를 들어, '고립의 심리학' 같은 책이 도움이 될 수 있습니다."
    };
};