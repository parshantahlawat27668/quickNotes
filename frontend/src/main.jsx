import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {GoogleOAuthProvider} from "@react-oauth/google"
import store from './store/index.js'
import {Provider} from "react-redux"

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={store}>  
    <App />
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
  </BrowserRouter>
)
