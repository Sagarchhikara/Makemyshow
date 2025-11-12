import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import '../css/signin.css';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        setError('');
        // Simulate successful registration
        console.log('Simulating registration for:', email);
        navigate('/signin'); // Redirect to signin page
    };

    return (
        <div className="signin-container">
            <div className="signin-box">
                <h2 className="signin-title">Sign Up</h2>
                <p className="signin-subtitle">Create your MovieWave account</p>
                <form className="signin-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm-password"
                            name="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                </form>
                <p className="signin-footer">
                    Already have an account? <Link to="/signin">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
