# 생각의 지도 (Mind Map Project)

'생각의 고립'에서 벗어나 아이디어를 무한히 확장할 수 있도록 돕는 AI 기반 마인드맵 서비스입니다. 사용자가 입력한 핵심 주제를 시작으로, AI가 연관된 하위 주제를 추천하고 아이디어를 시각적으로 정리하며 발전시켜 나갈 수 있도록 지원합니다.

이 프로젝트는 2025년 해커톤 출품작입니다.

## 주요 기능

  - **AI 기반 아이디어 확장**: 사용자가 시작 주제를 입력하면, AI가 관련된 하위 주제들을 자동으로 추천하여 마인드맵을 생성합니다.
  - **인터랙티브 캔버스**:
      - 생성된 아이디어 노드를 클릭하여 하위 아이디어를 계속해서 확장해나갈 수 있습니다.
      - 여러 아이디어를 다중 선택하여 하나의 새로운 아이디어로 '조합'할 수 있습니다.
      - 사용자가 직접 노드를 추가하거나 삭제하며 자유롭게 생각을 정리할 수 있습니다.
  - **커스텀 노드 시스템**:
      - **Root/Child/Txt** 세 가지 타입의 노드로 아이디어의 위계를 시각적으로 구분합니다.
      - 각 노드를 '중요' 상태로 표시하여 아이디어의 우선순위를 관리할 수 있습니다.
      - Txt 노드에서는 생각을 기록하는 메모 기능과 AI에게 구체적인 아이디어를 제안받는 기능이 있습니다.
  - **직관적인 UI/UX**: 깔끔한 시작 페이지와 사용하기 쉬운 캔버스 인터페이스를 제공합니다.

## 기술 스택

### 🖥️ 프런트엔드 (Frontend)

  - **Framework**: Next.js
  - **Language**: TypeScript
  - **Styling**: Tailwind CSS
  - **UI Components**: shadcn/ui
  - **State Management & Canvas**: React Flow
  - **Notifications**: Sonner

### ⚙️ 백엔드 (Backend)

  - **Framework**: Spring Boot
  - **Language**: Java
  - **Database**: PostgreSQL (Production), H2 (Development)
  - **ORM**: Spring Data JPA

## 실행 방법

### 1\. 프런트엔드 실행

1.  `frontend` 디렉토리로 이동합니다.
    ```bash
    cd frontend
    ```
2.  필요한 라이브러리를 설치합니다.
    ```bash
    pnpm install
    ```
3.  `.env.local` 파일을 생성하고 백엔드 서버 주소를 입력합니다.
    ```
    NEXT_PUBLIC_API_BASE_URL=http://{백엔드_서버_IP}:{포트}/api/v1
    ```
4.  개발 서버를 실행합니다.
    ```bash
    pnpm dev
    ```
5.  브라우저에서 `http://localhost:3000`으로 접속합니다.

### 2\. 백엔드 실행

1.  `backend/my-app` 디렉토리로 이동합니다.
2.  Gradle을 사용하여 프로젝트를 빌드하고 실행합니다.
    ```bash
    ./gradlew bootRun
    ```