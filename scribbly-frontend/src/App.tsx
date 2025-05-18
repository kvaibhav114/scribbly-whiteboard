import { useKeycloak } from '@react-keycloak/web'
import Dashboard from './pages/Dashboard'
import Landing from './pages/Landing'

const App = () => {
  const { keycloak, initialized } = useKeycloak()

  if (!initialized) return <div>Loading...</div>

  return (
    <div>
      {keycloak?.authenticated ? <Dashboard /> : <Landing />}
    </div>
  )
}

export default App
