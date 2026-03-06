import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [user, setUser] = useState(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('lux_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email || !password || (!isLogin && !name)) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            setLoading(true);
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    isLogin
                        ? { email, password }
                        : { name, email, password }
                ),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || 'Something went wrong. Please try again.');
            }

            if (data?.token) {
                localStorage.setItem('lux_user', JSON.stringify({
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    isAdmin: data.isAdmin,
                    role: data.role,
                    token: data.token,
                }));
            }

            setSuccess(isLogin ? 'Signed in successfully.' : 'Account created successfully.');

            // Small delay so the user can see the success message
            setTimeout(() => {
                if (data.isAdmin) {
                    navigate('/admin');
                } else {
                    navigate(from);
                }
            }, 600);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }; // <-- Added missing closing brace and semicolon for handleSubmit

    const handleLogout = () => {
        localStorage.removeItem('lux_user');
        setUser(null);
        navigate('/');
    };

    if (user) {
        return (
            <div className="w-full min-h-[60vh] flex flex-col items-center justify-center pt-10 mb-20 text-[var(--text-primary)]">
                <div className="w-full max-w-md glass border border-[var(--surface-border)] p-8 shadow-premium text-center rounded-2xl">
                    <div className="w-20 h-20 bg-[var(--surface-color)] border border-[var(--surface-border)] rounded-full mx-auto flex items-center justify-center text-3xl font-serif text-[var(--text-primary)] mb-6 uppercase">
                        {user.name.charAt(0)}
                    </div>
                    <h1 className="text-2xl font-serif font-bold tracking-wider mb-2 uppercase text-[var(--text-primary)]">
                        {user.name}
                    </h1>
                    <p className="text-sm opacity-80 font-light mb-4">{user.email}</p>
                    <div className="mb-8">
                        {user.isAdmin ? (
                            <span className="bg-accent text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-sm">Admin Account</span>
                        ) : (
                            <span className="bg-[var(--surface-color)] border border-[var(--surface-border)] text-[var(--text-primary)] text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-sm">Customer Account</span>
                        )}
                    </div>

                    <div className="space-y-4">
                        {user.isAdmin && (
                            <button onClick={() => navigate('/admin')} className="w-full border border-[var(--surface-border)] py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:border-accent transition-colors text-[var(--text-primary)] rounded-md">
                                Admin Dashboard
                            </button>
                        )}
                        <button onClick={() => navigate('/orders')} className="w-full border border-[var(--surface-border)] py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:border-accent transition-colors text-[var(--text-primary)] rounded-md">
                            Order History
                        </button>
                        <button onClick={handleLogout} className="w-full btn-cta py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-colors rounded-md">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-[70vh] flex items-center justify-center pt-10 mb-20">
            <div className="w-full max-w-md glass border border-[var(--surface-border)] p-8 shadow-premium rounded-2xl text-[var(--text-primary)] mt-12">

                {/* Toggle Headings */}
                <div className="flex justify-center gap-8 mb-8 border-b border-[var(--surface-border)] pb-4">
                    <button
                        className={`text-sm font-bold tracking-widest uppercase transition-colors ${isLogin ? 'text-accent border-b-2 border-accent pb-1' : 'opacity-60 hover:opacity-100'}`}
                        onClick={() => {
                            setIsLogin(true);
                            setError('');
                            setSuccess('');
                        }}
                    >
                        Sign In
                    </button>
                    <button
                        className={`text-sm font-bold tracking-widest uppercase transition-colors ${!isLogin ? 'text-accent border-b-2 border-accent pb-1' : 'opacity-60 hover:opacity-100'}`}
                        onClick={() => {
                            setIsLogin(false);
                            setError('');
                            setSuccess('');
                        }}
                    >
                        Register
                    </button>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-serif font-bold tracking-wider mb-2">
                        {isLogin ? 'WELCOME BACK' : 'CREATE AN ACCOUNT'}
                    </h1>
                    <p className="text-sm opacity-80 font-light">
                        {isLogin
                            ? 'Sign in to access your orders and wishlist.'
                            : 'Join to receive exclusive updates and manage orders.'}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 text-sm text-[var(--color-secondary-accent)] bg-[var(--color-secondary-accent)]/10 border border-[var(--color-secondary-accent)] px-4 py-3 rounded-md">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 text-sm text-[var(--color-success)] bg-[var(--color-success)]/10 border border-[var(--color-success)] px-4 py-3 rounded-md">
                        {success}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest text-[var(--text-primary)] uppercase mb-3 opacity-80" htmlFor="name">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="w-full border border-[var(--surface-border)] px-4 py-4 text-sm outline-none focus:border-accent bg-transparent transition-colors rounded-xl"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-bold tracking-widest text-[var(--text-primary)] uppercase mb-3 opacity-80" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full border border-[var(--surface-border)] px-4 py-4 text-sm outline-none focus:border-accent bg-transparent transition-colors rounded-xl"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-[10px] font-bold tracking-widest text-[var(--text-primary)] uppercase opacity-80" htmlFor="password">
                                Password
                            </label>
                            {isLogin && (
                                <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">
                                    demo: admin@example.com / 123456
                                </span>
                            )}
                        </div>
                        <input
                            type="password"
                            id="password"
                            className="w-full border border-[var(--surface-border)] px-4 py-4 text-sm outline-none focus:border-accent bg-transparent transition-colors rounded-xl"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full btn-primary py-4 mt-6 text-[11px] font-bold tracking-[0.2em] uppercase transition-colors rounded-xl ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'PLEASE WAIT...' : isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Auth;
