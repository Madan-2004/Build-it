import {
  FooterContainer,
  FooterContent,
  FooterSection,
  FooterLink,
  SocialContainer,
  Copyright,
} from "./FooterElements";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
       

        <FooterSection>
          <h3>Quick Links</h3>
          <FooterLink href="/privacy">Privacy Policy</FooterLink>
          <FooterLink href="/terms">Terms of Service</FooterLink>
          <FooterLink href="/faq">FAQs</FooterLink>
          <FooterLink href="/contact">Support</FooterLink>
        </FooterSection>

        <FooterSection>
          <h3>Contact</h3>
          <FooterLink href="mailto:info@build-it.com">
            info@build-it.com
          </FooterLink>
          <FooterLink href="tel:+1234567890">+1 (234) 567-890</FooterLink>
          <p>
            Indian Institute of Technology Indore
            <br />
            Khandwa Road, Simrol
            <br />
            Indore, Madhya Pradesh 453552
          </p>
        </FooterSection>

        <FooterSection>
          <h3>Connect With Us</h3>
          <SocialContainer>
            <FooterLink href="https://www.facebook.com/yourpage" target="_blank" rel="noopener noreferrer">
              <FaFacebook size={24} />
            </FooterLink>
            <FooterLink href="https://www.twitter.com/yourpage" target="_blank" rel="noopener noreferrer">
              <FaTwitter size={24} />
            </FooterLink>
            <FooterLink href="https://www.instagram.com/yourpage" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={24} />
            </FooterLink>
            <FooterLink href="https://www.linkedin.com/yourpage" target="_blank" rel="noopener noreferrer">
              <FaLinkedin size={24} />
            </FooterLink>
          </SocialContainer>
        </FooterSection>

        {/* <FooterSection>
          <h3>Our Location</h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.488726663184!2d75.9199963149575!3d22.5207449852038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962e31c5e7b7b6d%3A0x5d5e5e5e5e5e5e5e!2sIndian%20Institute%20of%20Technology%20Indore!5e0!3m2!1sen!2sin!4v1616581234567!5m2!1sen!2sin"
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </FooterSection> */}
      </FooterContent>

      <Copyright>
        © {new Date().getFullYear()} Build-It. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
}