export function emailShell({
    heading,
    bodyHtml,
    ctaLabel,
    ctaUrl,
}: {
    heading: string;
    bodyHtml: string;
    ctaLabel: string;
    ctaUrl: string;
}): string {
    return `
  <div style="background:#0a0a0f;padding:40px 16px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#13131a;border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:32px;color:#f4f4f5;">
      <h1 style="margin:0 0 8px;font-size:20px;background:linear-gradient(90deg,#7c3aed,#22d3ee);-webkit-background-clip:text;background-clip:text;color:transparent;">AuthNexus</h1>
      <h2 style="margin:0 0 16px;font-size:18px;color:#f4f4f5;">${heading}</h2>
      <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#a1a1aa;">${bodyHtml}</p>
      <a href="${ctaUrl}" style="display:inline-block;padding:12px 24px;border-radius:10px;background:linear-gradient(90deg,#7c3aed,#22d3ee);color:#0a0a0f;text-decoration:none;font-weight:600;font-size:14px;">${ctaLabel}</a>
      <p style="margin:24px 0 0;font-size:12px;color:#71717a;">If the button doesn't work, copy and paste this link into your browser:<br/>${ctaUrl}</p>
    </div>
  </div>`;
}
