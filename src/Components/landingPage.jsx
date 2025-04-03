import { useState } from 'react'
import './landingPage.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import { Link, useNavigate } from 'react-router-dom';
import SignUp from './signup';

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
                <img src="../../web-image.png" className="first-image" alt="web-images" />
                
            </div>

            <div className="features">
                <h2>Features</h2>
                <ul>
                <li>
                    <div className="feature-1">
                    <p className='feature-caption'>Play button that allows to pause/play the generated audio.</p>
                    <img src="../../play-feature.png" alt="play-feature" />
                    </div>
                </li>

                <li>
                    <div className="feature-1">
                    <img src="../../duration-feature.png" alt="duration-feature" />
                    <p className='feature-caption'>Duration selection box allows you to choose how long your audio is intended to last.</p>
                    </div>

                </li>

                <li>
                    <div className="feature-1">
                    <p className='feature-caption'>Heart feature allows you to save your favorite audios so that you can reuse them in the future.</p>
                    <img src="../../favorite-feature.png" alt="favorite-feature" />
                    </div>
                </li>

                <li>
                    <div className="feature-1">
                    <img src="../../history-feature.png" alt="history-feature" />
                    <p className='feature-caption'>View all your generated audios in the history pane.</p>
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
                    <FontAwesomeIcon icon={faTwitter} onClick={() => window.open('https://twitter.com', '_blank', 'noopener noreferrer')}  style={{ cursor: 'pointer', fontSize: '24px', padding: '10px'}}/>
                    <FontAwesomeIcon icon={faLinkedin} onClick={() => window.open('https://linkedin.com', '_blank', 'noopener noreferrer')} style={{ cursor: 'pointer', fontSize: '24px', padding: '10px'}}/>
                    <FontAwesomeIcon icon={faGithub} onClick={() => window.open('https://github.com', '_blank', 'noopener noreferrer')} style={{ cursor: 'pointer', fontSize: '24px', padding: '10px'}}/>
                </div>
                <div>
                    <a href="#">Project Repository</a>
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