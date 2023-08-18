import './css/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { App } from './components/App'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { Provider } from 'react-redux'
import { recaptchaPublicKey } from './config'
import { store } from './store'
import * as serviceWorker from './serviceWorker'

const container = document.getElementById('root') as Element
createRoot(container).render(
    <BrowserRouter>
        <Provider store={store}>
            <GoogleReCaptchaProvider reCaptchaKey={recaptchaPublicKey}>
                <App />
            </GoogleReCaptchaProvider>
        </Provider>
    </BrowserRouter>
)

serviceWorker.unregister()
