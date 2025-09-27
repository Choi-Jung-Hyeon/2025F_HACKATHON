/**
 * 새로운 프롬프트를 서버에 POST 요청으로 전송합니다.
 * @param prompt 사용자가 입력한 텍스트
 * @returns 서버로부터의 응답 데이터
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const postNewProject = async (prompt: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/projects/add`, { // 요청을 보낼 API 경로
      method: 'POST', // 요청 방식
      headers: {
        'Content-Type': 'application/json', // 본문이 JSON 형식임을 명시
      },
      // JavaScript 객체를 JSON 문자열로 변환하여 본문에 담아 전송
      body: JSON.stringify({ prompt: prompt }), 
    });

    if (!response.ok) {
      // 서버 응답이 실패(2xx 상태 코드가 아님)한 경우 에러를 발생시킴
      throw new Error(`API call failed with status: ${response.status}`);
    }

    return await response.json(); // 성공 응답을 JSON으로 파싱하여 반환
  } catch (error) {
    console.error("Failed to post prompt:", error);
    // 실제 앱에서는 사용자에게 에러를 알려주는 로직을 추가하는 것이 좋습니다.
    throw error;
  }
};