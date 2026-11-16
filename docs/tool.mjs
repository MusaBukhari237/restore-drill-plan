export function restorePlan(archive, version, container) {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,79}\.(?:dump|backup)$/.test(archive)) throw new Error("Use a local .dump or .backup basename, up to 87 characters.");
  if (!["15","16","17","18"].includes(version)) throw new Error("Choose a supported PostgreSQL major version.");
  if (!/^restore-drill-[a-z0-9]{1,24}$/.test(container)) throw new Error("Name must start restore-drill- followed by lowercase letters or digits.");
  return [
    ["docker","run","--pull","missing","--detach","--network","none","--name",container,"--env","POSTGRES_HOST_AUTH_METHOD=trust","postgres:"+version],
    ["docker","exec",container,"pg_isready","-h","127.0.0.1","-U","postgres"],
    ["docker","cp","./"+archive,container+":/tmp/drill.dump"],
    ["docker","exec",container,"pg_restore","--list","/tmp/drill.dump"],
    ["docker","exec",container,"createdb","-U","postgres","drill"],
    ["docker","exec",container,"pg_restore","--exit-on-error","--no-owner","--no-privileges","-U","postgres","-d","drill","/tmp/drill.dump"],
    ["docker","exec",container,"psql","-U","postgres","-d","drill","-c","\\dt"],
    ["docker","rm","-fv",container],
  ];
}
