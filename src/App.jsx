import { useEffect, useMemo, useRef, useState } from 'react';
import Cursor from './components/common/Cursor';
import Intro from './components/common/Intro';
import SectionDivider from './components/common/SectionDivider';
import Footer from './components/layout/Footer';
import Hero from './components/layout/Hero';
import NavBar from './components/layout/NavBar';
import AnalyzingScreen from './components/screens/AnalyzingScreen';
import ResultsScreen from './components/screens/ResultsScreen';
import UploadScreen from './components/screens/UploadScreen';
import useCustomCursor from './hooks/useCustomCursor';
import useReveal from './hooks/useReveal';
import { analyzeFile, analyzeUrl, getApiBase } from './utils/api';
import { STEP_DELAYS_MS } from './utils/constants';
import { downloadReport } from './utils/report';

export default function App() {
  const [introPhase, setIntroPhase] = useState('show');
  const [mainVisible, setMainVisible] = useState(false);

  const [screen, setScreen] = useState('upload');
  const [activeTab, setActiveTab] = useState('file');
  const [selectedFile, setSelectedFile] = useState(null);
  const [urlValue, setUrlValue] = useState('');
  const [error, setError] = useState('');

  const [sourcePreview, setSourcePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [sourceUrl, setSourceUrl] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [elaOn, setElaOn] = useState(true);

  const fileInputRef = useRef(null);
  const analyzeAnchorRef = useRef(null);
  const stepTimeoutsRef = useRef([]);

  const { dotRef, ringRef, isSupported } = useCustomCursor(true);
  useReveal();

  useEffect(() => {
    const introExitTimer = setTimeout(() => {
      setIntroPhase('exit');
      setMainVisible(true);
    }, 2200);

    const introHideTimer = setTimeout(() => {
      setIntroPhase('hidden');
    }, 4200);

    return () => {
      clearTimeout(introExitTimer);
      clearTimeout(introHideTimer);
    };
  }, []);

  useEffect(
    () => () => {
      stepTimeoutsRef.current.forEach((timer) => clearTimeout(timer));
    },
    []
  );

  useEffect(() => {
    const selector = `#screen-${screen} .reveal:not(.in)`;
    const timer = setTimeout(() => {
      document.querySelectorAll(selector).forEach((node) => node.classList.add('in'));
    }, 100);

    return () => clearTimeout(timer);
  }, [screen]);

  const apiBase = useMemo(() => getApiBase(), []);

  function scrollToAnalyze() {
    analyzeAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  function showScreen(name) {
    setScreen(name);
    scrollToAnalyze();
  }

  function runSteps() {
    stepTimeoutsRef.current.forEach((timer) => clearTimeout(timer));
    stepTimeoutsRef.current = STEP_DELAYS_MS.map((delay, index) =>
      setTimeout(() => {
        setCurrentStep(index);
      }, delay)
    );
  }

  function switchTab(tabName) {
    setActiveTab(tabName);
    setError('');
  }

  function setFile(file) {
    setSelectedFile(file);
    setError('');

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => setSourcePreview(event.target?.result || null);
      reader.readAsDataURL(file);
    } else {
      setSourcePreview(null);
    }
  }

  function handleFileInput(event) {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  }

  function clearFile() {
    setSelectedFile(null);
    setSourcePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setFile(file);
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('dragover');
  }

  function handleDragLeave(event) {
    event.currentTarget.classList.remove('dragover');
  }

  async function doAnalyzeFile() {
    if (!selectedFile) {
      return;
    }

    setError('');
    setElaOn(true);
    showScreen('analyzing');
    runSteps();

    try {
      const response = await analyzeFile(selectedFile);
      setResult(response);
      setSourceUrl(null);
      showScreen('results');
    } catch (err) {
      showScreen('upload');
      setError(`Analysis failed: ${err.message}. Ensure backend is running at ${apiBase}.`);
    }
  }

  async function doAnalyzeUrl() {
    const trimmed = urlValue.trim();

    if (!trimmed) {
      setError('Please enter a URL.');
      return;
    }

    setError('');
    setSourceUrl(trimmed);
    setSourcePreview(trimmed);
    setElaOn(true);
    showScreen('analyzing');
    runSteps();

    try {
      const response = await analyzeUrl(trimmed);
      setResult(response);
      showScreen('results');
    } catch (err) {
      showScreen('upload');
      setError(`Analysis failed: ${err.message}`);
    }
  }

  function handleAnalyzeAnother() {
    showScreen('upload');
  }

  function handleDownload() {
    downloadReport(result, sourceUrl || 'Uploaded file');
  }

  return (
    <>
      <Cursor dotRef={dotRef} ringRef={ringRef} enabled={isSupported} />
      <Intro phase={introPhase} />

      <div id="main" className={mainVisible ? 'visible' : ''}>
        <NavBar onAnalyzeClick={() => showScreen('upload')} />

        <Hero
          onStartAnalysis={scrollToAnalyze}
          onHowItWorks={() => document.getElementById('how-section')?.scrollIntoView({ behavior: 'smooth' })}
        />

        <SectionDivider />

        <div id="analyze-anchor" ref={analyzeAnchorRef} style={{ height: 1 }} />

        <UploadScreen
          isActive={screen === 'upload'}
          activeTab={activeTab}
          onSwitchTab={switchTab}
          selectedFile={selectedFile}
          fileInputRef={fileInputRef}
          onFileInput={handleFileInput}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClearFile={clearFile}
          onAnalyzeFile={doAnalyzeFile}
          onAnalyzeUrl={doAnalyzeUrl}
          urlValue={urlValue}
          onUrlChange={setUrlValue}
          error={error}
        />

        <AnalyzingScreen isActive={screen === 'analyzing'} currentStep={currentStep} />

        <ResultsScreen
          isActive={screen === 'results'}
          result={result}
          sourcePreview={sourcePreview}
          elaOn={elaOn}
          onToggleEla={() => setElaOn((prev) => !prev)}
          onDownloadReport={handleDownload}
          onAnalyzeAnother={handleAnalyzeAnother}
        />

        <Footer />
      </div>
    </>
  );
}
