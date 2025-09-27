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
    const response = await fetch(`${API_BASE_URL}/node`, {
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
  const response = await fetch(`${API_BASE_URL}/node`, {
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
 * [추가된 함수] 여러 노드를 병합하여 새로운 노드를 생성하는 API
 * @param nodeIds 병합할 노드 ID들의 배열
 * @returns 새로 생성된 병합 노드 데이터
 */
export const mergeNodes = async (nodeIds: number[]): Promise<ApiNodeData> => {
    const response = await fetch(`${API_BASE_URL}/node/merge`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(nodeIds), // 백엔드는 ID 리스트를 직접 받습니다.
    });

    if(!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }
    return await response.json();
};


/**
 * [기존 함수] 메모 저장
 */
export const saveMemo = async (nodeId: number, content: string): Promise<ApiMemoData> => {
  // ... (이전 코드와 동일)
  const response = await fetch(`${API_BASE_URL}/memo`, {
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
  // ... (이전 코드와 동일)
  const response = await fetch(`${API_BASE_URL}/memo/suppose/${nodeId}`, {
    method: 'GET',
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
};