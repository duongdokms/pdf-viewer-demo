import React from 'react';
import './App.css';
import PDFViewer from './components/PDFViewer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Apryse PDF Viewer Demo</h1>
        <p className="subtitle">SPECOPS-1445: PDF Viewer Controls Investigation</p>
      </header>
      <main className="App-main">
        <PDFViewer />
      </main>
    </div>
  );
}

export default App;
