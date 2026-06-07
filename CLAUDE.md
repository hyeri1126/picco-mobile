# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

# 스택 / 패키지 설치

- Expo SDK 54 · expo-router v6 · React Native 0.81 · React 19 · NativeWind v4(tailwind v3 config)
- 데이터: axios + @tanstack/react-query + zustand · 토큰: expo-secure-store
- 스토리지/업로드: @supabase/supabase-js + expo-image-picker
- 이미지: expo-image · 그라데이션: expo-linear-gradient · 아이콘: react-native-svg
- 패키지 설치는 **항상 `npx expo install <pkg>`** — SDK 54 호환 버전으로 맞춰 설치된다.
  `npm install`로 직접 깔거나 RN/Expo 의존성을 수동으로 올리지 말 것.
- 호환성 점검: `npx expo install --check` 또는 `npx expo-doctor`.

# UI 컨벤션 (항상 적용)

- **일관성 = 공용 컴포넌트 적극 재사용.** 새 화면을 만들 때 인라인 SVG/스타일을 중복하지 말고
  `shared/ui` 프리미티브를 먼저 찾아 쓴다. 없으면 프리미티브로 추출한 뒤 조합한다.
  (아이콘은 `shared/ui/icons.tsx` 중앙화, 칩/로딩/빈 상태 등 반복 패턴은 `shared/ui`로.)
- **설계 = 유연하게(확장성).** 데이터 주도 + 타입 분기로 확장 지점을 열어 둔다
  (예: `home-section-renderer`의 `section.type` 분기). 한 군데 하드코딩보다
  variant/prop으로 일반화해 추후 기능 추가가 쉽도록 한다.
- 한 줄 원칙: **겉(UI)은 통일, 속(구조)은 유연.**
