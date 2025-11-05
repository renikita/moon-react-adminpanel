import { useRef, useState, useEffect } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import "./authentication.css";

const LOGIN_URL = 'http://localhost:8080/auth/login'; 
const FORGOT_PASSWORD_URL = 'http://localhost:8080/response/user';

const Authentication = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post(LOGIN_URL, 
                { login: user, password: pwd },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response.data);
            if (response.status === 200) {
                Cookies.set('session', response.data.sessionId); 
                window.location.href = '/admin/response-dashboard';
            }
        } catch (err) {
            if (!err.response) {
                setErrMsg('No Server Response');
            } else if (err.response.status === 401) {
                console.error("Error response:", err.response);
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    const handleForgotPassword = () => {
        setShowModal(true);
        document.body.classList.add('modal-open');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        document.body.classList.remove('modal-open');
    };

    const handleSubmitForgotPassword = async (e) => {
        e.preventDefault();
        const adminName = e.target.adminName.value + " " + e.target.adminLogin.value;
        const email = "adminpage@moon.dev.com";
        const number = 100;
        const messageRes = e.target.messageRes.value;

        try {
            const response = await axios.post(FORGOT_PASSWORD_URL, 
                { name: adminName, email: email, number: number, message_res: messageRes, status: 100 },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response.data);
            handleCloseModal();
        } catch (err) {
            console.error("Error response:", err.response);
         
        }
    };

    return (
        <>
            <div className="container AuthPage">
                <section>
                    <p ref={errRef} className={errMsg ? "alert alert-danger" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1 className="text-dark text-center">Login</h1>
                    <p className="text-muted text-center">Please login with your details</p>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username" className="text-dark">Username</label>
                            <input
                                type="text"
                                id="username"
                                ref={userRef}
                                autoComplete="off"
                                onChange={(e) => setUser(e.target.value)}
                                value={user}
                                required
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <br></br>
                            <label htmlFor="password" className="text-dark">Password</label>
                            <input
                                type="password"
                                id="password"
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                required
                                className="form-control"
                            />
                        </div>
                        <br></br>
                        <a href="#" className="text-primary" onClick={handleForgotPassword}>Forgot password?</a>
                        <div className="text-center mt-2">
                            <button className="btn-auth btn btn-secondary">Login</button>
                        </div>
                        
                    </form>
                </section>
            </div>

            {showModal && (
                <div className="modal show" style={{ display: "block" }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Forgot Password</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmitForgotPassword}>
                                    <div className="mb-3">
                                        <label htmlFor="adminName" className="form-label">Admin Name</label>
                                        <input type="text" className="form-control" id="adminName" placeholder="Enter admin name" required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="adminLogin" className="form-label">Admin Login</label>
                                        <input type="text" className="form-control" id="adminLogin" placeholder="Enter admin login" required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="messageRes" className="form-label">Message</label>
                                        <textarea className="form-control textarea-control" id="messageRes" rows="3" placeholder="Enter your message" required></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Authentication;