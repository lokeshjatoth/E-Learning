/* eslint-disable react/prop-types */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { appStore } from './app/store';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './components/ThemeProvider';
import { useLoadUserQuery } from './features/api/authApi';
import LoadingSpinner from './components/LoadingSpinner';


// eslint-disable-next-line react-refresh/only-export-components
const Custom = ({children})=>{
  const {isLoading} = useLoadUserQuery();
  return <>
    {isLoading? <LoadingSpinner/> : <>{children}</>}
  </>
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={appStore}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Custom>
          <App />
          <Toaster/>
        </Custom>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
