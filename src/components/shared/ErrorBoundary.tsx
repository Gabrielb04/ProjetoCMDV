import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message?: string;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Erro inesperado na aplicação:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border bg-card p-6 text-center shadow-sm">
          <h1 className="mb-2 text-xl font-semibold">Algo deu errado</h1>
          <p className="mb-4 text-sm text-muted-foreground">
            O aplicativo encontrou um erro inesperado. Recarregue a página e tente novamente.
          </p>
          {this.state.message ? (
            <pre className="mb-4 max-h-32 overflow-auto rounded-lg bg-muted p-3 text-left text-xs text-muted-foreground">
              {this.state.message}
            </pre>
          ) : null}
          <button
            type="button"
            onClick={this.handleReload}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Recarregar aplicativo
          </button>
        </div>
      </div>
    );
  }
}
