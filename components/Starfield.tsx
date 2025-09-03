import React from 'react';

const styles = `
.starfield {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: transparent;
  z-index: -1;
}

@function multiple-box-shadow($n) {
  $value: '#{random(2000)}px #{random(2000)}px #FFF';
  @for $i from 2 through $n {
    $value: '#{$value} , #{random(2000)}px #{random(2000)}px #FFF';
  }
  @return unquote($value);
}

$shadows-small: multiple-box-shadow(700);
$shadows-medium: multiple-box-shadow(200);
$shadows-big: multiple-box-shadow(100);

#stars1 {
  width: 1px;
  height: 1px;
  background: transparent;
  box-shadow: #{$shadows-small};
  animation: animStar 50s linear infinite;
}
#stars2 {
  width: 2px;
  height: 2px;
  background: transparent;
  box-shadow: #{$shadows-medium};
  animation: animStar 100s linear infinite;
}
#stars3 {
  width: 3px;
  height: 3px;
  background: transparent;
  box-shadow: #{$shadows-big};
  animation: animStar 150s linear infinite;
}

@keyframes animStar {
  from { transform: translateY(0px); }
  to { transform: translateY(-2000px); }
}

/* A subtle scanline effect for the retro-futuristic feel */
.scanline {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.01), rgba(255,255,255,0));
    animation: scanline 10s linear infinite;
    z-index: 0;
    pointer-events: none;
}
`;

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
        <div className="starfield">
             <style>{`
                @keyframes animStar { from { transform: translateY(0px); } to { transform: translateY(-2000px); } }
                .scanline { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.01), rgba(255,255,255,0)); animation: scanline 10s linear infinite; z-index: 0; pointer-events: none; }
                @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
             `}</style>
            <div id="stars1" style={{ width: '1px', height: '1px', background: 'transparent', boxShadow: shadowsSmall, animation: 'animStar 50s linear infinite' }} />
            <div id="stars2" style={{ width: '2px', height: '2px', background: 'transparent', boxShadow: shadowsMedium, animation: 'animStar 100s linear infinite' }} />
            <div id="stars3" style={{ width: '3px', height: '3px', background: 'transparent', boxShadow: shadowsBig, animation: 'animStar 150s linear infinite' }} />
            <div className="scanline" />
        </div>
    );
};

export default Starfield;