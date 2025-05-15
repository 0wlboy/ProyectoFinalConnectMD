import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { SignIn } from './pages/pages.jsx'

createRoot(document.getElementById('root')).render(
  <Router>
    <Switch>
      <Route path="/" exact component={SignIn} />
    </Switch>
  </Router>
)
