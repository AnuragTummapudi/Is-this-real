export const STEP_DELAYS_MS = [0, 2200, 5000, 9000, 13000];

export const ANALYSIS_STEPS = [
  {
    title: 'Preprocessing content',
    sub: 'Extracting frames, normalizing input',
  },
  {
    title: 'Running AI classification model',
    sub: 'EfficientNet-B4 deepfake detection',
  },
  {
    title: 'Performing ELA forensic analysis',
    sub: 'Detecting compression artifacts and splicing',
  },
  {
    title: 'Auditing metadata signals',
    sub: 'EXIF inspection, face consistency checks',
  },
  {
    title: 'Generating forensic report',
    sub: 'Combining signals into final risk score',
  },
];

export const HOW_IT_WORKS = [
  {
    title: 'AI Classification',
    desc: 'EfficientNet-B4 trained on synthetic and real face datasets. Scores each frame for deepfake fingerprints.',
  },
  {
    title: 'ELA Forensics',
    desc: 'Error Level Analysis detects inconsistent JPEG compression patterns caused by pixel-level tampering.',
  },
  {
    title: 'Metadata Audit',
    desc: 'EXIF checks surface missing camera traces, odd dimensions, and encoding patterns often seen in AI outputs.',
  },
  {
    title: 'Text Analysis',
    desc: 'RoBERTa-based checks flag AI-written prose in articles while embedded media gets scanned independently.',
  },
];

export const STEP_TITLES = [
  'Preserve evidence',
  'Report to platform',
  'File a complaint',
  'Contact NCW',
  'Do not share',
  'Seek legal counsel',
];
