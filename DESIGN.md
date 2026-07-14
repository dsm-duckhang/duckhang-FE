# Design

## Source of truth

- Status: Active
- Last refreshed: 2026-07-14
- Primary product surfaces: 로그인 앱의 모바일 로그인 랜딩과 인증 상태, 사용자 앱의 홈·행사 목록, 관리자 앱의 기본 홈
- Evidence reviewed: 사용자 제공 모바일 로그인·행사 목록 레퍼런스와 관리자 앱 실행 화면, 인증 API 계약, `README.md`, `CONVENTIONS.md`, `apps/login/src`, `apps/user/src`, `apps/admin/src`

## Brand

- Personality: 단정하고 친근하며 덕질의 경험과 여정을 응원하는 서비스
- Trust signals: 간결한 설명, 명확한 Google 단일 로그인 안내, 일관된 중립 색상
- Avoid: 과도한 장식, 미확정 브랜드 컬러, 이메일·비밀번호 로그인 암시
- Brand message: `덕질은 소비가 아니라 ‘여행’이다.`

## Product goals

- Goals: 처음 방문한 사용자가 덕행의 성격과 로그인 수단을 이해하고, 인증 후 역할에 맞는 홈과 진행 중이거나 다가오는 행사로 진입하도록 한다.
- Non-goals: 로그아웃, 행사 등록·상세·API 연동, 스탬프·마이페이지 라우팅, 완성된 브랜드 아이콘 제공
- Success signals: Google 로그인 버튼과 핵심 내비게이션을 작은 화면에서도 혼동 없이 찾고, 행사 카테고리와 카드 핵심 정보를 빠르게 훑을 수 있다.

## Personas and jobs

- Primary personas: 모바일에서 행사와 선행 기록을 확인하려는 덕행 사용자
- User jobs: 서비스 성격을 파악하고 Google 계정으로 시작한 뒤 관심 행사와 일정·장소를 확인한다.
- Key contexts of use: 320~430px 모바일 화면과 데스크톱의 중앙 모바일 프레임

## Information architecture

- Primary navigation: 행사, 홈, 스탬프, 마이페이지
- Core routes/screens: 로그인 앱 `/`, OAuth 결과 처리 `/oauth/callback`, 사용자 앱 홈 `/`·행사 목록 `/events`, 관리자 앱 홈 `/`·행사 `/events`·스탬프 `/stamps`·마이페이지 `/mypage`
- Content hierarchy: 브랜드 헤더, 화면 제목과 보조 설명, 주요 행동, 카테고리, 행사 카드 목록, 하단 내비게이션

## Design principles

- Clarity first: 한 화면에 하나의 인증 방식만 보여 준다.
- Mobile first: 핵심 조작 영역과 2열 행사 목록을 430px 이하 화면과 터치 입력에 맞춘다.
- Tradeoffs: 브랜드 에셋이 확정될 때까지 개성보다 교체 용이성과 중립성을 우선한다.

## Visual language

- Color: 흰색, 검정, 중립 회색을 기본으로 사용하며 현재 하단 메뉴와 선택 카테고리를 검정으로 강조한다. 행사 포스터만 콘텐츠 구분을 위한 색상을 허용한다.
- Typography: Inter, Pretendard, 시스템 sans-serif를 사용하고 핵심 문구의 `‘여행’이다.`를 반전된 굵은 타이포로 강조한다.
- Spacing/layout rhythm: 4px 배수 간격과 넉넉한 본문 여백을 사용하고, 행사 카드는 2열의 일정한 가로·세로 간격을 유지한다.
- Shape/radius/elevation: 주요 버튼은 알약 형태, 포스터는 작은 반경, 모바일 프레임에만 약한 그림자를 사용한다.
- Motion: 바텀시트는 240ms 동안 아래에서 진입하고 배경은 180ms 동안 페이드인하며, 나머지는 짧은 상태 색상 전환만 제공한다.
- Imagery/iconography: 헤더에는 `logo.png` 브랜드 로고를 사용하고, 나머지는 의존성 없는 임시 선형 아이콘을 사용한다. 행사 원본 이미지가 준비되기 전에는 교체 가능한 로컬 SVG 목업을 사용한다.

## Components

- Existing components to reuse: `@repo/ui`의 AppHeader, BottomNavigation, AppIcon
- New/changed components: 공유 UI를 앱별 로고·현재 경로·이동 처리와 연결하는 얇은 구성, 사용자 앱 EventCard·HomePage·EventsPage, 관리자 앱 App
- Variants and states: 사용자·관리자 앱의 현재 경로에 따른 하단 메뉴 활성 상태, 행사 카테고리 선택 상태, 미구현 행동의 비활성 상태, 버튼 hover·focus·active 상태
- Token/component ownership: 세 앱에서 공통인 헤더·하단 내비게이션·선형 아이콘은 `@repo/ui`가 소유하고, 라우팅·도메인 상태·콘텐츠는 각 앱이 소유한다.

## Accessibility

- Target standard: WCAG 2.1 AA 수준의 명확한 구조와 대비
- Keyboard/focus behavior: 모든 버튼에 가시적인 `focus-visible` 표시를 제공한다.
- Contrast/readability: 본문은 중립 600 이상, 핵심 텍스트는 중립 950을 사용한다.
- Screen-reader semantics: 헤더·메인·내비게이션 랜드마크, 버튼 접근성 이름과 비활성 상태, 현재 메뉴 상태, 로그인 바텀시트 dialog 이름을 제공한다.
- Reduced motion and sensory considerations: `prefers-reduced-motion` 환경에서는 바텀시트와 배경 진입 애니메이션을 제거한다.

## Responsive behavior

- Supported breakpoints/devices: 최소 320px 모바일부터 데스크톱 화면
- Layout adaptations: 430px 이하는 전체 폭, 초과 화면은 430px 프레임을 중앙 정렬하며 행사 카드는 모바일에서도 2열을 유지한다.
- Touch/hover differences: 헤더 버튼은 최소 44px 터치 영역을 확보하고 hover는 보조 피드백으로만 사용한다.

## Interaction states

- Menu: 로그인 화면은 햄버거 버튼으로 바텀시트를 열고 닫을 수 있으며, 사용자·관리자 앱 햄버거는 목적지가 확정될 때까지 준비 중 상태로 표시한다.
- Loading: 로그인 페이지로 이동 중 버튼을 비활성화하고, 사용자·관리자 앱은 저장된 세션을 확인하는 동안 진행 상태를 표시한다.
- Error: OAuth callback 실패 시 백엔드가 제공하는 오류 리다이렉트를 표시한다.
- Success: 사용자 OAuth 세션과 관리자 로그인 세션을 서로 다른 쿠키에 저장한 뒤 역할에 맞는 앱으로 리다이렉트한다.
- Authenticated entry: 유효한 역할별 세션으로 로그인·관리자 로그인·관리자 가입 화면에 접근하면 폼을 표시하지 않고 해당 앱으로 이동한다.
- Empty: 선택한 카테고리에 행사가 없으면 목록 대신 짧은 빈 상태 문구를 표시한다.
- Disabled: 리다이렉트 시작 후 로그인 버튼을 비활성화해 중복 이동을 막고, 미구현 행사 추가·스탬프·마이페이지·메뉴 기능은 비활성 상태로 표시한다.
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
- Authentication constraints: 사용자와 관리자 access token 및 식별 정보는 별도 쿠키에 저장하며, 관리자 앱은 토큰이 없거나 만료되면 관리자 로그인으로 이동한다.
- Test/screenshot expectations: 저장소 정책상 테스트 파일은 추가하지 않고 typecheck, lint, build, 실제 Google 인증과 앱 간 쿠키 공유를 검증한다. 행사 화면은 320px·390px·430px 및 데스크톱 중앙 프레임에서 레이아웃을 확인한다.

## Open questions

- [ ] 최종 브랜드 컬러와 나머지 아이콘 에셋 확정 / 제품 담당 / 활성 상태 표현에 영향
- [x] refresh token은 백엔드 HttpOnly 쿠키로 관리하고 access token 만료 시 사용자 앱에서 재발급 / 인증 담당
- [x] 행사 목록은 사용자 앱 `/events`로 제공하고 홈 `/`을 인증 후 초기 목적지로 유지 / 제품 담당
- [x] 관리자 로그인 성공 후 관리자 앱 `/`에서 브랜드 헤더와 홈 활성 하단 내비게이션을 제공 / 제품 담당
- [x] 관리자 하단 내비게이션의 네 메뉴를 각각의 앱 내부 경로와 준비 중 화면에 연결 / 제품 담당
- [ ] 행사 상세·등록 및 스탬프·마이페이지 목적지 라우트 확정 / 제품 담당 / 비활성 컨트롤 연결에 영향
- [ ] 실제 행사 포스터 에셋과 데이터 API 확정 / 콘텐츠·백엔드 담당 / 로컬 목업과 정적 데이터 교체에 영향
- [ ] 관리자 refresh token·재발급 API 계약 확정 / 인증 담당 / 만료된 관리자 세션의 자동 복원 여부에 영향
