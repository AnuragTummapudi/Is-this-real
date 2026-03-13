import { ANALYSIS_STEPS } from '../../utils/constants';

export default function AnalyzingScreen({ isActive, currentStep }) {
  return (
    <div id="screen-analyzing" className={`screen ${isActive ? 'active' : ''}`}>
      <div className="analyzing-wrap">
        <div className="res-label" style={{ justifyContent: 'center', marginBottom: 20 }}>
          Processing
        </div>
        <h2>
          Analyzing <em>your media</em>
        </h2>
        <p className="analyzing-sub">Four forensic signals · typically 10 to 30 seconds</p>

        <div className="scan-ring-wrap">
          <div className="scan-ring" />
          <div className="scan-ring spin" />
          <div className="scan-ring spin-rev" />
          <div className="scan-center">
            <div className="scan-dot" />
          </div>
        </div>

        <ul className="astep-list" id="astep-list">
          {ANALYSIS_STEPS.map((step, index) => {
            const stateClass = index < currentStep ? 'done' : index === currentStep ? 'active' : '';
            return (
              <li className={`astep ${stateClass}`} key={step.title}>
                <div className="astep-dot" />
                <div>
                  <div className="astep-text">{step.title}</div>
                  <div className="astep-sub">{step.sub}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
