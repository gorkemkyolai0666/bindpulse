const VERCEL_API = "https://api.vercel.com";

async function vercelFetch(path: string, init: RequestInit = {}) {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    throw new Error("VERCEL_TOKEN is required");
  }

  const response = await fetch(`${VERCEL_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Vercel API ${path} failed (${response.status}): ${body}`);
  }

  return body ? JSON.parse(body) : null;
}

export async function provisionVercel() {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    console.log("⚠️ VERCEL_TOKEN not set — skipping Vercel provisioning");
    return;
  }

  const projectName = process.env.PROJECT_NAME ?? "project";
  const repo = process.env.GITHUB_REPOSITORY ?? `gorkemkyolai0666/${projectName}`;

  try {
    await vercelFetch(`/v9/projects/${projectName}`);
    console.log(`ℹ️ Vercel project already exists: ${projectName}`);
    return;
  } catch {
    console.log(`🚀 Creating Vercel project: ${projectName}`);
  }

  const created = await vercelFetch("/v11/projects", {
    method: "POST",
    body: JSON.stringify({
      name: projectName,
      framework: "nextjs",
      rootDirectory: "frontend",
      gitRepository: {
        type: "github",
        repo: repo,
      },
    }),
  });

  console.log(`✅ Vercel project successfully created: ${created.name}`);

  // Backend Railway URL'ini Vercel env olarak inject et
  try {
    // Railway backend URL pattern: https://<project>-backend-production.up.railway.app
    const railwayBackendUrl = `https://${projectName}-backend-production.up.railway.app/api`;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || railwayBackendUrl;

    await vercelFetch(`/v10/projects/${projectName}/env`, {
      method: "POST",
      body: JSON.stringify({
        key: "NEXT_PUBLIC_API_URL",
        value: backendUrl,
        type: "plain",
        target: ["production", "preview", "development"],
      }),
    });
    console.log(`✅ Injected NEXT_PUBLIC_API_URL=${backendUrl} into Vercel settings.`);
  } catch (envError) {
    console.error("⚠️ Failed to inject env vars to Vercel:", envError);
  }
}
