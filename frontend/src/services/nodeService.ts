// 백엔드 서버의 IP 주소와 포트
const API_BASE_URL = 'http://3.38.252.116:8080/api/v1';

// API 응답 타입 정의
export interface ApiNodeData {
  id: number;
  name: string;
  type: 'ROOT' | 'CHILD' | 'TXT';
  parentId: number | null;
}

export interface ApiMemoData {
  id: number;
  content: string;
  nodeId: number;
}

export interface ApiSuggestionData {
  content: string;
}

/**
 * [기존 함수] 초기 노드 생성
 */
export const createInitialNodes = async (topic: string, projectId: number = 1): Promise<ApiNodeData[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/node`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: topic, projectId: projectId }),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('초기 노드 생성 API 호출에 실패했습니다:', error);
    return [];
  }
};

/**
 * [기존 함수] 자식 노드 생성
 */
export const createChildNode = async (name: string, projectId: number, parentId: number): Promise<ApiNodeData> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/node`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, projectId, parentId }),
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
  }
  return await response.json();
};

/**
 * [기존 함수] 노드 병합
 */
export const mergeNodes = async (nodeIds: number[]): Promise<ApiNodeData> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/node/merge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nodeIds),
    });
    if(!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }
    return await response.json();
};

/**
 * [추가된 함수] 선택된 노드들을 삭제하는 API
 * @param nodeIds 삭제할 노드 ID들의 배열
 */
export const deleteNodes = async (nodeIds: number[]): Promise<void> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/node/delete`, {
        method: 'POST', // API 명세에 따라 POST
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(nodeIds),
    });

    if(!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }
    // 성공 시 반환값이 없으므로, 여기서 종료
};


/**
 * [기존 함수] 메모 저장
 */
export const saveMemo = async (nodeId: number, content: string): Promise<ApiMemoData> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/memo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nodeId, content }),
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
};

/**
 * [기존 함수] AI 아이디어 제안 요청
 */
export const getAiSuggestion = async (nodeId: number): Promise<ApiSuggestionData> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/memo/suppose/${nodeId}`, {
    method: 'GET',
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
};