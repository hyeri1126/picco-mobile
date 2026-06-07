import type { Href } from 'expo-router';

// 데이터 레이어가 참조하는 라우트 경로 상수.
// 실제 화면(app/ 라우트)은 UI 단계에서 생성된다. 그 전까지 expo-router의
// typedRoutes가 이 경로들을 모르므로 href()로 Href 캐스팅해 타입을 통과시킨다.
// 라우트가 만들어지면 이 상수 값들이 그대로 유효한 Href가 된다.
export const ROUTES = {
  home: '/home',
  auth: '/auth',
  selectType: '/profile/select-type',
  setupClient: '/profile/setup/client',
  setupPhotographer: '/profile/setup/photographer',
  profileComplete: '/profile/complete',
  photographers: '/photographers',
} as const;

export const href = (path: string): Href => path as unknown as Href;
