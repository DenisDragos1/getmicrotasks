import {BrowserRouter, Routes, Route} from 'react-router-dom'

import UsersPage from './pages/UsersPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CreateMicrotasksPage from './pages/CreateMicrotasksPage'
import MicrotasksPage from './pages/MicrotasksPage'
import MyMicrotasksPage from './pages/MyMicrotasksPage'
import ViewMicrotaskPage from './pages/ViewMicrotaskPage'
import SubmisionPage from './pages/SubmisionPage'
import MySubmisionPage from './pages/MySubmisionPage'
import ViewSubmissionsPage from './pages/ViewSubmissionsPage'
import RespingereSubmisionPage from './pages/RespingereSubmisionPage'

function App() {

  return (
    
    <BrowserRouter>
    <Routes>
      
    <Route path='/' element={<HomePage />}></Route>
    <Route path='/users' element={<UsersPage />}></Route>
    <Route path='/login' element={<LoginPage />}></Route>
    <Route path='/register' element={<RegisterPage />}></Route>
    <Route path='/createmicrotasks' element={<CreateMicrotasksPage />}></Route>   
    <Route path='/microtasks' element={<MicrotasksPage />}></Route>   
    <Route path='/mymicrotasks' element={<MyMicrotasksPage />}></Route>  
    <Route path="/microtasks/:id" element={<ViewMicrotaskPage />} />
    <Route path="/submisions/:id" element={<SubmisionPage />} />
    <Route path="/mysubmissions" element={<MySubmisionPage />} />
    <Route path="/viewsubmissions/:microtaskId" element={<ViewSubmissionsPage/>} />
    <Route path="/respinge/:submissionId" element={<RespingereSubmisionPage/>} />

     </Routes>
    </BrowserRouter>
  )
}

export default App