import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { App } from './components/App'
import { store } from './store'
import { recaptchaPublicKey } from './config'
import * as serviceWorker from './serviceWorker'
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/index.css'

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <GoogleReCaptchaProvider reCaptchaKey={recaptchaPublicKey}>
                <App />
            </GoogleReCaptchaProvider>
        </Provider>
    </BrowserRouter>
    , document.getElementById('root')
)

serviceWorker.unregister()
