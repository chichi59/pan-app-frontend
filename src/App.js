import RequireAuth from './components/RequireAuth.js'
import { Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout.js'
import TopBarLayout from './pages/TopBarLayout.js'
import Public from './pages/Public.js'
import Login from './pages/Login.js'
import Signup from './pages/Signup.js'
import Dash from './pages/Dash.js'
import AddRecipe from './pages/AddRecipe.js'
import './css/App.css'
import EditRecipe from './pages/EditRecipe.js'
import Recipe from './pages/Recipe'
import Favorites from './pages/Favorites'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Home from './pages/Home'
import Explore from './pages/Explore'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />}/>
        <Route path="login" element={<Login />}/>
        <Route path="signup" element={<Signup />}/>
        
      </Route>

      <Route element={<RequireAuth />}> 
        <Route path="dash" element={<TopBarLayout />}>
          <Route index element={<Dash />}/>
          <Route path="addrecipe" element={<AddRecipe/>}/>
          <Route path="editrecipe/:id" element={<EditRecipe/>}/>
          <Route path="recipe/:id" element={<Recipe/>}/>
        </Route> 

        <Route path="profile" element={<TopBarLayout/>}>
          <Route index element={<Profile/>}/>
          <Route path="settings" element={<Settings/>}/>
        </Route>

        <Route path="favorites" element={<TopBarLayout/>}>
          <Route index element={<Favorites />}/>
        </Route>

        <Route path="home" element={<TopBarLayout/>}>
          <Route index element={<Home/>}/>
        </Route>

        <Route path="explore" element={<TopBarLayout/>}>
          <Route index element={<Explore/>}/>
        </Route>

      </Route>  
    </Routes>
    
  );
}

export default App;
