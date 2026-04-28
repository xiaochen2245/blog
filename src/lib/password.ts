export function verifyPassword(request: Request): boolean {
  const password = request.headers.get('x-password');
  const correctPassword = process.env.EDITOR_PASSWORD;

  if (!correctPassword) {
    console.error('EDITOR_PASSWORD not set');
    return false;
  }

  return password === correctPassword;
}
