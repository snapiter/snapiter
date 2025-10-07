import { unstable_noStore as noStore } from 'next/cache'
import { ENV_PREFIX } from './envprefix';

export default function getEnv() {
  noStore();
  return Object.entries(process.env).reduce((acc: Record<string, string | undefined>, [key, value]) => {
    if (key.startsWith(ENV_PREFIX)) {
      acc[key] = value;
    }
    return acc;
  }, {});
}
