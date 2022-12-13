import { Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout.js'
import TopBarLayout from './pages/TopBarLayout.js'
import Public from './pages/Public.js'
import Login from './pages/Login.js'
import Signup from './pages/Signup.js'
import Dash from './pages/Dash.js'
import './css/App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />}/>
        <Route path="login" element={<Login />}/>
        <Route path="signup" element={<Signup />}/>
      </Route>
      <Route path="/user" element={<TopBarLayout />}>
        <Route index element={<Dash />}/>
      </Route>   
    </Routes>
    
  );
}

export default App;
