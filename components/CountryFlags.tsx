import type React from "react"

// Generic component type for flags (SVG or emoji fallback)
type FlagComponent = (props: { className?: string; title?: string }) => JSX.Element

const flags: Record<string, FlagComponent> = {
  US: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7410 3900" className={props.className}>
      <path fill="#b22234" d="M0 0h7410v3900H0z" />
      <path d="M0 450h7410m0 600H0m0 600h7410m0 600H0m0 600h7410m0 600H0" stroke="#fff" strokeWidth="300" />
      <path fill="#3c3b6e" d="M0 0h2964v2100H0z" />
      <g fill="#fff">
        <g id="d">
          <g id="c">
            <g id="e">
              <g id="b">
                <path id="a" d="M247 90l70.534 217.082-184.66-134.164h228.253L176.466 307.082z" />
                <use xlinkHref="#a" y="420" />
                <use xlinkHref="#a" y="840" />
                <use xlinkHref="#a" y="1260" />
              </g>
              <use xlinkHref="#b" x="247" y="210" />
            </g>
            <use xlinkHref="#e" x="494" />
          </g>
          <use xlinkHref="#c" x="988" />
        </g>
        <use xlinkHref="#d" x="1976" />
        <use xlinkHref="#c" x="2470" />
      </g>
    </svg>
  ),
  GB: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className={props.className}>
      <clipPath id="s">
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id="t">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath="url(#s)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  ),
  FR: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" className={props.className}>
      <path fill="#EC1920" d="M0 0h3v2H0z" />
      <path fill="#fff" d="M0 0h2v2H0z" />
      <path fill="#051440" d="M0 0h1v2H0z" />
    </svg>
  ),
  DE: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3" className={props.className}>
      <path d="M0 0h5v3H0z" />
      <path fill="#D00" d="M0 1h5v2H0z" />
      <path fill="#FFCE00" d="M0 2h5v1H0z" />
    </svg>
  ),
  RU: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" className={props.className}>
      <rect width="900" height="200" fill="#fff"/>
      <rect y="200" width="900" height="200" fill="#0039A6"/>
      <rect y="400" width="900" height="200" fill="#D52B1E"/>
    </svg>
  ),
  JP: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" className={props.className}>
      <rect fill="#fff" height="600" width="900" />
      <circle fill="#bc002d" cx="450" cy="300" r="180" />
    </svg>
  ),
  AU: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10080 5040" className={props.className}>
      <path fill="#00008B" d="M0 0h10080v5040H0z" />
      <path fill="#fff" d="M0 0v2520h5040V0z" />
      <path fill="#00008B" d="M0 0v1260h5040V0z" />
      <path fill="#fff" d="M0 0l2520 1260L0 2520z" />
      <path fill="#f00" d="M0 0l1680 1260L0 2520z" />
      <path fill="#fff" d="M2520 0L0 1260v120l2520-1260z" />
      <path fill="#f00" d="M1680 0L0 840v420L1680 0z" />
      <path fill="#fff" d="M5040 0L2520 1260v1260h2520z" />
      <path fill="#f00" d="M5040 0L3360 840v1680h1680z" />
      <path fill="#fff" d="M2520 2520l2520-1260v-120L2520 2520z" />
      <path fill="#f00" d="M3360 2520l1680-840v-420L3360 2520z" />
      <g fill="#fff">
        <path d="M5040 2520L2520 1260H0v1260z" />
        <path d="M4200 2520L2100 1260H0v1260z" />
      </g>
      <path fill="#f00" d="M3360 2520L1680 1260H0v1260z" />
      <g fill="#fff">
        <path d="M0 0l2520 1260L5040 0z" />
        <path d="M0 0l2100 1050L4200 0z" />
      </g>
      <path fill="#f00" d="M0 0l1680 840L3360 0z" />
      <g fill="#fff">
        <path d="M2520 1260L5040 0v2520z" />
        <path d="M2100 1050L4200 0v2100z" />
      </g>
      <path fill="#f00" d="M1680 840L3360 0v1680z" />
      <g fill="#fff">
        <path d="M2520 2520L0 1260v1260z" />
        <path d="M2100 2100L0 1050v1050z" />
      </g>
      <path fill="#f00" d="M1680 1680L0 840v840z" />
    </svg>
  ),
  AE: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 6" className={props.className}>
      <rect width="12" height="2" fill="#00732f" />
      <rect width="12" height="2" y="2" fill="#fff" />
      <rect width="12" height="2" y="4" fill="#000" />
      <rect width="3" height="6" fill="#f00" />
    </svg>
  ),
  IN: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" className={props.className}>
      <path fill="#f93" d="M0 0h900v200H0z" />
      <path fill="#fff" d="M0 200h900v200H0z" />
      <path fill="#128807" d="M0 400h900v200H0z" />
      <g transform="translate(450,300) scale(0.6)">
        <circle r="120" fill="#008" />
        <circle r="100" fill="#fff" />
        <circle r="80" fill="#008" />
        <g id="d2" transform="rotate(15)">
          <g id="d">
            <g id="c">
              <g id="b">
                <g id="a">
                  <circle r="7" transform="rotate(7.5) translate(80)" />
                  <path d="M 0,80 0,85 3.5,82.5 z" />
                </g>
                <use xlinkHref="#a" transform="rotate(15)" />
              </g>
              <use xlinkHref="#b" transform="rotate(30)" />
            </g>
            <use xlinkHref="#c" transform="rotate(60)" />
          </g>
          <use xlinkHref="#d" transform="rotate(90)" />
        </g>
        <use xlinkHref="#d2" transform="rotate(30)" />
      </g>
    </svg>
  ),
  SG: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4320 2880" className={props.className}>
      <rect width="4320" height="1440" fill="#ed2939" />
      <rect width="4320" height="1440" y="1440" fill="#fff" />
      <path fill="#fff" d="M 1481,720 a 541,541 0 1,1 0,1 z" />
      <path fill="#ed2939" d="M 1651,835 1411,1005 1171,835 1291,1245 1531,1075 1771,1245 z" />
    </svg>
  ),
  NZ: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" className={props.className}>
      <path fill="#00247d" d="M0 0h1200v600H0z" />
      <path
        fill="#fff"
        d="M0,0v33.333L266.667,150h66.667L0,0zm600,0v300H0v33.333L266.667,450h66.667L600,300v300h66.667L933.333,450H1200v-33.333L933.333,300h200V0H600z"
      />
      <path
        fill="#cc142b"
        d="M0,0v22.222L266.667,140h66.667L0,0zm600,0v300H0v22.222L266.667,440h66.667L600,300v300h66.667L933.333,440H1200v-22.222L933.333,300h200V0H600z"
      />
      <path fill="#fff" d="M300,0v200H0v200h300v200h200V400h700V200H500V0H300z" />
      <path
        fill="#cc142b"
        d="M333.333,0v233.333H0v133.334h333.333V600h133.334V366.667H1200V233.333H466.667V0H333.333z"
      />
      <path fill="#fff" d="M500,300l-44.168,136.014l115.735-84.102h-143.134l115.735,84.102z" />
      <path fill="#cc142b" d="M500,350l-26.501,81.608l69.441-50.461h-85.88l69.441,50.461z" />
    </svg>
  )
}

function countryCodeToEmoji(code: string) {
  const cc = (code || '').toUpperCase()
  if (cc.length !== 2) return '🏳️'
  const A = 0x1F1E6
  const codePoints = [...cc].map(c => A + (c.charCodeAt(0) - 65))
  return String.fromCodePoint(...codePoints)
}

const getCountryFlag = (countryCode: string): FlagComponent => {
  const cc = (countryCode || '').toUpperCase()
  const SVGFlag = flags[cc]
  if (SVGFlag) return SVGFlag
  const emoji = countryCodeToEmoji(cc)
  const Fallback: FlagComponent = ({ className }) => (
    <span role="img" aria-label={`${cc} flag`} className={className} style={{ display: 'inline-block', lineHeight: 1 }}>
      {emoji}
    </span>
  )
  return Fallback
}

export { getCountryFlag, countryCodeToEmoji }
