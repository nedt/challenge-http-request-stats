import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [url, setUrl] = useState();
  const [result, setResult] = useState();
  const urlInput = useRef(null);

  async function fetchStats(url) {
    setResult(null);
    if (!url) {
      return;
    }
    const response = await fetch(`http://localhost:4000/?url=${encodeURIComponent(url)}`);
    setResult(await response.json());
  }

  useEffect(_ => {
    fetchStats(url);
  }, [url]);

  function onSubmit(e) {
    e.preventDefault();
    setUrl(urlInput.current.value);
  }

  function asTree(something) {
    if (Array.isArray(something)) {
      return <ol>{something.map(value => <li>{value}</li>)}</ol>;
    }

    if (something instanceof Object) {
      return <dl>{Object.keys(something).map(key => (
        <React.Fragment>
          <dt>{key}</dt>
          <dd>{asTree(something[key])}</dd>
        </React.Fragment>
      ))}</dl>;
    }

    return something;
  }

  return (
    <div>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/foundation-sites@6.4.3/dist/css/foundation.min.css"></link>
      <style>{`dd { padding-left: 1rem }`}</style>
      <div className="grid-container">
        <div clasclassNames="grid-x grid-padding-x">
          <form onSubmit={onSubmit}>
            <div className="input-group">
              <span className="input-group-label">URL</span>
              <input ref={urlInput} className="input-group-field" type="text" name="url" />
              <div className="input-group-button">
                <input type="submit" className="button" value="Submit" />
              </div>
            </div>
          </form>
        </div>
        <div className="grid-x grid-padding-x">
          <div>{asTree(result)}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
