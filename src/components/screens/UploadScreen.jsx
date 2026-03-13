import { HOW_IT_WORKS } from '../../utils/constants';

export default function UploadScreen({
  isActive,
  activeTab,
  onSwitchTab,
  selectedFile,
  fileInputRef,
  onFileInput,
  onDrop,
  onDragOver,
  onDragLeave,
  onClearFile,
  onAnalyzeFile,
  onAnalyzeUrl,
  urlValue,
  onUrlChange,
  error,
}) {
  return (
    <div id="screen-upload" className={`screen ${isActive ? 'active' : ''}`}>
      <div className="upload-wrap reveal">
        <div className="upload-header">
          <div>
            <h2 className="upload-title">
              Submit media <em>for analysis</em>
            </h2>
          </div>
          <div className="upload-step-tag">Step 01 of 02</div>
        </div>

        <div className={`err-notice ${error ? 'show' : ''}`} id="err-box">
          {error}
        </div>

        <div className="tab-bar">
          <button
            className={`tab ${activeTab === 'file' ? 'active' : ''}`}
            onClick={() => onSwitchTab('file')}
          >
            Upload file
          </button>
          <button
            className={`tab ${activeTab === 'url' ? 'active' : ''}`}
            onClick={() => onSwitchTab('url')}
          >
            Paste URL
          </button>
        </div>

        <div id="tab-file" className={`tab-panel ${activeTab === 'file' ? 'active' : ''}`}>
          <div
            className="drop-zone hover-target"
            id="drop-zone"
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="drop-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div className="drop-title">Drop your file here</div>
            <p className="drop-sub">
              Drag and drop or click to browse.
              <br />
              Images, videos, any format.
            </p>
            <div className="format-chips">
              <span className="fmt-chip">JPG</span>
              <span className="fmt-chip">PNG</span>
              <span className="fmt-chip">WEBP</span>
              <span className="fmt-chip">MP4</span>
              <span className="fmt-chip">MOV</span>
              <span className="fmt-chip">AVI</span>
              <span className="fmt-chip">WEBM</span>
            </div>
          </div>

          <input
            type="file"
            id="file-input"
            ref={fileInputRef}
            accept="image/*,video/*"
            onChange={onFileInput}
          />

          <div className={`file-preview ${selectedFile ? 'show' : ''}`} id="file-preview">
            <div className="fp-name" id="fp-name">
              {selectedFile?.name || '—'}
            </div>
            <div className="fp-size" id="fp-size">
              {selectedFile ? `${(selectedFile.size / 1048576).toFixed(1)} MB` : '—'}
            </div>
            <button className="fp-remove" onClick={onClearFile}>
              &#x2715;
            </button>
          </div>

          <div className="action-bar">
            <button className="btn-rose" id="btn-analyze-file" onClick={onAnalyzeFile} disabled={!selectedFile}>
              <span>Run Analysis</span>
            </button>
          </div>
        </div>

        <div id="tab-url" className={`tab-panel ${activeTab === 'url' ? 'active' : ''}`}>
          <div className="url-row">
            <input
              className="url-inp"
              id="url-inp"
              type="url"
              value={urlValue}
              onChange={(event) => onUrlChange(event.target.value)}
              placeholder="https://example.com/image.jpg  or  news article URL"
            />
            <button className="url-go" onClick={onAnalyzeUrl}>
              Analyze
            </button>
          </div>
          <p className="url-hint">
            Accepts image URLs, video URLs, YouTube links, news articles, or any webpage. Auto-detects content type.
          </p>
        </div>
      </div>

      <div id="how-section" className="how-strip">
        <div className="how-inner">
          {HOW_IT_WORKS.map((item, index) => (
            <div className="how-card reveal" key={item.title}>
              <div className="how-num">{String(index + 1).padStart(2, '0')}</div>
              <div className="how-title">{item.title}</div>
              <p className="how-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
