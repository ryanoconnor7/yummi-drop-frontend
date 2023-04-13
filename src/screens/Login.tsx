import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../App'
import { useNavigate } from 'react-router-dom'
import { FBUser, User } from '../types/Types'
import { BACKEND_URL } from '../utils/Constants'
import { authenticatedHeaders } from '../utils/AuthUtils'

const Login = () => {
    return <div>Login</div>
}

export default Login

const provider = new GoogleAuthProvider()

export async function login() {
    const result = await signInWithPopup(auth, provider)
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result)

    if (!credential) throw 'No user'

    const user = result.user
    return user
}

export async function getCurrentUser(fbUser: FBUser): Promise<User | undefined> {
    const url = `${BACKEND_URL}/users`
    let res = await fetch(url, {
        method: 'GET',
        headers: await authenticatedHeaders(fbUser)
    })

    if (res.status === 404) {
        const url = `${BACKEND_URL}/users`
        const name = fbUser.displayName?.split(' ') ?? ['', '']
        const params = {
            firstName: name[0] ?? '',
            lastName: name[1] ?? '',
            profilePicUrl: fbUser.photoURL,
            chefDetails: ''
        }
        res = await fetch(url, {
            method: 'POST',
            headers: await authenticatedHeaders(fbUser),
            body: JSON.stringify(params)
        })
    }

    console.log('Current user res:', res)

    const json = await res.json()

    return json
}
