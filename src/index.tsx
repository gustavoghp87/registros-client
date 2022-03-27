import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { App } from './components/_App'
import { BrowserRouter } from 'react-router-dom'
import * as serviceWorker from './serviceWorker'
import { store } from './store/store'
import './components/css/index.css'

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>
    , document.getElementById('root')
)

serviceWorker.unregister()
