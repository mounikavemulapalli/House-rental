import './ProfileSidebar.css';
import { useHistory, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';

const ProfileSidebar = () => {
    const history = useHistory();
    const location = useLocation();
    const sidebarRef = useRef(null);
    const activeButtonRef = useRef(null);

    const onClickSidebarButton = (event) => {
        history.push(`/profile/${event.target.name}`);
    };

    useEffect(() => {
        if (activeButtonRef.current && sidebarRef.current) {
            const container = sidebarRef.current;
            const activeButton = activeButtonRef.current;

            // Scroll to center the active button
            container.scrollTo({
                left: activeButton.offsetLeft - container.offsetWidth / 2 + activeButton.offsetWidth / 2,
                behavior: 'smooth'
            });
        }
    }, [location.pathname]); // Run when route changes

    return (
        <div className="sidebar-container">
            <div>
                <p className='manage-acccount-paragraph'>Manage your account</p>
                <hr />
            </div>
            <div className="sidebar-buttons-container" ref={sidebarRef}>
                {[
                    { name: "myProfile", label: "Basic Profile" },
                    { name: "myShortlists", label: "Your Shortlists" },
                    { name: "myContacts", label: "Owners you Contacted" },
                    { name: "myPayments", label: "Your Payments" },
                    { name: "myProperties", label: "Your Properties" },
                    { name: "enquiries", label: "Interested in your Properties" }
                ].map(({ name, label }) => {
                    const isActive = location.pathname.includes(`/profile/${name}`);
                    return (
                        <button
                            key={name}
                            name={name}
                            onClick={onClickSidebarButton}
                            ref={isActive ? activeButtonRef : null}
                            className={`sidebar-button ${isActive ? 'active' : ''}`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ProfileSidebar;
