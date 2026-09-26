import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Quantum World render error', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main className="fatal-error" role="alert">
        <div className="fatal-error-card">
          <div className="eyebrow">QUILSBEE · RECOVERY</div>
          <h1>Something collapsed.</h1>
          <p>The learning environment hit an unexpected error. Your browser session is still safe.</p>
          <button className="primary" onClick={() => window.location.reload()}>
            Reload the learning world
          </button>
        </div>
      </main>
    )
  }
}
