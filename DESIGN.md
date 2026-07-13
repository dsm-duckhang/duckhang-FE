# Design

## Source of truth

- Status: Active
- Last refreshed: 2026-07-13
- Primary product surfaces: 로그인 앱의 모바일 로그인 랜딩과 Google 인증 상태
- Evidence reviewed: 사용자 제공 모바일 로그인 레퍼런스·인증 API 계약, `README.md`, `CONVENTIONS.md`, `apps/login/src`

## Brand

- Personality: 단정하고 친근하며 덕질의 경험과 여정을 응원하는 서비스
- Trust signals: 간결한 설명, 명확한 Google 단일 로그인 안내, 일관된 중립 색상
- Avoid: 과도한 장식, 미확정 브랜드 컬러, 이메일·비밀번호 로그인 암시
- Brand message: `덕질은 소비가 아니라 ‘여행’이다.`

## Product goals

- Goals: 처음 방문한 사용자가 덕행의 성격과 유일한 로그인 수단을 즉시 이해하도록 한다.
- Non-goals: 로그아웃, 행사·스탬프·마이페이지 라우팅, 완성된 브랜드 아이콘 제공
- Success signals: Google 로그인 버튼과 핵심 내비게이션을 작은 화면에서도 혼동 없이 찾을 수 있다.

## Personas and jobs

- Primary personas: 모바일에서 행사와 선행 기록을 확인하려는 덕행 사용자
- User jobs: 서비스 성격을 파악하고 Google 계정으로 시작할 진입점을 찾는다.
- Key contexts of use: 320~430px 모바일 화면과 데스크톱의 중앙 모바일 프레임

## Information architecture

- Primary navigation: 행사, 홈, 스탬프, 마이페이지
- Core routes/screens: 로그인 앱 `/`, OAuth 결과 처리 `/oauth/callback`, 인증 성공 후 사용자 앱 `/`
- Content hierarchy: 브랜드 헤더, 핵심 브랜드 메시지, Google 로그인, 인증 안내, 하단 내비게이션, 햄버거 메뉴 바텀시트

## Design principles

- Clarity first: 한 화면에 하나의 인증 방식만 보여 준다.
- Mobile first: 핵심 조작 영역을 430px 이하 화면과 터치 입력에 맞춘다.
- Tradeoffs: 브랜드 에셋이 확정될 때까지 개성보다 교체 용이성과 중립성을 우선한다.

## Visual language

- Color: 흰색, 검정, 중립 회색만 사용하며 홈 활성 상태는 검정으로 강조한다.
- Typography: Inter, Pretendard, 시스템 sans-serif를 사용하고 핵심 문구의 `‘여행’이다.`를 반전된 굵은 타이포로 강조한다.
- Spacing/layout rhythm: 4px 배수 간격과 넉넉한 본문 여백을 사용한다.
- Shape/radius/elevation: 버튼은 16px 반경, 모바일 프레임에만 약한 그림자를 사용한다.
- Motion: 바텀시트는 240ms 동안 아래에서 진입하고 배경은 180ms 동안 페이드인하며, 나머지는 짧은 상태 색상 전환만 제공한다.
- Imagery/iconography: 헤더에는 `logo.png` 브랜드 로고를 사용하고, 나머지는 의존성 없는 임시 선형 아이콘을 사용한다.

## Components

- Existing components to reuse: 없음
- New/changed components: AppHeader, AppMenuSheet, BottomNavigation, IconPlaceholder, GoogleLoginButton, LoginPage
- Variants and states: 홈을 초기값으로 두고 푸터 또는 바텀시트에서 선택한 메뉴가 함께 활성화되는 상태, 바텀시트 열림·닫힘 상태, 버튼 hover·focus·active 상태
- Token/component ownership: 현재 로그인 앱 내부가 소유하며 여러 앱에서 재사용될 때 `@repo/ui`로 승격한다.

## Accessibility

- Target standard: WCAG 2.1 AA 수준의 명확한 구조와 대비
- Keyboard/focus behavior: 모든 버튼에 가시적인 `focus-visible` 표시를 제공한다.
- Contrast/readability: 본문은 중립 600 이상, 핵심 텍스트는 중립 950을 사용한다.
- Screen-reader semantics: 헤더·메인·내비게이션 랜드마크, 버튼 접근성 이름, 현재 메뉴 상태, 바텀시트 dialog 이름을 제공한다.
- Reduced motion and sensory considerations: `prefers-reduced-motion` 환경에서는 바텀시트와 배경 진입 애니메이션을 제거한다.

## Responsive behavior

- Supported breakpoints/devices: 최소 320px 모바일부터 데스크톱 화면
- Layout adaptations: 430px 이하는 전체 폭, 초과 화면은 430px 프레임을 중앙 정렬한다.
- Touch/hover differences: 헤더 버튼은 최소 44px 터치 영역을 확보하고 hover는 보조 피드백으로만 사용한다.

## Interaction states

- Menu: 햄버거 버튼으로 바텀시트를 열고 배경·닫기 버튼·Escape 키로 닫으며, 메뉴 선택 시 푸터 활성 상태를 동기화한다.
- Loading: OAuth 로그인 페이지로 이동 중 버튼을 비활성화하고 진행 상태를 표시한다.
- Empty: 해당 없음
- Error: OAuth callback 실패 시 백엔드가 제공하는 오류 리다이렉트를 표시한다.
- Success: 백엔드가 세션을 설정하고 사용자 앱으로 리다이렉트한다.
- Disabled: 리다이렉트 시작 후 Google 버튼을 비활성화해 중복 이동을 막는다.
- Offline/slow network, if applicable: 브라우저의 페이지 이동 실패 상태를 따른다.

## Content voice

- Tone: 핵심 브랜드 문구는 선언적으로, 설명과 안내는 짧고 따뜻한 존댓말로 작성한다.
- Terminology: 서비스명은 `덕행`, 인증 수단은 `Google 계정`으로 통일한다.
- Microcopy rules: `덕질은 소비가 아니라 ‘여행’이다.`를 로그인 화면의 최우선 메시지로 사용하고, 기술 용어 대신 사용자가 수행할 행동과 제한을 직접 설명한다.

## Implementation constraints

- Framework/styling system: React, TypeScript, Tailwind CSS, React Router DOM
- Design-token constraints: 브랜드 토큰이 없으므로 앱 내부 Tailwind 중립 색상만 사용한다.
- Performance constraints: OAuth 시작을 브라우저 리다이렉트로 처리하며 별도 Google SDK를 추가하지 않는다.
- Compatibility constraints: `100dvh`와 `100vh` fallback을 함께 사용한다.
- Test/screenshot expectations: 저장소 정책상 테스트 파일은 추가하지 않고 typecheck, lint, build, 실제 Google 인증과 앱 간 쿠키 공유를 검증한다.

## Open questions

- [ ] 최종 브랜드 컬러와 나머지 아이콘 에셋 확정 / 제품 담당 / 활성 상태 표현에 영향
- [x] refresh token은 백엔드 HttpOnly 쿠키로 관리하고 access token 만료 시 사용자 앱에서 재발급 / 인증 담당
- [ ] 행사·스탬프·마이페이지 목적지 라우트 확정 / 제품 담당 / 하단 내비게이션 동작에 영향
