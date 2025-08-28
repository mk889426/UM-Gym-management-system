// src/pages/LoginPage.tsx
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { login } from '../features/auth/authSlice';
import { Button } from '../components/ui/button';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [pass, setPass] = useState('');
    const dispatch = useAppDispatch();
    const status = useAppSelector((s) => s.auth.status);
    const navigate = useNavigate();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(login({ username, password: pass }))
        .unwrap().then(()=>{
            navigate("/");
        })
        .catch((error)=>{
            console.log("error : ",error)
            throw(error);
        })

    };

    return (
        <div className="min-h-screen flex items-center text-center justify-center bg-bg px-4">
            <form
                onSubmit={onSubmit}
                className="max-w-md w-full bg-white p-8 rounded shadow"
            >
                <h2 className="text-2xl font-bold text-primary mb-6">Sign In</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full mb-4 p-2 border rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    className="w-full mb-6 p-2 border rounded"
                    required
                />
                <Button type="submit" disabled={status === 'loading'}>
                    {status === 'loading' ? <Loader /> : 'Login'}
                </Button>
                <div>or</div>
                <Button onClick={()=> navigate("/register")}>register</Button>
            </form>

        </div>
    );
}