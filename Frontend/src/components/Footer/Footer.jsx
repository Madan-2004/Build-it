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
          <h3>About Us</h3>
          <p>Building innovative solutions for tomorrow's challenges.</p>
          <FooterLink href="/about">Our Story</FooterLink>
          <FooterLink href="/careers">Careers</FooterLink>
        </FooterSection>

        <FooterSection>
          <h3>Quick Links</h3>
          <FooterLink href="/privacy">Privacy Policy</FooterLink>
          <FooterLink href="/terms">Terms of Service</FooterLink>
          <FooterLink href="/faq">FAQs</FooterLink>
          <FooterLink href="/contact">Support</FooterLink>
        </FooterSection>

        <FooterSection>
          <h3>Contact</h3>
          <FooterLink href="mailto:info@example.com">
            info@example.com
          </FooterLink>
          <FooterLink href="tel:+1234567890">+1 (234) 567-890</FooterLink>
          <p>
            123 Business Street
            <br />
            New York, NY 10001
          </p>
        </FooterSection>

        <FooterSection>
          <h3>Connect With Us</h3>
          <SocialContainer>
            <FooterLink href="#">
              <FaFacebook size={24} />
            </FooterLink>
            <FooterLink href="#">
              <FaTwitter size={24} />
            </FooterLink>
            <FooterLink href="#">
              <FaInstagram size={24} />
            </FooterLink>
            <FooterLink href="#">
              <FaLinkedin size={24} />
            </FooterLink>
          </SocialContainer>
        </FooterSection>
      </FooterContent>

      <Copyright>
        © {new Date().getFullYear()} Your Company Name. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
}
