import { handlers } from '@/lib/mentormatch/auth';

// MentorMatch auth endpoints (separate instance, basePath /api/mentormatch/auth).
// Not shadowed by the /mentormatch/* proxy rewrites: this path starts with /api.
export const { GET, POST } = handlers;
