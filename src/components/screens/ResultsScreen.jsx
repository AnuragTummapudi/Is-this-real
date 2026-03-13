import { STEP_TITLES } from '../../utils/constants';

const PILL_TEXTS = {
  HIGH: 'High risk detected',
  MEDIUM: 'Medium risk',
  LOW: 'Low risk',
};

const MAIN_TEXTS = {
  FAKE: 'Deepfake detected',
  SUSPICIOUS: 'Suspicious content',
  REAL: 'Content appears authentic',
  MISLEADING: 'AI-generated content',
};

const DESC_TEXTS = {
  FAKE: 'Strong indicators of synthetic generation were found across multiple signals.',
  SUSPICIOUS: 'Some indicators of manipulation detected. Proceed with caution.',
  REAL: 'No significant manipulation signals detected in this content.',
  MISLEADING: 'AI-generated text or synthetic imagery detected in this article.',
};

function buildMetrics(result, type) {
  const cells = [];

  if (type === 'image' || type === 'video') {
    cells.push({
      label: 'AI model score',
      val: `${result.ai_fake_probability || 0}%`,
      sub: 'EfficientNet-B4',
    });
    cells.push({
      label: 'ELA score',
      val: Number(result.ela_score || 0).toFixed(1),
      sub: 'Threshold: 10.0',
    });
  }

  if (type === 'image') {
    const metadata = result.metadata || {};
    const face = result.face_analysis || {};

    cells.push({
      label: 'Metadata',
      val: metadata.has_exif ? 'Present' : 'Missing',
      sub: `${(metadata.flags || []).length} anomalies found`,
    });

    cells.push({
      label: 'Faces',
      val: `${face.faces_found || 0}`,
      sub: face.suspicious ? 'Anomalies detected' : 'No anomalies',
    });
  }

  if (type === 'video') {
    cells.push({
      label: 'Frames checked',
      val: `${result.total_frames_analyzed || 0}`,
      sub: `${result.fake_frames || 0} flagged`,
    });
    cells.push({
      label: 'Score variance',
      val: Number(result.score_variance || 0).toFixed(3),
      sub: 'High = face-swap artifact',
    });
    cells.push({
      label: 'Duration',
      val: `${result.duration_sec || 0}s`,
      sub: 'Video length',
    });
  }

  if (type === 'article') {
    const text = result.text_analysis || {};
    const articleMeta = result.article_meta || {};

    cells.push({
      label: 'AI text score',
      val: `${text.ai_probability || 0}%`,
      sub: 'RoBERTa classifier',
    });
    cells.push({
      label: 'Images checked',
      val: `${result.images_analyzed || 0}`,
      sub: `${result.fake_images_found || 0} flagged`,
    });
    cells.push({
      label: 'Published',
      val: (articleMeta.publish_date || 'Unknown').slice(0, 10),
      sub: (articleMeta.authors || []).join(', ') || 'Author unknown',
    });
    cells.push({
      label: 'Sections',
      val: `${text.chunks_analyzed || 0}`,
      sub: 'Text chunks analyzed',
    });
  }

  return cells;
}

function timelineClass(score) {
  if (score > 65) {
    return 'h';
  }
  if (score > 35) {
    return 'm';
  }
  return 'l';
}

export default function ResultsScreen({
  isActive,
  result,
  sourcePreview,
  elaOn,
  onToggleEla,
  onDownloadReport,
  onAnalyzeAnother,
}) {
  const level = result?.risk_level || 'LOW';
  const verdict = result?.verdict || 'REAL';
  const pct = result?.combined_risk_percent || 0;
  const type = result?.type || 'image';
  const metrics = result ? buildMetrics(result, type) : [];
  const showHeatmap = type === 'image' && !!result?.ela_image_b64;
  const showTimeline = type === 'video' && !!result?.frame_timeline?.length;
  const flags = result?.evidence_flags || [];
  const steps = result?.next_steps || [];

  return (
    <div id="screen-results" className={`screen ${isActive ? 'active' : ''}`}>
      <div className="results-wrap">
        <div className={`verdict-banner ${level} reveal in`} id="verdict-banner">
          <div className="verdict-left">
            <div className="verdict-pill">
              <div className="verdict-pill-dot" />
              <span id="v-pill-text">{PILL_TEXTS[level] || level}</span>
            </div>
            <div className="verdict-main" id="v-main">
              {MAIN_TEXTS[verdict] || verdict}
            </div>
            <div className="verdict-desc" id="v-desc">
              {DESC_TEXTS[verdict] || ''}
            </div>
          </div>
          <div className="verdict-score-block">
            <div className="vscore" id="v-score">
              {pct}%
            </div>
            <div className="vscore-unit">Risk score</div>
          </div>
        </div>

        <div className="metrics-grid reveal" id="metrics-grid">
          {metrics.map((cell) => (
            <div className="metric-cell" key={`${cell.label}-${cell.val}`}>
              <div className="mc-label">{cell.label}</div>
              <div className="mc-val">{cell.val}</div>
              <div className="mc-sub">{cell.sub}</div>
            </div>
          ))}
        </div>

        {showHeatmap && (
          <div className="heatmap-block reveal" id="heatmap-block">
            <div className="res-label">Manipulation heatmap</div>
            <div className="heatmap-img-wrap">
              <img className="src-img" id="src-img" src={sourcePreview || ''} alt="Source" />
              <img
                className="ela-img"
                id="ela-img"
                src={`data:image/png;base64,${result.ela_image_b64}`}
                alt="ELA overlay"
                style={{ opacity: elaOn ? 0.55 : 0 }}
              />
            </div>
            <div className="ela-toggle-row hover-target" onClick={onToggleEla}>
              <div className={`tog-track ${elaOn ? 'on' : ''}`} id="ela-tog">
                <div className="tog-thumb" />
              </div>
              <span className="tog-label">ELA overlay</span>
            </div>
          </div>
        )}

        {showTimeline && (
          <div className="timeline-block reveal" id="timeline-block">
            <div className="res-label">Frame-by-frame timeline</div>
            <div className="tl-bars" id="tl-bars">
              {result.frame_timeline.map((frame, idx) => {
                const height = Math.max((frame.fake_score / 100) * 100, 4);
                return (
                  <div
                    className={`tl-bar ${timelineClass(frame.fake_score)} hover-target`}
                    key={`${frame.timestamp_sec}-${idx}`}
                    style={{ height: `${height}%` }}
                    title={`${frame.timestamp_sec}s — ${frame.fake_score}%`}
                  />
                );
              })}
            </div>
            <div className="tl-caption">
              Each bar = one analyzed frame. Height = fake probability. Hover for timestamp.
            </div>
          </div>
        )}

        {!!flags.length && (
          <div className="flags-block reveal" id="flags-block">
            <div className="res-label">Evidence flags</div>
            <div id="flags-list">
              {flags.map((flag, index) => (
                <div className="flag-item" key={`${flag}-${index}`}>
                  <span className="fi-num">{String(index + 1).padStart(2, '0')}</span>
                  <span className="fi-txt">{flag}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!!steps.length && (
          <div className="steps-block reveal" id="steps-block">
            <div className="res-label">Recommended actions</div>
            <div id="steps-list">
              {steps.map((step, index) => (
                <div className="nstep" key={`${step}-${index}`}>
                  <div className="ns-n">{String(index + 1).padStart(2, '0')}</div>
                  <div className="ns-body">
                    <div className="ns-title">{STEP_TITLES[index] || 'Action'}</div>
                    <div className="ns-desc">{step}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="result-actions reveal">
          <button className="btn-rose" onClick={onDownloadReport}>
            <span>Download Report</span>
          </button>
          <button className="btn-outline" onClick={onAnalyzeAnother}>
            Analyze Another
          </button>
          {(level === 'HIGH' || level === 'MEDIUM') && (
            <button
              className="btn-report"
              id="btn-report"
              onClick={() => window.open('https://cybercrime.gov.in', '_blank', 'noopener,noreferrer')}
            >
              Report to Cybercrime
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
