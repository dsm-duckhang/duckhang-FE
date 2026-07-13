# Frontend Conventions

## Component Driven

- 컴포넌트는 하나의 역할만 담당한다.
- 페이지는 데이터 연결과 컴포넌트 조합만 담당한다.
- 앱 내부 공통 UI는 `src/components`, 도메인 UI는 `src/features`, 라우팅 화면은 `src/pages`에 둔다.
- 여러 앱에서 재사용하는 코드는 목적에 따라 `@repo/ui`, `@repo/types`, `@repo/utils`로 이동한다.
- 현재 프로젝트 정책에 따라 테스트 파일은 작성하지 않는다.

## Component Structure

```text
components/
└── Button/
    ├── Button.tsx
    └── index.ts
```

- 컴포넌트 파일명은 PascalCase를 사용한다.
- 파일 내부는 import, type, component, export 순서로 작성한다.
- 컴포넌트는 default export하고 폴더의 `index.ts`에서 다시 export한다.
- Props는 컴포넌트 파일에 두고 boolean 이름은 `is`, `has`, `can`으로 시작한다.

## Imports

- 앱 내부 모듈은 `@/` alias를 사용한다.
- 공통 패키지는 `@repo/*` namespace를 사용한다.
- 같은 컴포넌트 폴더의 barrel export처럼 모듈 자체를 구성하는 경우에만 상대 경로를 사용한다.

## Tailwind CSS

- className은 layout, size, spacing, typography, color, state 순서로 작성한다.
- 반복되는 className은 복사하지 않고 공통 또는 feature 컴포넌트로 추출한다.
- 공통 UI의 Tailwind source는 각 앱의 `index.css`에서 `packages/ui/src`를 포함한다.

## Git

- 브랜치: `feature/*`, `fix/*`, `refactor/*`, `chore/*`
- 커밋 제목과 본문은 한국어로 작성한다.
- 커밋 prefix는 `feat:`, `fix:`, `refactor:`, `style:`, `chore:`를 사용한다.
- 예시: `feat: 로그인 UI 추가`, `fix: 버튼 오류 수정`, `chore: 모노레포 초기 설정`
