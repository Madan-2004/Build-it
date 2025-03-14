import React from "react";
import * as S from "./AboutUsElements";
import { FaBalanceScale, FaHandsHelping, FaLock, FaVoteYea, FaBook, FaUserShield } from 'react-icons/fa'
import { PageContainer } from "../../components/PageContainer";

export default function AboutUs() {
  return (
    <S.AboutContainer>

      <S.HeroSection>
        <S.HeroContent>
          <S.HeroTitle>Student Government</S.HeroTitle>
          <S.HeroText>
            IIT Indore Students' Gymkhana is the governmental organization under
            the Students’ Constitution of IIT Indore. It has as members all
            registered students of the institute who pay Gymkhana fees. They
            form the General Student Body (GSB) and are subject to the
            Constitution and the laws of the Student Government.
          </S.HeroText>
        </S.HeroContent>
      </S.HeroSection>

      <S.Section>
        <S.SectionLeft>
          <S.SectionTitle>Our Governing Framework</S.SectionTitle>
          <S.SectionText>
            The IIT Indore Students’ Constitution lays the foundation for
            student governance, establishing a democratic system focused on
            student welfare. This foundational document:
          </S.SectionText>
          <S.ValueList>
            <li>Empowers students through guaranteed rights and freedoms</li>
            <li>Creates leadership development opportunities</li>
            <li>Fosters mutual cooperation among stakeholders</li>
            <li>Establishes functional government structures</li>
          </S.ValueList>
          <S.ConstitutionLink
            href="../../../public/Constitution.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Full Students' Constitution Document
          </S.ConstitutionLink>
        </S.SectionLeft>
        <S.SectionRight>
          <S.SectionImage
            src="../../../public/coverpage.jpg"
            alt="Student Constitution Document"
          />
        </S.SectionRight>
      </S.Section>

      <S.HeroSection>
        <S.HeroContent>
          <S.HeroTitle>Student Rights & Protections</S.HeroTitle>
          <S.HeroText>
            Fundamental rights and freedoms guaranteed to all members of the IIT
            Indore General Student Body under the Students' Constitution.
          </S.HeroText>
        </S.HeroContent>
      </S.HeroSection>

      <S.Section>
        <S.SectionLeft>
          <S.SectionTitle>Core Principles</S.SectionTitle>
          <S.SectionText>
            All GSB members enjoy constitutional rights maintained through
            collective responsibility and ethical governance.
          </S.SectionText>
        </S.SectionLeft>
        <S.SectionRight>
          <S.RightsGrid>
            <S.RightCard>
              <FaBalanceScale size={32} />
              <h3>Fundamental Freedoms</h3>
              <S.RightList>
                <li>Freedom of thought & expression</li>
                <li>Peaceful assembly rights</li>
                <li>Association without discrimination</li>
              </S.RightList>
            </S.RightCard>

            <S.RightCard>
              <FaHandsHelping size={32} />
              <h3>Equality & Inclusion</h3>
              <S.RightList>
                <li>Equal protection under law</li>
                <li>Non-discrimination guarantee</li>
                <li>Equal opportunity provisions</li>
              </S.RightList>
            </S.RightCard>

            <S.RightCard>
              <FaLock size={32} />
              <h3>Privacy Protections</h3>
              <S.RightList>
                <li>Personal liberty safeguards</li>
                <li>Medical confidentiality</li>
                <li>Academic privacy rights</li>
              </S.RightList>
            </S.RightCard>
          </S.RightsGrid>
        </S.SectionRight>
      </S.Section>

      <S.Section reverse>
        <S.SectionLeft>
          <S.RightsGrid>
            <S.RightCard>
              <FaVoteYea size={32} />
              <h3>Political Rights</h3>
              <S.RightList>
                <li>Secret ballot elections</li>
                <li>Right to contest polls</li>
                <li>Transparent governance</li>
              </S.RightList>
            </S.RightCard>

            <S.RightCard>
              <FaBook size={32} />
              <h3>Academic Rights</h3>
              <S.RightList>
                <li>Quality education access</li>
                <li>Safe research environment</li>
                <li>Fair evaluation processes</li>
              </S.RightList>
            </S.RightCard>

            <S.RightCard>
              <FaUserShield size={32} />
              <h3>Health & Welfare</h3>
              <S.RightList>
                <li>Quality healthcare access</li>
                <li>Nutritional standards</li>
                <li>Hygiene maintenance</li>
              </S.RightList>
            </S.RightCard>
          </S.RightsGrid>
        </S.SectionLeft>
        <S.SectionRight>
          <S.SectionTitle>Constitutional Safeguards</S.SectionTitle>
          <S.SectionText>
            Our rights framework ensures accountability through:
          </S.SectionText>
          <S.ValueList>
            <li>Judicial review mechanisms</li>
            <li>Ethical governance protocols</li>
            <li>Transparency requirements</li>
            <li>Student representation</li>
          </S.ValueList>
        </S.SectionRight>
      </S.Section>

      <S.ImportantNote>
        <strong>Citizenship Rights:</strong> Students maintain all
        constitutional rights as Indian citizens when acting outside official
        campus representation.
      </S.ImportantNote>
    </S.AboutContainer>
  );
}
