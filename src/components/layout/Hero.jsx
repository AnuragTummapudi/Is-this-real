export default function Hero({ onStartAnalysis, onHowItWorks }) {
  return (
    <section className="hero reveal">
      <div className="hero-left">
        <div className="hero-tag">
          <span className="hero-tag-line" />
          AI Forensics · Women's Safety
        </div>
        <h1>
          Is this <em>real?</em>
        </h1>
        <p className="hero-desc">
          A focused deepfake forensics experience for images, videos, and articles.
          Upload media or paste a URL to get an evidence-backed risk verdict.
        </p>
        <div className="cta-row">
          <button className="btn-rose" onClick={onStartAnalysis}>
            <span>Start Analysis</span>
          </button>
          <button className="btn-ghost" onClick={onHowItWorks}>
            How it works
          </button>
        </div>
      </div>
      <div className="hero-right">
        <div className="stat-card reveal">
          <div className="stat-n">4x</div>
          <div className="stat-label">Detection signals</div>
        </div>
        <div className="stat-card reveal">
          <div className="stat-n">3</div>
          <div className="stat-label">Media types</div>
        </div>
        <div className="stat-card reveal">
          <div className="stat-n">&lt;30s</div>
          <div className="stat-label">Analysis time</div>
        </div>
      </div>
    </section>
  );
}
