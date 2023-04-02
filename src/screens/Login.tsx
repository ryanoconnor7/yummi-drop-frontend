import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../App'
import { useNavigate } from 'react-router-dom'

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
