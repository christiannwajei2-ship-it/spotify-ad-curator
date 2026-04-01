import type { ReportData } from './types';

function formatCurrency(n: number): string {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatPercent(n: number): string {
  return `${n.toFixed(2)}%`;
}

export function generatePDFReport(data: ReportData): void {
  const styles = `
    body { font-family: Arial, sans-serif; color: #1a1a2e; margin: 0; padding: 20px; }
    h1 { color: #7c3aed; font-size: 24px; margin-bottom: 4px; }
    h2 { color: #5b21b6; font-size: 18px; border-bottom: 2px solid #7c3aed; padding-bottom: 6px; margin-top: 24px; }
    h3 { color: #374151; font-size: 14px; margin-bottom: 8px; }
    .subtitle { color: #6b7280; font-size: 13px; margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
    .metric { background: #f3f0ff; border-radius: 8px; padding: 12px; text-align: center; }
    .metric-value { font-size: 22px; font-weight: bold; color: #7c3aed; }
    .metric-label { font-size: 11px; color: #6b7280; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
    th { background: #7c3aed; color: white; padding: 8px 12px; text-align: left; }
    td { padding: 7px 12px; border-bottom: 1px solid #e5e7eb; }
    tr:nth-child(even) td { background: #f9fafb; }
    .footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 11px; text-align: center; }
    @media print { body { padding: 0; } }
  `;

  const platformRows = data.platforms
    .map(
      (p) =>
        `<tr><td>${p.name}</td><td>${formatCurrency(p.spend)}</td><td>${p.impressions.toLocaleString()}</td><td>${p.clicks.toLocaleString()}</td><td>${formatPercent(p.ctr)}</td><td>${p.roas.toFixed(2)}x</td></tr>`
    )
    .join('');

  const dailyRows = (data.dailyData ?? [])
    .map(
      (d) =>
        `<tr><td>${d.date}</td><td>${formatCurrency(d.spend)}</td><td>${d.impressions.toLocaleString()}</td><td>${d.clicks.toLocaleString()}</td><td>${d.conversions.toLocaleString()}</td><td>${formatPercent(d.ctr)}</td></tr>`
    )
    .join('');

  const html = `<!DOCTYPE html><html><head><title>${data.title}</title><style>${styles}</style></head><body>
    <h1>${data.title}</h1>
    <p class="subtitle">Period: ${data.dateRange.label} &nbsp;|&nbsp; Generated: ${new Date().toLocaleDateString()}</p>

    <h2>Executive Summary</h2>
    <div class="grid">
      <div class="metric"><div class="metric-value">${formatCurrency(data.summary.totalSpend)}</div><div class="metric-label">Total Spend</div></div>
      <div class="metric"><div class="metric-value">${data.summary.totalImpressions.toLocaleString()}</div><div class="metric-label">Impressions</div></div>
      <div class="metric"><div class="metric-value">${data.summary.totalClicks.toLocaleString()}</div><div class="metric-label">Clicks</div></div>
      <div class="metric"><div class="metric-value">${data.summary.totalConversions.toLocaleString()}</div><div class="metric-label">Conversions</div></div>
      <div class="metric"><div class="metric-value">${formatPercent(data.summary.avgCtr)}</div><div class="metric-label">Avg CTR</div></div>
      <div class="metric"><div class="metric-value">${data.summary.roas.toFixed(2)}x</div><div class="metric-label">ROAS</div></div>
    </div>

    <h2>Platform Breakdown</h2>
    <table><thead><tr><th>Platform</th><th>Spend</th><th>Impressions</th><th>Clicks</th><th>CTR</th><th>ROAS</th></tr></thead>
    <tbody>${platformRows}</tbody></table>

    ${data.dailyData && data.dailyData.length > 0 ? `
    <h2>Daily Performance</h2>
    <table><thead><tr><th>Date</th><th>Spend</th><th>Impressions</th><th>Clicks</th><th>Conversions</th><th>CTR</th></tr></thead>
    <tbody>${dailyRows}</tbody></table>
    ` : ''}

    <div class="footer">Spotify Ad Curator &mdash; Analytics Report &mdash; ${new Date().toISOString()}</div>
  </body></html>`;

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(html);
    doc.close();
    setTimeout(() => {
      iframe.contentWindow?.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    }, 500);
  }
}
