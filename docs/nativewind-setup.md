# NativeWind 셋업 & 트러블슈팅 노트

> Expo SDK 54 (RN 0.81, Hermes) 프로젝트에 NativeWind(=RN용 Tailwind) 붙인 기록.

## 설치한 것

```
npx expo install nativewind react-native-reanimated react-native-safe-area-context
npm install -D tailwindcss@^3.4.17          # ⚠️ v3 (v4 아님)
npx expo install babel-preset-expo          # ⚠️ 아래 주의 참고
```

- `nativewind` 4.2.4
- `tailwindcss` 3.x  ← **NativeWind v4는 Tailwind v3 기반. v4 깔면 깨짐.**
- `babel-preset-expo` **54.x** ← SDK 메이저와 맞춰야 함 (아래 이슈)

## 생성/수정한 파일

- `tailwind.config.js` — `presets: [require("nativewind/preset")]` + 웹 디자인 토큰(`primary` 등) 이식
- `global.css` — `@tailwind base/components/utilities`
- `babel.config.js` — `["babel-preset-expo", { jsxImportSource: "nativewind" }]` + `"nativewind/babel"`
- `metro.config.js` — `withNativeWind(config, { input: "./global.css" })`
- `nativewind-env.d.ts` — `/// <reference types="nativewind/types" />`
- `app/_layout.tsx` — 맨 위에 `import "../global.css";`

설정 바꾼 뒤엔 **항상 캐시 클리어**: `npx expo start -c`

---

## ⚠️ 겪은 이슈 & 해결

### 1. `Cannot find module 'babel-preset-expo'`
- 직접 만든 `babel.config.js`가 `babel-preset-expo`를 참조하는데 설치돼 있지 않아서.
- 해결: 설치. **단, 버전 주의 (아래).**

### 2. `Runtime not ready: SyntaxError` (폰 빨간 화면, 터미널엔 안 찍힘)
- **원인**: `npm install -D babel-preset-expo`를 **버전 없이** 깔아서 **최신(56.x)**이 설치됨. 프로젝트는 **SDK 54**라 프리셋 메이저가 안 맞음 → 번들은 만들어지지만 Hermes가 못 읽어 `SyntaxError`.
- **핵심**: `babel-preset-expo` 메이저 버전 = **Expo SDK 메이저와 일치**해야 함. SDK 54 → `babel-preset-expo@~54.x`.
- **해결**:
  ```
  npm install -D babel-preset-expo@54.0.11
  npx expo start -c
  ```
- **왜 터미널에 안 찍히나**: "Runtime not ready"는 RN 런타임/에러리포터가 켜지기 *전에* 터지는 거라 Metro 터미널로 전달이 안 됨. 폰 화면에만 뜸. (번들링 자체는 성공한 상태라 번들 에러도 아님)

### 교훈
- Expo 프로젝트에 의존성 추가할 땐 가능하면 **`npx expo install <pkg>`** 사용 (SDK에 맞는 버전 선택). 단 `babel-preset-expo`는 버전맵에 없어서 안 잡힐 수 있으니 **`@54.x` 직접 핀**.
- 설정 변경 후 이상하면 **`-c`(캐시 클리어)** 부터.
