# Duckhang Frontend Monorepo

React, TypeScript, Tailwind CSS, React Router DOM 기반의 pnpm 모노레포입니다.

## 구성

- `apps/login`: 로그인 앱 (`http://localhost:3000`)
- `apps/user`: 사용자 앱 (`http://localhost:3001`)
- `apps/admin`: 관리자 앱 (`http://localhost:3002`)
- `packages/auth`: 앱 간 쿠키 세션과 Zustand 인증 상태
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

Google 로그인은 백엔드가 OAuth 리다이렉트 흐름을 소유합니다. `apps/login/.env.example`을 참고해
로그인 시작 URL과 앱 이동 주소를 설정합니다.

```dotenv
VITE_API_BASE_URL=https://keenness-kinetic-improper.ngrok-free.dev
VITE_USER_APP_URL=http://localhost:3001
VITE_ADMIN_APP_URL=http://localhost:3002
```

환경변수에는 백엔드 base URL만 설정하고, `/api/auth/google/login`, `/api/auth/refresh` 같은 경로는
각 API 모듈에서 관리합니다. 운영에서 API와 프론트가 서로 다른 origin이면 백엔드가 실제 프론트 origin과 `Content-Type`,
`ngrok-skip-browser-warning` 헤더 및 credential 요청을 허용해야 합니다.

## 검증

```bash
pnpm lint
pnpm typecheck
pnpm build
```

각 앱은 `createBrowserRouter`와 `RouterProvider`를 사용하므로 운영 배포 시 모든 앱 내부 경로가 해당 앱의 `index.html`로 fallback되도록 웹 서버를 설정해야 합니다.

상세한 컴포넌트·폴더·import·Git 규칙은 [CONVENTIONS.md](./CONVENTIONS.md)를 따릅니다. 앱 내부 코드는 `@/` alias, 공통 패키지는 `@repo/*` namespace를 사용합니다.

`apps/login`의 Google 버튼은 `VITE_API_BASE_URL`의 `/api/auth/google/login`으로 이동합니다. 백엔드는 OAuth state 쿠키를
설정하고 Google 로그인과 callback 검증을 완료한 뒤 `/oauth/callback`으로 리다이렉트합니다.
callback 화면은 URL fragment의 access token을 즉시 회수한 뒤 주소에서 제거하고, localhost 앱 간
공유 쿠키와 Zustand에 `accessToken`, `newUser`를 저장한 다음 사용자 앱으로 이동합니다. refresh
token은 백엔드 도메인의 HttpOnly 쿠키로만 관리합니다. Google Client ID와 Client Secret도
백엔드에서만 관리합니다.

`apps/user`는 공용 Zustand 인증 상태를 쿠키에서 복원합니다. access token이 없거나 만료되면
`VITE_API_BASE_URL`의 `/api/auth/refresh`를 `credentials: include`로 호출해 백엔드 HttpOnly refresh cookie로 토큰을
재발급하고, 실패한 경우에만 로그인 앱으로 되돌립니다. 재발급 응답의 refresh token은 프론트에
저장하지 않으며 백엔드의 `Set-Cookie` 회전에 맡깁니다.
`apps/admin`은 초기 화면만 렌더링합니다.
