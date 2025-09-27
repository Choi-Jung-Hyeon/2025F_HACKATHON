export interface Project {
  id: number;
  title: string;
}

// API 기본 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * 모든 프로젝트 목록을 가져오는 함수
 * @returns Project 배열을 포함하는 Promise
 */
export const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/projects/info`, {
      cache: 'no-store', // 항상 최신 데이터를 가져오기 위해 캐시 사용 안 함
    });

    // HTTP 응답이 성공적이지 않을 경우 에러를 던집니다.
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data: Project[] = await response.json();
    console.log(data)
    return data;
    
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    // 에러 발생 시 빈 배열을 반환하거나, 에러를 다시 던져서
    // 호출한 쪽에서 처리하게 할 수 있습니다.
    return [];
  }
};

// 만약 특정 프로젝트 하나만 가져오는 함수가 필요하다면?
// export const getProjectById = async (id: number): Promise<Project> => { ... };