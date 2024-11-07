import { Route, Routes } from 'react-router-dom'
import LoginPage from './assets/pages/auth/logIn/LoginPage'
import SignupPage from './assets/pages/auth/signup/SignupPage'
import HomePage from './assets/pages/home/HomePage'
import Sidebar from './components/common/Sidebar'
import NotificationPage from './assets/pages/notification/NotificationPage'
import ProfilePage from './assets/pages/profile/ProfilePage'

function App() {

  return (
    <div className='flex max-w6xl mx-auto'>
    <Sidebar />
      <Routes>
        <Route path='/' element={<HomePage />}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/signup' element={<SignupPage />}/>
        <Route path='/notifications' element={<NotificationPage />}/>
        <Route path='/profile/:username' element={<ProfilePage />}/>
      </Routes>
    </div>
  )
}

export default App
