import React from 'react';

// This is a bit of a hack to inject SCSS-like functions into a style tag.
// We'll generate the random shadows in JS instead.
const generateBoxShadow = (n: number) => {
    let value = '';
    for (let i = 0; i < n; i++) {
        value += `${Math.random() * 2000}px ${Math.random() * 2000}px #FFF, `;
    }
    return value.slice(0, -2); // remove trailing comma and space
};

const Starfield: React.FC = () => {
    const shadowsSmall = React.useMemo(() => generateBoxShadow(700), []);
    const shadowsMedium = React.useMemo(() => generateBoxShadow(200), []);
    const shadowsBig = React.useMemo(() => generateBoxShadow(100), []);

    return (
        <div className="fixed top-0 left-0 w-full h-screen -z-10 overflow-hidden">
             <style>{`
                @keyframes animStar { from { transform: translateY(0px); } to { transform: translateY(-2000px); } }
                .scanline { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.01), rgba(255,255,255,0)); animation: scanline 10s linear infinite; z-index: 0; pointer-events: none; }
                @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
             `}</style>
            <div id="stars1" style={{ width: '1px', height: '1px', background: 'transparent', boxShadow: shadowsSmall, animation: 'animStar 150s linear infinite' }} />
            <div id="stars2" style={{ width: '2px', height: '2px', background: 'transparent', boxShadow: shadowsMedium, animation: 'animStar 100s linear infinite' }} />
            <div id="stars3" style={{ width: '3px', height: '3px', background: 'transparent', boxShadow: shadowsBig, animation: 'animStar 50s linear infinite' }} />
            <div className="scanline" />
        </div>
    );
};

export default Starfield;