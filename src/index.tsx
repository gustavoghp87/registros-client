import ReactDOM from 'react-dom'
import { App } from './components/_App'
import { BrowserRouter } from 'react-router-dom'
import * as serviceWorker from './serviceWorker'
import './components/css/index.css'

ReactDOM.render(

    <BrowserRouter>
        <App />
    </BrowserRouter>

    , document.getElementById('root')
)

serviceWorker.unregister()
