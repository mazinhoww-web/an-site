// Observabilidade minima e dependency-light: log estruturado + captura de erro +
// alertas (falha de email, 5xx). Seam para Sentry: se SENTRY_DSN estiver setado,
// plugue Sentry.captureException dentro de captureError (ver DEPLOY.md).
//
// Alertas externos (best-effort): se ALERT_WEBHOOK_URL estiver setado, um POST
// JSON compacto e enviado (Slack/Discord/webhook). Sem a env, vira no-op.

type Json = Record<string, unknown>;

const ALERT_WEBHOOK_URL = process.env.ALERT_WEBHOOK_URL;

function log(level: 'error' | 'warn' | 'info', event: string, data: Json): void {
  // Log estruturado (uma linha JSON) — facil de coletar em qualquer agregador.
  const line = JSON.stringify({ level, event, ts: new Date().toISOString(), ...data });
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

async function postAlert(payload: Json): Promise<void> {
  if (!ALERT_WEBHOOK_URL) return;
  try {
    await fetch(ALERT_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: `[MentorMatch] ${payload.event}`, ...payload }),
    });
  } catch {
    // best-effort: alerta nunca quebra o fluxo principal.
  }
}

function serializeError(error: unknown): Json {
  if (error instanceof Error) return { name: error.name, message: error.message, stack: error.stack };
  return { message: String(error) };
}

/** Captura um erro: log estruturado + alerta externo. Seam para Sentry. */
export function captureError(scope: string, error: unknown, extra?: Json): void {
  const data: Json = { scope, ...serializeError(error), ...extra };
  log('error', 'error', data);
  void postAlert({ event: `error:${scope}`, ...data });
  // SENTRY: if (process.env.SENTRY_DSN) Sentry.captureException(error, { tags: { scope }, extra });
}

/** Alerta de falha de envio de email (must-have de observabilidade). */
export function alertEmailFailure(kind: string, to: string, error: unknown): void {
  const data: Json = { kind, to, ...serializeError(error) };
  log('error', 'email_failure', data);
  void postAlert({ event: `email_failure:${kind}`, ...data });
}

/** Alerta de resposta 5xx em endpoint (use no catch dos route handlers). */
export function alert5xx(endpoint: string, error: unknown, extra?: Json): void {
  const data: Json = { endpoint, ...serializeError(error), ...extra };
  log('error', 'http_5xx', data);
  void postAlert({ event: `5xx:${endpoint}`, ...data });
}
