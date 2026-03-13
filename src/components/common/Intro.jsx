export default function Intro({ phase }) {
  if (phase === 'hidden') {
    return null;
  }

  return (
    <div id="intro" aria-hidden="true" className={phase === 'exit' ? 'exit gone' : ''}>
      <div className="intro-circle" />
      <div className="intro-circle" />
      <div className="intro-panel-left" />
      <div className="intro-panel-right" />
      <div className="intro-line" />
      <div className="intro-wordmark">
        Is this Real? <span>— Identity Guard</span>
      </div>
      <div className="intro-sub">Code4Her · Women's Day 2025</div>
    </div>
  );
}
