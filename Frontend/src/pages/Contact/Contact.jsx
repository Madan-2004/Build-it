import "../../styles/contact.css";
import FeedbackForm from "../Feedback/FeedbackForm";

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
            
          
            
                <FeedbackForm />
            
        </div>
    );
};
