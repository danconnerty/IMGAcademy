export const config = { runtime: 'edge' };

// Azure OpenAI chat completions endpoint.
// Env vars expected:
//   AZURE_OPENAI_ENDPOINT   - e.g. https://danconnerty-3920-resource.services.ai.azure.com
//                             (the base resource URL, WITHOUT /api/projects/... suffix)
//   AZURE_OPENAI_API_KEY    - resource API key
//   AZURE_OPENAI_DEPLOYMENT - deployment name (e.g. NTangibleAzureDemoAPI)
//   AZURE_OPENAI_API_VERSION (optional) - defaults to 2024-10-21
//
// Azure OpenAI does automatic prompt caching on static prefixes >= 1024 tokens.
// Keep the system prompt at the start of messages and stable across turns to benefit.

const DEFAULT_API_VERSION = '2024-10-21';

interface ChatRequestBody {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  system: string;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const body = await req.json() as ChatRequestBody;

  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION ?? DEFAULT_API_VERSION;

  if (!endpoint || !apiKey || !deployment) {
    return new Response(
      JSON.stringify({
        error: 'Azure OpenAI not configured. Set AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, and AZURE_OPENAI_DEPLOYMENT.'
      }),
      { status: 500 }
    );
  }

  // Normalize endpoint - strip any trailing slash or AI Foundry project suffix.
  const baseEndpoint = endpoint.replace(/\/+$/, '').replace(/\/api\/projects\/.*$/, '');

  const url = `${baseEndpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

  // OpenAI shape: system prompt is a message with role 'system' at the start.
  const messages = [
    { role: 'system', content: body.system },
    ...body.messages
  ];

  const payload = JSON.stringify({
    messages,
    max_tokens: 512,
    temperature: 0.2
  });

  const delays = [1000, 2000, 4000];

  for (let attempt = 0; attempt <= delays.length; attempt++) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: payload
    });

    const data = await response.text();

    // Retry on rate limit or transient server errors.
    if ((response.status === 429 || response.status >= 500) && attempt < delays.length) {
      await new Promise(r => setTimeout(r, delays[attempt]));
      continue;
    }

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Azure OpenAI error ${response.status}`, detail: data }),
        { status: response.status, headers: { 'content-type': 'application/json' } }
      );
    }

    // Normalize the response shape so ragService can keep parsing data.content[].text
    // without caring which provider is behind the endpoint.
    const parsed = JSON.parse(data) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = parsed.choices?.[0]?.message?.content ?? '';

    return new Response(
      JSON.stringify({ content: [{ type: 'text', text }] }),
      { status: 200, headers: { 'content-type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ error: 'Azure OpenAI overloaded, please try again' }),
    { status: 503 }
  );
}
