import { Node, Edge } from 'reactflow';
import { ApiNodeData } from '@/services/nodeService';

/**
 * 백엔드 API 응답 데이터를 React Flow가 사용할 수 있는 노드와 엣지로 변환합니다.
 * @param apiData API로부터 받은 노드 데이터 배열
 * @returns nodes와 edges를 포함하는 객체
 */
export const convertApiToFlow = (apiData: ApiNodeData[]) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const rootNode = apiData.find(node => node.type === 'ROOT');
  const childNodes = apiData.filter(node => node.type !== 'ROOT');

  if (rootNode) {
    nodes.push({
      id: String(rootNode.id),
      type: 'rootNode',
      position: { x: 0, y: 0 },
      data: { label: rootNode.name },
    });
  }

  const angleStep = (2 * Math.PI) / (childNodes.length || 1);
  const radius = 300;

  childNodes.forEach((node, index) => {
    const x = radius * Math.cos(angleStep * index);
    const y = radius * Math.sin(angleStep * index) + 150;

    // [수정된 부분] nodeTypeMap의 타입을 명시적으로 지정
    const nodeTypeMap: { [key in 'CHILD' | 'TXT']: string } = {
      CHILD: 'childNode',
      TXT: 'txtNode',
    };

    // 'as'를 사용하여 node.type의 타입을 좁혀줍니다.
    const nodeType = nodeTypeMap[node.type as 'CHILD' | 'TXT'] || 'childNode';

    nodes.push({
      id: String(node.id),
      type: nodeType,
      position: { x, y },
      data: { label: node.name },
    });

    if (node.parentId !== null) {
      edges.push({
        id: `edge-${node.parentId}-${node.id}`,
        source: String(node.parentId),
        target: String(node.id),
      });
    }
  });

  return { nodes, edges };
};