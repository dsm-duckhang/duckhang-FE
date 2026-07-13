# Duckhang Frontend Monorepo

React, TypeScript, Tailwind CSS, React Router DOM 기반의 pnpm 모노레포입니다.

## 구성

- `apps/login`: 로그인 앱 (`http://localhost:3000`)
- `apps/user`: 사용자 앱 (`http://localhost:3001`)
- `apps/admin`: 관리자 앱 (`http://localhost:3002`)
- `packages/ui`: 향후 세 앱의 공통 UI를 추가할 패키지
- `packages/types`: 공통 도메인 타입
- `packages/utils`: 공통 유틸리티
- `packages/eslint-config`: 공통 React/TypeScript ESLint 설정

## 시작하기

```bash
pnpm install
pnpm dev
```

개별 앱만 실행하려면 `pnpm dev:login`, `pnpm dev:user`, `pnpm dev:admin`을 사용합니다.

## 검증

```bash
pnpm lint
pnpm typecheck
pnpm build
```

각 앱은 `createBrowserRouter`와 `RouterProvider`를 사용하므로 운영 배포 시 모든 앱 내부 경로가 해당 앱의 `index.html`로 fallback되도록 웹 서버를 설정해야 합니다.

상세한 컴포넌트·폴더·import·Git 규칙은 [CONVENTIONS.md](./CONVENTIONS.md)를 따릅니다. 앱 내부 코드는 `@/` alias, 공통 패키지는 `@repo/*` namespace를 사용합니다.

현재는 초기 디렉터리 구성 단계이므로 각 앱은 앱 이름(`login`, `user`, `admin`)만 렌더링하며 예제 UI는 포함하지 않습니다.
각 앱의 `src/router/index.tsx`에서 React Router DOM 라우트를 관리하며 현재는 루트 경로(`/`)만 등록되어 있습니다.
