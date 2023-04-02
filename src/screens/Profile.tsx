import { useEffect, useState } from 'react'
import { User, getCurrentUser } from '../types/Types'
import { User as FBUser, getAuth, onAuthStateChanged } from 'firebase/auth'
import { login } from './Login'

const Profile = (props: { user?: User }) => {
    return <div>User: {props.user?.firstName}</div>
}

export default Profile
