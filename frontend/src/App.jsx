import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './assets/pages/auth/logIn/LoginPage'
import SignupPage from './assets/pages/auth/signup/SignupPage'
import HomePage from './assets/pages/home/HomePage'
import Sidebar from './components/common/Sidebar'
import NotificationPage from './assets/pages/notification/NotificationPage'
import ProfilePage from './assets/pages/profile/ProfilePage'
import RightPanel from './components/common/RightPannel'
import {Toaster} from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { baseUrl } from './constant/url'
import LoadingSpinner from './components/common/LoadingSpinner'
function App() {

    const {data:authUser,isLoading}=useQuery({
      queryKey: ["authUser"],
      queryFn: async () => {
        try {
          const res = await fetch(`${baseUrl}/api/auth/getMe`,{
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            }
          })
          const data = await res.json()
          if (data.error) {
          
            return null
          }
          if (!res.ok) {
            throw new Error(data.error || "something went wrong");
            
          }
          console.log("authUser:", authUser);
          
          return data;
        } catch (error) {
          throw error
        }
      },
      retry:false
    })

    if(isLoading) return <div className=' flex justify-center items-center h-screen'><LoadingSpinner size='lg' /></div>
  return (
    <div className='flex max-w6xl mx-auto'>
    {authUser && <Sidebar />}
      <Routes>
        <Route path='/' element={authUser ? <HomePage />: <Navigate to="/login"/>}/>
        <Route path='/login' element={!authUser ?<LoginPage/>:<Navigate to="/"/>}/>
        <Route path='/signup' element={!authUser ?<SignupPage />:<Navigate to="/"/>}/>
        <Route path='/notifications' element={authUser ?<NotificationPage />:<Navigate to='/login'/>}/>
        <Route path='/profile/:username' element={authUser ?<ProfilePage />:<Navigate to='/login'/>}/>
      </Routes>
      {authUser && <RightPanel />}
      
      <Toaster />
    </div>
  )
}

export default App
