import React, { useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import Home from './screens/Home'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { BrowserRouter as Router } from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'
import Login, { login } from './screens/Login'
import { initializeApp } from 'firebase/app'
import { User as FBUser, getAuth, onAuthStateChanged } from 'firebase/auth'
import Profile from './screens/Profile'
import { User, getCurrentUser } from './types/Types'
import NewMeal from './screens/NewMeal'
import MealDetail from './screens/MealDetail'

const firebaseConfig = {
    apiKey: 'AIzaSyDZEQzH53xpKIw6Cnj0O4DazC_sFT7e560',
    authDomain: 'yummidrop.firebaseapp.com',
    projectId: 'yummidrop',
    storageBucket: 'yummidrop.appspot.com',
    messagingSenderId: '349495558857',
    appId: '1:349495558857:web:defb62daf0a9fb5f45c318',
    measurementId: 'G-FQC4WB1F0Z'
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

function App() {
    const [user, setUser] = useState<User | undefined>(undefined)
    const [fbUser, setFbUser] = useState<FBUser | null>(null)
    const [userLoading, setUserLoading] = useState(true)
    const fetchUser = async (fbUser: FBUser) => {
        const user = await getCurrentUser(fbUser)
        setUser(user)
        setUserLoading(false)
    }

    useEffect(() => {
        onAuthStateChanged(auth, newFbUser => {
            setFbUser(newFbUser)
            if (newFbUser) fetchUser(newFbUser)
        })
    }, [])
    return (
        <Router>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<Home user={user} />}>
                            <Route
                                path="/profile"
                                element={<Profile user={user} fbUser={auth.currentUser} />}
                            />
                            <Route
                                path="/meal/new"
                                element={<NewMeal user={user} fbUser={auth.currentUser} />}
                            />
                            <Route
                                path="/meal/:id"
                                element={<MealDetail user={user} fbUser={auth.currentUser} />}
                            />
                        </Route>
                    </Routes>
                </div>
            </LocalizationProvider>
        </Router>
    )
}

export default App
