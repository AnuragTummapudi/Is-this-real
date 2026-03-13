export default function NavBar({ onAnalyzeClick }) {
  return (
    <nav>
      <div className="nav-wrap">
        <a className="nav-logo" href="#">
          <div className="nav-logo-mark" />
          Is this Real?
        </a>
        <div className="nav-center">
          <a className="nav-link" href="#how-section">
            Method
          </a>
          <a
            className="nav-link"
            href="#"
            onClick={(event) => {
              event.preventDefault();
              onAnalyzeClick();
            }}
          >
            Analyze
          </a>
        </div>
        <div className="nav-badge">Code4Her 2025</div>
      </div>
    </nav>
  );
}
