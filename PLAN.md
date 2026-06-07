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

---

## 🔜 다음 할 일

### 우선: 지금까지 작업 커밋 (현재 전부 미커밋!)
- 데이터 레이어 / UI Phase 1을 의미 단위로 커밋해두기.

### UI 이관 Phase 2 — 홈 & 촬영자 탐색 (ROADMAP v0.2)
- 남은 `shared/ui`: section-header, horizontal-scroll, city-card, album-card,
  photographer-card, photo-masonry, tab-bar, bottom-sheet
  - bottom-sheet는 RN용으로 새로(Modal/reanimated 또는 @gorhom/bottom-sheet) 결정 필요
- 화면: home(page + section-renderer / region-sheet / filter-sheet / style-pills),
  photographers 목록, photographer 상세 + 탭(photos/reviews/spots)
- 탭 내비게이션 구조(홈/탐색/…) 설계 — 현재 home은 placeholder
- masonry/무한스크롤(FlatList/useInfiniteQuery)

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
```
