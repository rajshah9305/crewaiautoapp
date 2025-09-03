import React from 'react';

const styles = `
.bar {
    width: 4px;
    height: 18px;
    background-color: currentColor;
    border-radius: 2px;
    animation: pulse 1.2s infinite ease-in-out;
    box-shadow: 0 0 5px currentColor;
}
.bar:nth-child(2) {
    animation-delay: 0.2s;
}
.bar:nth-child(3) {
    animation-delay: 0.4s;
}
@keyframes pulse {
    0%, 80%, 100% {
        transform: scaleY(0.4);
        opacity: 0.5;
    }
    40% {
        transform: scaleY(1);
        opacity: 1;
    }
}
`;

const Loader: React.FC = () => {
  return (
    <>
      <style>{styles}</style>
      <div className="flex items-center justify-center gap-1.5">
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </>
  );
};

export default Loader;