# NodeSpark: LLM 기반 아이디어 확장 마인드맵 서비스

> **2025 해커톤 프로젝트** (Frontend Lead & System Design)
> "생각의 고립을 깨고, 무한한 아이디어의 확장을 시각화하다."

## 1. 프로젝트 소개 (Project Overview)
**NodeSpark**는 사용자의 초기 아이디어를 기반으로 LLM이 연관 키워드를 제안하고, 이를 마인드맵 형태로 시각화하여 사고를 확장해 나가는 서비스입니다.
단순 텍스트 나열이 아닌, **노드(Node)와 엣지(Edge)로 구성된 그래프 인터페이스**를 통해 사용자가 직관적으로 사고를 구체화할 수 있도록 돕습니다.

* **Key Challenge**: 복잡한 그래프 데이터의 시각화 및 실시간 상호작용 구현
* **Solution**: 재귀적 컴포넌트 설계와 Canvas API를 활용한 최적화

## 2. 기술 스택 (Tech Stack)

### Frontend
* **Core**: Next.js 14, TypeScript
* **Styling**: Tailwind CSS
* **Visualization**: Custom SVG/Canvas Logic (for Mindmap)

### Backend & Infrastructure
* **Server**: Spring Boot (Java), AWS EC2 (Ubuntu)
* **Database**: AWS RDS (PostgreSQL), H2 (Local Dev)
* **DevOps**: GitHub Actions, Vercel

## 3. 시스템 아키텍처 & 배포 파이프라인 (Architecture & Deployment)
단기간의 해커톤이지만, **실제 서비스 가능한 수준의 개발 환경(DX)**을 구축하기 위해 자동화된 배포 파이프라인을 설계했습니다.

### 3.1. Infrastructure
* **AWS EC2**: 백엔드 API 서버 호스팅 (Dockerized Spring Boot Application)
* **AWS RDS**: 데이터 영속성을 위한 PostgreSQL 운영 (Production 환경)
* **Local Env**: 개발 생산성을 위해 로컬에서는 H2 DB를 사용하도록 환경 분리

### 3.2. CI/CD Pipeline
개발자가 비즈니스 로직에만 집중할 수 있도록 GitHub Actions를 통해 배포 과정을 자동화했습니다.
* **Frontend**: Vercel 연동을 통한 자동 빌드 및 배포
* **Backend**: Main 브랜치 Push 시 → GitHub Actions 트리거 → EC2 서버 접속 및 최신 코드 배포 → 서비스 자동 재시작

```mermaid
graph LR
    A[Developer] -->|Push Main| B(GitHub Repo)
    B -->|Action Trigger| C{CI/CD Pipeline}
    C -->|Frontend| D[Vercel Deployment]
    C -->|Backend| E[AWS EC2 (Spring Boot)]
    E -->|Connection| F[(AWS RDS)]
````

## 4\. 핵심 기능 (Key Features)

  * **🔍 AI 기반 아이디어 합성 (Idea Synthesis)**: 선택된 노드의 맥락(Context)을 분석하여 LLM이 새로운 연관 키워드를 생성
  * **📝 메모 노드 관리**: 각 아이디어 노드에 종속된(Dependency) 상세 메모 생성/수정/삭제 기능
  * **🌳 재귀적 마인드맵 (Recursive Mindmap)**: 부모-자식 관계를 가진 노드들의 무한 확장 및 편집
  * **⚡ UX 최적화**: 캔버스 줌/팬(Zoom/Pan), 노드 드래그 앤 드롭 등 데스크탑 애플리케이션 수준의 조작감 제공

## 5\. 데이터베이스 설계 (ERD)

마인드맵의 계층형 데이터를 효율적으로 관리하기 위해 **재귀적 참조(Self-Referencing)** 구조를 적용했습니다.

  * **Project**: 사용자별 마인드맵 프로젝트 관리
  * **Node**: `parent_id`를 통해 트리 구조 형성, `node_text` 및 `memo_text` 관리

## 6\. API 인터페이스 (API Interface)

  * `POST /api/v1/node`: 아이디어 노드 생성 (LLM 합성 요청 포함)
  * `DELETE /api/v1/node/:id`: 특정 노드 및 하위 트리(Sub-tree) 일괄 삭제
  * `GET /api/v1/projects/info`: 프로젝트 전체 그래프 데이터 조회

-----

*Created by Choi Jung Hyeon*
