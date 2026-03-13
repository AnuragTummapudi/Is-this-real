export function downloadReport(result, source) {
  if (!result) {
    return;
  }

  const lines = [
    'IS THIS REAL? — DEEPFAKE IDENTITY GUARD',
    'Forensic Evidence Report',
    '================================',
    '',
    `Report ID  : ITR-${Date.now()}`,
    `Generated  : ${new Date().toISOString()}`,
    `Type       : ${(result.type || '').toUpperCase()}`,
    `Source     : ${source || 'Uploaded file'}`,
    '',
    `VERDICT    : ${result.verdict}`,
    `Risk Level : ${result.risk_level}`,
    `Risk Score : ${result.combined_risk_percent}%`,
    '',
    '--- Evidence Flags ---',
    ...(result.evidence_flags || []).map((flag, idx) => `${idx + 1}. ${flag}`),
    '',
    '--- Recommended Actions ---',
    ...(result.next_steps || []).map((step, idx) => `${idx + 1}. ${step}`),
    '',
    '================================',
    'Report to: cybercrime.gov.in',
    'NCW Helpline: 7827170170',
    'Built for Code4Her — Women\'s Day 2025',
  ];

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `is-this-real-report-${Date.now()}.txt`;
  link.click();
}
