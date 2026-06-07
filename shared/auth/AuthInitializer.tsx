import { useEffect } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES, href } from '@shared/config';
import { useAuthStore } from './auth-store';

// 앱 부팅 시 토큰 hydrate + /auth/me 로 세션 복원. dest에 따라 라우팅한다.
// app/_layout 등 최상위에 한 번 마운트해서 사용.
export function AuthInitializer() {
  const { user, initializeAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user) return;
    let cancelled = false;
    initializeAuth().then((dest) => {
      if (cancelled) return;
      if (dest === 'auth') router.replace(href(ROUTES.auth));
      else if (dest === 'select-type') router.replace(href(ROUTES.selectType));
      else router.replace(href(ROUTES.home));
    });
    return () => {
      cancelled = true;
    };
    // 마운트 시 1회 실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
