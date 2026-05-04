import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '../../index.css'

// Configurar idioma antes de renderizar a aplicação
document.documentElement.lang = 'pt-BR';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)