import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { App } from './components/App'
import { store } from './store/store'
import { AuthProvider } from './context/authContext'
import * as serviceWorker from './serviceWorker'
import './css/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </Provider>
    </BrowserRouter>
    , document.getElementById('root')
)

serviceWorker.unregister()
