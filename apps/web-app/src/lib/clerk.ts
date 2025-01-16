export async function getSessionToken() {
  if (!window.Clerk?.session) {
    return null;
  }

  return (await window.Clerk.session.getToken()) ?? null;
}
