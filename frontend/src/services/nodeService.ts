// 백엔드 서버의 IP 주소와 포트
const API_BASE_URL = 'http://3.38.252.116:8080/api/v1';

// API 응답으로 기대되는 노드 데이터의 타입 (백엔드 DB 구조 기반)
export interface ApiNodeData {
  id: number;
  name: string;
  type: 'ROOT' | 'CHILD' | 'TXT';
  parentId: number | null;
}

/**
 * 새로운 노드(초기 대주제)를 생성하고 관련 노드들을 받아오는 API 호출 함수
 * @param topic 사용자가 입력한 대주제 문자열
 * @param projectId 현재 작업 중인 프로젝트 ID (임시로 1 사용)
 * @returns 생성된 노드들의 데이터가 담긴 배열
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
 * [추가된 함수] 특정 부모 아래에 새로운 자식 노드를 생성하는 API 호출 함수
 * @param name 새로 생성할 노드의 이름
 * @param projectId 현재 프로젝트 ID
 * @param parentId 부모 노드의 ID
 * @returns 생성된 새로운 노드 데이터
 */
export const createChildNode = async (name: string, projectId: number, parentId: number): Promise<ApiNodeData> => {
  const response = await fetch(`${API_BASE_URL}/node`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // 백엔드 기획서에 명시된 요청 본문(body) 형식
    body: JSON.stringify({
      name: name,
      projectId: projectId,
      parentId: parentId,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
  }

  return await response.json();
};