# Picco Mobile — 작업 현황 & 계획

> Next.js(`../frontend`, FSD 구조)로 만든 Picco를 React Native(Expo SDK 54 +
> expo-router + NativeWind)로 이관하는 작업. 이 문서는 진행 상황과 다음 할 일을 추적한다.
> 최종 업데이트: 2026-06-07

## 스택
- Expo SDK 54, expo-router v6, React Native 0.81, React 19
- NativeWind v4 (tailwind v3 config) — 디자인 토큰은 `tailwind.config.js`에 이식
- 데이터: axios + @tanstack/react-query + zustand
- 인증 토큰: expo-secure-store (메모리 캐시로 동기 접근)
- 스토리지/업로드: @supabase/supabase-js + expo-image-picker
- 아이콘: react-native-svg / 그라데이션: expo-linear-gradient

## 아키텍처 (frontend FSD 미러링)
```
entities/   순수 타입(user, profile, photographer, match)
shared/     types, config(env·routes), api(http-client), auth(token-storage·store),
            lib(query-client·providers·socket·supabase·upload·location·parse-error), ui
features/   auth, home, photographer, profile, region  (각 api.ts + hooks.ts)
widgets/    header
app/        expo-router 라우트
```
경로 alias: `@shared @entities @features @widgets @/*` (tsconfig paths, Metro 네이티브 지원)

---

## ✅ 완료

### 1. 데이터 레이어 이관 (전체)
- entities / shared/types — 순수 타입 그대로 이관
- `shared/config/env.ts` — `EXPO_PUBLIC_*` + `__DEV__`
- `shared/auth/token-storage.ts` — SecureStore + 메모리 캐시 + `hydrate()`
- `shared/api/http-client.ts` — axios, 401 시 `setUnauthorizedHandler` 콜백 위임
- `shared/auth/auth-store.ts`, `AuthInitializer.tsx`(expo-router)
- `shared/lib` — query-client / providers(devtools 제거) / socket / supabase(url-polyfill
  +AsyncStorage) / upload(RN `ImageAsset` uri 방식) / location-store(AsyncStorage persist)
- `features/*` — api.ts 그대로, hooks.ts는 expo-router로 적응
- 검증: `tsc --noEmit` 통과

### 2. UI 이관 Phase 1 — 인증 + 프로필 플로우 (ROADMAP v0.1)
- 디자인 토큰: `tailwind.config.js`에 globals.css 색상 팔레트 + `typo-*` 유틸 이식
- `shared/ui`: icons(svg 14종), logo, brand-logo, button, chip-group,
  step-progress-bar, avatar-uploader / `widgets/header`
- 라우트 재구성(스타터 `(tabs)`·modal 제거):
  `index→splash` · `splash` · `auth/{index,email-login,email-signup}` ·
  `profile/{select-type, setup/client, setup/photographer, complete}` · `home`
- 루트 `_layout`: Providers + SafeAreaProvider + 401 핸들러
- 화면 9개 전부 RN 재작성, 데이터 훅 연결
- 검증: `tsc --noEmit` 통과 + `expo export`(Metro 번들 1625 모듈) 성공

### 3. UI 이관 Phase 2 — 홈 & 촬영자 탐색 (ROADMAP v0.2)
- 아이콘 중앙화: Phase 2 아이콘 13종을 `shared/ui/icons.tsx`에 추가(인라인 SVG 금지)
- 재사용 프리미티브 신규: `Pill`(스타일칩/필터정렬·테마/리뷰필터 단일 소스),
  `Skeleton`(Animated 펄스), `EmptyState`
- 카드 `shared/ui`: section-header, horizontal-scroll, city-card, album-card,
  photographer-card(ranked/mini), photo-masonry(2열), tab-bar, bottom-sheet
- 화면 컴포넌트는 `features/*/components`에 배치(expo-router가 `app/_components`
  제외를 보장 안 함):
  - `features/home/components`: style-pills, home-section-renderer, region-sheet, filter-sheet
  - `features/photographer/components`: photos-tab, reviews-tab, spots-tab
- 화면(`app/`): `home/index`(재작성), `photographers/index`(FlatList+무한스크롤),
  `photographers/[id]`(프로필+탭 photos/reviews/spots)
- `home-section-renderer`는 section.type 분기 → 새 섹션 추가에 열린 구조
- 검증: `tsc --noEmit` 통과 + `expo export`(Metro 번들 1654 모듈) 성공

---

## 🔜 다음 할 일

### 추후
- 소셜 로그인(카카오/구글) SDK 실연동 — 현재 버튼 UI만 있음
- Be Vietnam Pro 폰트 적용(현재 시스템 폰트)
- 실기기 테스트용 API IP 설정(.env, localhost→LAN IP)
- 채팅(v0.3)·예약(v0.4)·결제(v0.6) 등은 frontend도 미구현 → 이관 대상 아님

## 메모 / 결정 사항
- 토큰 저장: expo-secure-store (동기 인터페이스 유지 위해 메모리 캐시)
- 라우트 경로 상수: `shared/config/routes.ts`의 `ROUTES` + `href()` 캐스팅
  (typedRoutes가 미생성 라우트를 모를 때 타입 통과용)
- supabase는 키 없으면 import 시점 에러 → 업로드 기능 쓰기 전 `.env` 필요
- frontend ROADMAP 원본: `../frontend/ROADMAP.md`
- **이미지/그라데이션은 `style`로 스타일링** — `expo-image`/`expo-linear-gradient`는
  NativeWind cssInterop 대상이 아니라 `className` 무시됨(Phase 1부터의 패턴)
- **그리드 너비는 분수+패딩**(`w-1/2 p-1` 등) — `calc()`는 NativeWind에서 불안정
- bottom-sheet: `@gorhom` 미설치라 RN `Modal`(slide)로 구현 → 추후 교체 가능
- filter 가격: RN 슬라이더 미설치라 프리셋 칩으로 대체(슬라이더 도입 시 교체)
- tab-bar: 홈만 동작, 실시간/채팅/프로필은 stub(화면 미구현) — frontend와 동일
- 탭 내비게이션은 expo-router `Tabs` 대신 frontend처럼 화면마다 `<TabBar/>` 렌더
```
