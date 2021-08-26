export function getParamOrExit(name: string): string {
  const param = process.env[name];
  if (!param) {
    console.error('Required config param missing:', name);
    process.exit(1);
  }
  return param;
}

export function getParam(name: string): string | null {
  const param = process.env[name];
  if (!param) {
    return null;
  }
  return param;
}
