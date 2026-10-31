const VERCEL_HOST = "peercode-beige.vercel.app";

export async function onRequest({ request }) {
  const targetUrl = new URL(request.url);
  targetUrl.protocol = "https:";
  targetUrl.host = VERCEL_HOST;

  return fetch(targetUrl.toString(), request);
}
