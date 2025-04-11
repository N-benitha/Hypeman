import { useState } from 'react'
import './landingPage.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import { Link, useNavigate } from 'react-router-dom';
// import webImage from '../assets/images/web-image.png';
// import audioFeature from '../assets/images/audio-feature.png';
// import durationFeature from '../assets/images/duration-feature.png';
// import historyFeature from '../assets/images/history-feature.png';
// import newChatFeature from '../assets/images/newchat-feature.png';


const LandingPage = () => {
  const [count, setCount] = useState(0)
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/signup');
  };

  const scrollToFeatures = () => {
    const featuresSection = document.querySelector('.features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const scrollToAbout = () => {
    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
//   console.log("Project ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);
//   console.log("API Key:", import.meta.env.VITE_FIREBASE_API_KEY);

  return (
    <div className='container'>
    <nav className='navbar'>
        <div className='navbar-list'>
            <ul>
                <li><Link to={'/'} style={{ textDecoration: 'none', color: '#fff' }}>Home</Link></li>
                <li onClick={scrollToFeatures}>Features</li>
                <li onClick={scrollToAbout}>About Us</li>
                <li>Contact Us</li>
                <li><Link to={'/signup'} style={{ textDecoration: 'none', color: '#fff' }}>Sign Up/In</Link></li>
            </ul>
        </div>
    </nav>

    <div className="welcome-container">
        <h1>Welcome to HypeMan</h1>
        <p className='p-1'>Fuel Your Mind. Elevate Your Spirit. Own Your Moment.</p>
        <p className='p-2'>Get your daily affirmations, Motivate yourself, and Boost your confidence!</p>

        <div className="our-web">
            <div className="start-here">
                <button className='start-here-btn' onClick={handleSignUp}>Start Using</button>
                <img src="/images/web-image.png" className="first-image" alt="web-images" />
                
            </div>

            <div className="features">
                <h2>Features</h2>
                <ul>
                <li>
                    <div className="feature-1">
                    <p className='feature-caption'>Upward arrow feature allows you to send your prompt to the system.</p>
                    <img src="/images/generate-feature.png" alt="play-feature" />
                    </div>
                </li>

                <li>
                    <div className="feature-1">
                    <img src="/images/duration-feature.png" alt="duration-feature" />
                    <p className='feature-caption'>Duration feature selection box allows you to choose how long your audio is intended to last.</p>
                    </div>

                </li>

                <li>
                    <div className="feature-1">
                    <p className='feature-caption'>New Chat feature allows you to create a new chat for a fresh conversation.</p>
                    <img src="/images/newchat-feature.png" alt="favorite-feature" />
                    </div>
                </li>

                <li>
                    <div className="feature-1">
                    <img src="/images/history-feature.png" alt="history-feature" />
                    <p className='feature-caption'>History feature allows you access to all your previously generated audios.</p>
                    </div>
                </li>

                </ul>
            </div>
        </div>

        <div className="about">
            <h2>About Us</h2>
            <div className="about-us">
                <p>This project has been made for the purpose of motivating, giving affirmations and boosting users' confidence. As many individuals face imposter syndrome, myself included, this website will help improve their mood and motivate them to keep going. Huge thanks to <a href='https://www.alxafrica.com/' alt='alx-link'>ALX</a> who made this project possible by always pushing us.</p>
                <div className="icon-socials">
                    <FontAwesomeIcon icon={faTwitter} onClick={() => window.open('https://x.com/benitha__', '_blank', 'noopener noreferrer')}  style={{ cursor: 'pointer', fontSize: '24px', padding: '10px'}}/>
                    <FontAwesomeIcon icon={faLinkedin} onClick={() => window.open('https://www.linkedin.com/in/ngunga-benitha-26b43921b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', '_blank', 'noopener noreferrer')} style={{ cursor: 'pointer', fontSize: '24px', padding: '10px'}}/>
                    <FontAwesomeIcon icon={faGithub} onClick={() => window.open('https://github.com/N-benitha', '_blank', 'noopener noreferrer')} style={{ cursor: 'pointer', fontSize: '24px', padding: '10px'}}/>
                </div>
                <div>
                    <a href="https://github.com/N-benitha/Hypeman2">Project Repository</a>
                </div>
            </div>
        
        </div>

    </div>
    <footer>
        <p>&copy; 2025 HypeMan</p>
    </footer>
    </div>
  )
};

export default LandingPage;