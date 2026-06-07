import { Redirect } from 'expo-router';

import { href } from '@shared/config';

export default function Index() {
  return <Redirect href={href('/splash')} />;
}
