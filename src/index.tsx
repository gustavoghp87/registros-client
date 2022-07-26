import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { App } from './components/App'
import { store } from './store'
import * as serviceWorker from './serviceWorker'
import './css/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>
    , document.getElementById('root')
)

serviceWorker.unregister()
