import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const About = () => {
  const teamMembers = [
    {
      name: 'Sudais',
      id: '22k4364',
      contribution: 'Handled the front-end and back-end development of the project.',
      image: '/assets/sudais.jpg',
    },
    {
      name: 'Azka',
      id: '22k4493',
      contribution: 'Handled the front-end and back-end development of the project.',
      image: '/assets/azka.png',
    },
    {
      name: 'Sumaiya',
      id: '22k4201',
      contribution: 'Handled the database of the project.',
      image:'/assets/sumaiya.jpg' ,
    },
  ];

  return (
    <PageContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <LeftContainer>
        {teamMembers.map((member, index) => (
          <TeamMember key={index}>
            <ImageContainer>
              <img src={member.image} alt={member.name} />
            </ImageContainer>
            <DescriptionContainer>
              <h2>{member.name}</h2>
              <p>ID: {member.id}</p>
              <p>{member.contribution}</p>
            </DescriptionContainer>
          </TeamMember>
        ))}
      </LeftContainer>
      <RightContainer>
        <CompanyTitle>Mina Electric © </CompanyTitle>
        <CompanyDescription>
          Mina Electric is a business that specializes in providing high-quality lighting solutions,
          including street lights, flood lights, and solar-powered lights. Our mission is to deliver
          reliable, sustainable, and affordable lighting solutions to our customers. Contact us today
          to learn more about our offerings.
        </CompanyDescription>
        <ContactDetails>
        <p>
    <span role="img" aria-label="phone">📞</span> Contact: +92-300-1234567
  </p>
  <p>
    <span role="img" aria-label="email">📧</span> Email: info@minaelectric.com
  </p>
        </ContactDetails>
      </RightContainer>
    </PageContainer>
  );
};

export default About;

// Styled Components
const PageContainer = styled(motion.div)`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;
`;

const LeftContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px;
`;

const RightContainer = styled.div`
  flex: 1;
  background-color: #007bff;
  color: white;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const TeamMember = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  gap: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  max-width: 150px;

  img {
    width: 100%;
    height: auto;
    border-radius: 50%;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }
`;

const DescriptionContainer = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 10px;

  h2 {
    font-size: 1.5rem;
    color: #007bff;
    margin: 0;
    transition: color 0.3s ease;

    &:hover {
      color: #0056b3;
    }
  }

  p {
    font-size: 1rem;
    color: #333;
    margin: 0;
  }
`;

const CompanyTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
`;

const CompanyDescription = styled.p`
  font-size: 1.2rem;
  line-height: 1.5;
  margin-bottom: 20px;
`;

const ContactDetails = styled.div`
  font-size: 1rem;
  line-height: 1.5;

  p {
    margin: 5px 0;
  }
`;
