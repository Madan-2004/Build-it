import "../../styles/contact.css";

export default function Contact() {
    return (
        <div className="contact-container">
            <h1 className="contact-title">Contact Us</h1>
            
            {/* Secretaries and Council Contacts */}
            <div className="contact-section">
                <h2>Secretaries & Council Contacts</h2>
                <ul className="contact-list">
                    <li><strong>Science & Technology Secretary:</strong> snt.secretary@iiti.ac.in</li>
                    <li><strong>Cultural Secretary:</strong> cultural.secretary@iiti.ac.in</li>
                    <li><strong>Sports Secretary:</strong> sports.secretary@iiti.ac.in</li>
                    <li><strong>Academic Secretary:</strong> academic.secretary@iiti.ac.in</li>
                </ul>
            </div>
            
            {/* Councils Contact */}
            <div className="contact-section">
                <h2>Council Emails</h2>
                <ul className="contact-list">
                    <li><strong>Science & Technology Council:</strong> snt.council@iiti.ac.in</li>
                    <li><strong>Cultural Council:</strong> cultural.council@iiti.ac.in</li>
                    <li><strong>Sports Council:</strong> sports.council@iiti.ac.in</li>
                    <li><strong>Academic Council:</strong> academic.council@iiti.ac.in</li>
                </ul>
            </div>
            
            {/* IIT Indore Location */}
            <div className="contact-section">
                <h2>Visit Us</h2>
                <p>IIT Indore, Simrol, Khandwa Road, Indore, Madhya Pradesh, 453552, India</p>
                <iframe 
                    title="IIT Indore Location"
                    className="google-map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.5745601683476!2d75.91999587597158!3d22.520330937210493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd822fe1a9e5%3A0x29de72a0cb9e4e1b!2sIIT%20Indore!5e0!3m2!1sen!2sin!4v1647980301983!5m2!1sen!2sin"
                    width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy"
                ></iframe>
            </div>
        </div>
    );
};
