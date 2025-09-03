import React from 'react';

const styles = `
.bar {
    width: 4px;
    height: 16px;
    background-color: currentColor;
    border-radius: 2px;
    animation: pulse 1.2s infinite ease-in-out;
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
        opacity: 0.7;
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
      <div className="flex items-center justify-center gap-1">
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </>
  );
};

export default Loader;
