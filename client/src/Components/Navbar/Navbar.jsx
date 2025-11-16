import React, { useEffect, useState } from 'react'
import { BiMenuAltRight } from 'react-icons/bi'
import logo from '../../images/logo.png'
import { Link } from "react-router-dom"
import { AiOutlineShoppingCart } from 'react-icons/ai'
import toast from 'react-hot-toast'
import '../../styles/navbar.css'
import '../../styles/Sidebar.css'
import { useAuth } from '../../context/auth'

const Navbar = () => {

    const [auth, setAuth] = useAuth();

    const handleSubmit = () => {
        setAuth({
            ...auth,
            user: null,
            token: ''
        })
        localStorage.removeItem('auth')
        toast.success('Logged Out Successfully')
    }

    useEffect(() => {
        const navBar = document.querySelectorAll(".nav-link");
        const navCollapse = document.querySelector(".navbar-collapse.collapse");

        const handleNavClick = () => {
            navCollapse.classList.remove("show");
        };

        navBar.forEach((a) => {
            a.addEventListener("click", handleNavClick);
        });

        return () => {
            navBar.forEach((a) => {
                a.removeEventListener("click", handleNavClick);
            });
        };
    }, []);

    return (
        <>
            {auth?.user?.role ? (
                <>
                    <header className='header_wrapper'>
                        <nav className="navbar navbar-expand-lg fixed-top">
                            <div className="container-fluid mx-3">
                                <button className="btn me-3 d-block hamburger-btn" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarNav" aria-controls="sidebarNav" aria-expanded="false" aria-label="Toggle navigation">
                                    <BiMenuAltRight size={35} />
                                </button>
                                <Link to='/'>
                                    <img src={logo} style={{ width: '130px' }} />
                                </Link>
                                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                                    <ul className="navbar-nav menu-navbar-nav">
                                        <Link to='/' style={{ textDecoration: 'none' }}>
                                            <li className="nav-item">
                                                <a className="nav-link " aria-current="page">Home</a>
                                            </li>
                                        </Link>
                                        <Link to='/about' style={{ textDecoration: 'none' }}>
                                            <li className="nav-item">
                                                <a className="nav-link " aria-current="page">About Us</a>
                                            </li>
                                        </Link>
                                        <Link to='/contact' style={{ textDecoration: 'none' }}>
                                            <li className="nav-item">
                                                <a className="nav-link " aria-current="page">Contact Us</a>
                                            </li>
                                        </Link>
                                        <Link to='/safety-tips' style={{ textDecoration: 'none' }}>
                                            <li className="nav-item">
                                                <a className="nav-link " aria-current="page">Safety Tips</a>
                                            </li>
                                        </Link>
                                    </ul>

                                    {!auth.user ? (<ul className='mt-2 text-center'>
                                        <Link to='/login' style={{ textDecoration: 'none' }} className="nav-item text-center">
                                            <a className="nav-link learn-more-btn btn-extra-header" aria-current="page">Login</a>
                                        </Link>
                                        <Link to='/register' style={{ textDecoration: 'none' }} className="nav-item text-center">
                                            <a className="nav-link learn-more-btn" aria-current="page">Register</a>
                                        </Link>
                                    </ul>) : (<ul className='mt-2 text-center'>
                                        <Link to={`/dashboard${auth?.user?.role === 1 ? "/" : "/profile"}`} style={{ textDecoration: 'none' }} className="nav-item text-center">
                                            <a className="nav-link learn-more-btn" aria-current="page">Dashboard</a>
                                        </Link>
                                        <Link onClick={handleSubmit} to='/login' style={{ textDecoration: 'none' }} className="nav-item text-center">
                                            <a className="nav-link learn-more-btn-logout" aria-current="page">Logout</a>
                                        </Link>
                                    </ul>)
                                    }
                                </div>
                                <div className="collapse position-fixed top-0 start-0 h-100 modern-sidebar" id="sidebarNav" style={{width: '320px', zIndex: 1060}}>
                                    <div className="d-flex flex-column h-100">
                                        <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                                            <h5 className="mb-0 text-primary">Menu</h5>
                                            <button className="btn btn-sm" data-bs-toggle="collapse" data-bs-target="#sidebarNav">
                                                ✕
                                            </button>
                                        </div>
                                        <ul className="navbar-nav flex-column p-3 flex-grow-1" style={{maxHeight: 'calc(100vh - 120px)', overflowY: 'auto'}}>
                                            <Link to='/shake-alert' style={{ textDecoration: 'none' }} className="mb-2">
                                                <li className="nav-item">
                                                    <a className="nav-link text-dark p-3 rounded hover-bg-light d-flex align-items-center">
                                                        <span className="me-3">📳</span> Shake Alert
                                                    </a>
                                                </li>
                                            </Link>
                                            <Link to='/fake-call' style={{ textDecoration: 'none' }} className="mb-2">
                                                <li className="nav-item">
                                                    <a className="nav-link text-dark p-3 rounded hover-bg-light d-flex align-items-center">
                                                        <span className="me-3">📞</span> Fake Call
                                                    </a>
                                                </li>
                                            </Link>
                                            <Link to='/helpline-numbers' style={{ textDecoration: 'none' }} className="mb-2">
                                                <li className="nav-item">
                                                    <a className="nav-link text-dark p-3 rounded hover-bg-light d-flex align-items-center">
                                                        <span className="me-3">📞</span> Helpline Numbers
                                                    </a>
                                                </li>
                                            </Link>
                                            <Link to='/police-map' style={{ textDecoration: 'none' }} className="mb-2">
                                                <li className="nav-item">
                                                    <a className="nav-link text-dark p-3 rounded hover-bg-light d-flex align-items-center">
                                                        <span className="me-3">🚔</span> Police Map
                                                    </a>
                                                </li>
                                            </Link>
                                            <Link to='/track-me' style={{ textDecoration: 'none' }} className="mb-2">
                                                <li className="nav-item">
                                                    <a className="nav-link text-dark p-3 rounded hover-bg-light d-flex align-items-center">
                                                        <span className="me-3">📍</span> Track Me
                                                    </a>
                                                </li>
                                            </Link>
                                            <Link to='/safe-route' style={{ textDecoration: 'none' }} className="mb-2">
                                                <li className="nav-item">
                                                    <a className="nav-link text-dark p-3 rounded hover-bg-light d-flex align-items-center">
                                                        <span className="me-3">🗺️</span> Safe Routes
                                                    </a>
                                                </li>
                                            </Link>
                                            <Link to='/night-mode' style={{ textDecoration: 'none' }} className="mb-2">
                                                <li className="nav-item">
                                                    <a className="nav-link text-dark p-3 rounded hover-bg-light d-flex align-items-center">
                                                        <span className="me-3">🌙</span> Night Mode
                                                    </a>
                                                </li>
                                            </Link>
                                            <Link to='/safety-chatbot' style={{ textDecoration: 'none' }} className="mb-2">
                                                <li className="nav-item">
                                                    <a className="nav-link text-dark p-3 rounded hover-bg-light d-flex align-items-center">
                                                        <span className="me-3">🤖</span> AI Assistant
                                                    </a>
                                                </li>
                                            </Link>
                                            <Link to='/location-reminder' style={{ textDecoration: 'none' }} className="mb-2">
                                                <li className="nav-item">
                                                    <a className="nav-link text-dark p-3 rounded hover-bg-light d-flex align-items-center">
                                                        <span className="me-3">⚠️</span> Safety Zones
                                                    </a>
                                                </li>
                                            </Link>
                                            <Link to='/safety-tips' style={{ textDecoration: 'none' }} className="mb-2">
                                                <li className="nav-item">
                                                    <a className="nav-link text-dark p-3 rounded hover-bg-light d-flex align-items-center">
                                                        <span className="me-3">💡</span> Safety Tips
                                                    </a>
                                                </li>
                                            </Link>
                                            <Link to='/safety-quiz' style={{ textDecoration: 'none' }} className="mb-2">
                                                <li className="nav-item">
                                                    <a className="nav-link text-dark p-3 rounded hover-bg-light d-flex align-items-center">
                                                        <span className="me-3">🎯</span> Safety Quiz
                                                    </a>
                                                </li>
                                            </Link>
                                            <Link to='/weather-safety' style={{ textDecoration: 'none' }} className="mb-2">
                                                <li className="nav-item">
                                                    <a className="nav-link text-dark p-3 rounded hover-bg-light d-flex align-items-center">
                                                        <span className="me-3">🌦️</span> Weather Safety
                                                    </a>
                                                </li>
                                            </Link>
                                            <Link to='/feedback' style={{ textDecoration: 'none' }} className="mb-2">
                                                <li className="nav-item">
                                                    <a className="nav-link text-dark p-3 rounded hover-bg-light d-flex align-items-center">
                                                        <span className="me-3">💬</span> Feedback
                                                    </a>
                                                </li>
                                            </Link>

                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </header>
                </>
            ) : (<>

                <header className='header_wrapper'>
                    <nav className="navbar navbar-expand-lg fixed-top">
                        <div className="container-fluid mx-3">
                            <button className="btn me-3 d-block hamburger-btn" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarNav2" aria-controls="sidebarNav2" aria-expanded="false" aria-label="Toggle navigation">
                                <BiMenuAltRight size={35} />
                            </button>
                            <Link to='/'>
                                <img src={logo} style={{ width: '130px' }} />
                            </Link>
                            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                                <ul className="navbar-nav menu-navbar-nav">
                                    <Link to='/emergency' style={{ textDecoration: 'none' }} className="nav-item text-center">
                                        <a className="nav-link learn-more-btn-logout" aria-current="page">Emergency</a>
                                    </Link>
                                    <Link to='/' style={{ textDecoration: 'none' }}>
                                        <li className="nav-item">
                                            <a className="nav-link " aria-current="page">Home</a>
                                        </li>
                                    </Link>
                                    <Link to='/about' style={{ textDecoration: 'none' }}>
                                        <li className="nav-item">
                                            <a className="nav-link " aria-current="page">About Us</a>
                                        </li>
                                    </Link>
                                    <Link to='/contact' style={{ textDecoration: 'none' }}>
                                        <li className="nav-item">
                                            <a className="nav-link " aria-current="page">Contact Us</a>
                                        </li>
                                    </Link>


                                    <Link to='/report' style={{ textDecoration: 'none' }}>
                                        <li className="nav-item">
                                            <a className="nav-link " aria-current="page">Report Incident</a>
                                        </li>
                                    </Link>
                                </ul>

                                {!auth.user ? (<ul className='mt-2 text-center'>
                                    <Link to='/login' style={{ textDecoration: 'none' }} className="nav-item text-center">
                                        <a className="nav-link learn-more-btn btn-extra-header" aria-current="page">Login</a>
                                    </Link>
                                    <Link to='/register' style={{ textDecoration: 'none' }} className="nav-item text-center">
                                        <a className="nav-link learn-more-btn" aria-current="page">Register</a>
                                    </Link>
                                </ul>) : (<ul className='mt-2 text-center'>
                                    <Link to={`/dashboard/${auth?.user?.role === 1 ? "/" : "profile"}`} style={{ textDecoration: 'none' }} className="nav-item text-center">
                                        <a className="nav-link learn-more-btn" aria-current="page">Profile</a>
                                    </Link>
                                    <Link onClick={handleSubmit} to='/login' style={{ textDecoration: 'none' }} className="nav-item text-center">
                                        <a className="nav-link learn-more-btn-logout" aria-current="page">Logout</a>
                                    </Link>
                                </ul>)
                                }
                            </div>
                            <div className="collapse position-fixed top-0 start-0 h-100 modern-sidebar" id="sidebarNav2" style={{width: '320px', zIndex: 1060}}>
                                <div className="d-flex flex-column h-100">
                                    <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0 text-primary">Menu</h5>
                                        <button className="btn btn-sm" data-bs-toggle="collapse" data-bs-target="#sidebarNav2">
                                            ✕
                                        </button>
                                    </div>
                                    <ul className="navbar-nav flex-column p-3 flex-grow-1" style={{maxHeight: 'calc(100vh - 120px)', overflowY: 'auto'}}>
                                        <Link to='/shake-alert' style={{ textDecoration: 'none' }} className="mb-2">
                                            <li className="nav-item">
                                                <a className="nav-link text-dark p-3 rounded hover-bg-light d-flex align-items-center">
                                                    <span className="me-3">📳</span> Shake Alert
                                                </a>
                                            </li>
                                        </Link>
                                        <Link to='/fake-call' style={{ textDecoration: 'none' }} className="mb-2">
                                            <li className="nav-item">
                                                <a className="nav-link text-dark p-3 rounded hover-bg-light d-flex align-items-center">
                                                    <span className="me-3">📞</span> Fake Call
                                                </a>
                                            </li>
                                        </Link>
                                        <Link to='/helpline-numbers' style={{ textDecoration: 'none' }} className="mb-2">
                                            <li className="nav-item">
                                                <a className="nav-link text-dark p-3 rounded hover-bg-light d-flex align-items-center">
                                                    <span className="me-3">📞</span> Helpline Numbers
                                                </a>
                                            </li>
                                        </Link>
                                        <Link to='/police-map' style={{ textDecoration: 'none' }} className="mb-2">
                                            <li className="nav-item">
                                                <a className="nav-link text-dark p-3 rounded hover-bg-light d-flex align-items-center">
                                                    <span className="me-3">🚔</span> Police Map
                                                </a>
                                            </li>
                                        </Link>
                                        <Link to='/track-me' style={{ textDecoration: 'none' }} className="mb-2">
                                            <li className="nav-item">
                                                <a className="nav-link text-dark p-3 rounded hover-bg-light d-flex align-items-center">
                                                    <span className="me-3">📍</span> Track Me
                                                </a>
                                            </li>
                                        </Link>
                                        <Link to='/safe-route' style={{ textDecoration: 'none' }} className="mb-2">
                                            <li className="nav-item">
                                                <a className="nav-link text-dark p-3 rounded hover-bg-light d-flex align-items-center">
                                                    <span className="me-3">🗺️</span> Safe Routes
                                                </a>
                                            </li>
                                        </Link>
                                        <Link to='/night-mode' style={{ textDecoration: 'none' }} className="mb-2">
                                            <li className="nav-item">
                                                <a className="nav-link text-dark p-3 rounded hover-bg-light d-flex align-items-center">
                                                    <span className="me-3">🌙</span> Night Mode
                                                </a>
                                            </li>
                                        </Link>
                                        <Link to='/safety-chatbot' style={{ textDecoration: 'none' }} className="mb-2">
                                            <li className="nav-item">
                                                <a className="nav-link text-dark p-3 rounded hover-bg-light d-flex align-items-center">
                                                    <span className="me-3">🤖</span> AI Assistant
                                                </a>
                                            </li>
                                        </Link>
                                        <Link to='/location-reminder' style={{ textDecoration: 'none' }} className="mb-2">
                                            <li className="nav-item">
                                                <a className="nav-link text-dark p-3 rounded hover-bg-light d-flex align-items-center">
                                                    <span className="me-3">⚠️</span> Safety Zones
                                                </a>
                                            </li>
                                        </Link>
                                        <Link to='/safety-tips' style={{ textDecoration: 'none' }} className="mb-2">
                                            <li className="nav-item">
                                                <a className="nav-link text-dark p-3 rounded hover-bg-light d-flex align-items-center">
                                                    <span className="me-3">💡</span> Safety Tips
                                                </a>
                                            </li>
                                        </Link>
                                        <Link to='/safety-quiz' style={{ textDecoration: 'none' }} className="mb-2">
                                            <li className="nav-item">
                                                <a className="nav-link text-dark p-3 rounded hover-bg-light d-flex align-items-center">
                                                    <span className="me-3">🎯</span> Safety Quiz
                                                </a>
                                            </li>
                                        </Link>
                                        <Link to='/weather-safety' style={{ textDecoration: 'none' }} className="mb-2">
                                            <li className="nav-item">
                                                <a className="nav-link text-dark p-3 rounded hover-bg-light d-flex align-items-center">
                                                    <span className="me-3">🌦️</span> Weather Safety
                                                </a>
                                            </li>
                                        </Link>
                                        <Link to='/feedback' style={{ textDecoration: 'none' }} className="mb-2">
                                            <li className="nav-item">
                                                <a className="nav-link text-dark p-3 rounded hover-bg-light d-flex align-items-center">
                                                    <span className="me-3">💬</span> Feedback
                                                </a>
                                            </li>
                                        </Link>

                                    </ul>
                                </div>
                            </div>
                        </div>
                    </nav>
                </header>
            </>)}
        </>
    )
}

export default Navbar