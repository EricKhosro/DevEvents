export const runtime = "nodejs";

export function GET() {
  return Response.json({
    vercelEnv: process.env.VERCEL_ENV ?? null,
    hasMongoUri: Boolean(process.env.MONGODB_URI),
  });
}
