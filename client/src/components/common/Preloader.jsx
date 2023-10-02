import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Preloader = () => {
  return (
    <PreloaderWrapper className='d-flex align-items-center justify-content-center'>
      <div className="spinner"></div>
    </PreloaderWrapper>
  );
};

export default Preloader;

const PreloaderWrapper = styled.div`
  .spinner {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    animation: ${spin} 0.8s linear infinite;
  }
`;
