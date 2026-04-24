// drippr-v2-screens.jsx — Data + all screen components
const { useState, useEffect, useRef, useCallback } = React;

/* ── DATA ─────────────────────────────────────────────────────────────── */

const PARTNERS = {
  myntra:  { name:'Myntra',        abbr:'MN', color:'#E91F62' },
  ajio:    { name:'Ajio',          abbr:'AJ', color:'#D4145A' },
  nykaa:   { name:'Nykaa Fashion', abbr:'NF', color:'#FC2779' },
  zara:    { name:'Zara',          abbr:'ZA', color:'#111111' },
  uniqlo:  { name:'Uniqlo',        abbr:'UQ', color:'#E40000' },
};

const CREATORS = [
  { id:1, handle:'@maayarora',     name:'Maaya Arora',    drops:14, followers:'3.2k', saves:89,  sig:'Quiet minimalism. Natural textures.',   img:'https://picsum.photos/seed/cr1/200/200' },
  { id:2, handle:'@priyamalhotra', name:'Priya Malhotra', drops:9,  followers:'2.1k', saves:54,  sig:'Linen lover. Slow fashion advocate.',    img:'https://picsum.photos/seed/cr2/200/200' },
  { id:3, handle:'@anitaseth',     name:'Anita Seth',     drops:22, followers:'5.8k', saves:201, sig:'Editorial. Structured. Elevated.',       img:'https://picsum.photos/seed/cr3/200/200' },
  { id:4, handle:'@rhea.k',        name:'Rhea Kapoor',    drops:6,  followers:'1.4k', saves:33,  sig:'Street-luxe meets quiet basics.',        img:'https://picsum.photos/seed/cr4/200/200' },
];

const PRODUCTS = [
  { id:1, name:'Handwoven Linen Shirt',   price:4200, img:'https://picsum.photos/seed/p1/400/500', sizes:['XS','S','M','L'],   colors:['#C8B89A','#8A7B6C','#E8DDD0'], partner:'myntra', altPartners:[{key:'ajio',price:4100},{key:'nykaa',price:4280}] },
  { id:2, name:'Relaxed Linen Trousers',  price:5800, img:'https://picsum.photos/seed/p2/400/500', sizes:['S','M','L','XL'],   colors:['#8A7B6C','#D4C4A8'],           partner:'uniqlo', altPartners:[] },
  { id:3, name:'Terra Linen Dress',       price:6400, img:'https://picsum.photos/seed/p3/400/500', sizes:['XS','S','M'],       colors:['#D4C4A8','#C8B89A'],           partner:'zara',   altPartners:[{key:'myntra',price:6600}] },
  { id:4, name:'Oversized Cotton Tee',    price:2200, img:'https://picsum.photos/seed/p4/400/500', sizes:['S','M','L','XL'],   colors:['#E8DDD0','#C8B89A'],           partner:'ajio',   altPartners:[] },
  { id:5, name:'Linen Wrap Skirt',        price:3800, img:'https://picsum.photos/seed/p5/400/500', sizes:['XS','S','M','L'],   colors:['#B5A594','#8A7B6C'],           partner:'myntra', altPartners:[{key:'zara',price:3950}] },
  { id:6, name:'Open Weave Blazer',       price:8900, img:'https://picsum.photos/seed/p6/400/500', sizes:['S','M','L'],        colors:['#9E8E7E','#6B7C72'],           partner:'zara',   altPartners:[] },
  { id:7, name:'Wide Leg Culottes',       price:4600, img:'https://picsum.photos/seed/p7/400/500', sizes:['XS','S','M'],       colors:['#C4B5A5','#D4C4A8'],           partner:'nykaa',  altPartners:[] },
  { id:8, name:'Bralette Top',            price:1800, img:'https://picsum.photos/seed/p8/400/500', sizes:['XS','S','M','L'],   colors:['#D8CEC0','#C8B89A'],           partner:'myntra', altPartners:[] },
];

const DROPS = [
  { id:1, title:'The Quiet Season Edit', tagline:'Eight quiet pieces for the in-between season.', creator:CREATORS[0], pieces:12, left:3, products:PRODUCTS.slice(0,8), img:'https://picsum.photos/seed/dr1/600/900', wide:'https://picsum.photos/seed/dr1w/1200/675', shopClicks:142, saves:38 },
  { id:2, title:'The Linen Edit',        tagline:'Breathable, beautiful, built to last.',         creator:CREATORS[1], pieces:8,  left:5, products:PRODUCTS.slice(2,8), img:'https://picsum.photos/seed/dr2/600/900', wide:'https://picsum.photos/seed/dr2w/1200/675', shopClicks:89,  saves:21 },
  { id:3, title:'Monsoon Wardrobe',      tagline:'For the grey days that are secretly beautiful.',creator:CREATORS[2], pieces:10, left:2, products:PRODUCTS.slice(1,7), img:'https://picsum.photos/seed/dr3/600/900', wide:'https://picsum.photos/seed/dr3w/1200/675', shopClicks:203, saves:57 },
];

const TRENDING = [
  { id:101, name:'Ivory Linen Co-ord',  price:5600, img:'https://picsum.photos/seed/tr1/320/420', partner:'myntra' },
  { id:102, name:'Structured Tote',      price:3200, img:'https://picsum.photos/seed/tr2/320/390', partner:'zara'   },
  { id:103, name:'Slip Midi Dress',      price:4800, img:'https://picsum.photos/seed/tr3/320/440', partner:'nykaa'  },
  { id:104, name:'Wide Brim Hat',        price:2100, img:'https://picsum.photos/seed/tr4/320/370', partner:'ajio'   },
  { id:105, name:'Woven Mules',          price:3600, img:'https://picsum.photos/seed/tr5/320/410', partner:'uniqlo' },
  { id:106, name:'Printed Scarf',        price:1400, img:'https://picsum.photos/seed/tr6/320/390', partner:'myntra' },
  { id:107, name:'Denim Overshirt',      price:4200, img:'https://picsum.photos/seed/tr7/320/430', partner:'ajio'   },
  { id:108, name:'Knit Cardigan',        price:5100, img:'https://picsum.photos/seed/tr8/320/400', partner:'zara'   },
];

const CLOSET_PIECES = [
  { id:201, name:'White Linen Shirt',     img:'https://picsum.photos/seed/cp1/400/500', partner:'myntra', price:3200, wears:14, category:'Tops',    color:'#F0EBE0', lastWorn:'2 days ago' },
  { id:202, name:'Straight Leg Jeans',    img:'https://picsum.photos/seed/cp2/400/500', partner:'ajio',   price:4500, wears:22, category:'Bottoms',  color:'#4A6080', lastWorn:'5 days ago' },
  { id:203, name:'Beige Blazer',          img:'https://picsum.photos/seed/cp3/400/500', partner:'zara',   price:7800, wears:6,  category:'Layers',   color:'#C8B89A', lastWorn:'3 weeks ago' },
  { id:204, name:'Slip Dress (Charcoal)', img:'https://picsum.photos/seed/cp4/400/500', partner:'nykaa',  price:4200, wears:3,  category:'Dresses',  color:'#4A4A4A', lastWorn:'1 month ago' },
  { id:205, name:'Thrifted Cord Jacket',  img:'https://picsum.photos/seed/cp5/400/500', partner:null,     price:800,  wears:9,  category:'Layers',   color:'#8B6E4E', lastWorn:'1 week ago' },
  { id:206, name:'Linen Wide Trousers',   img:'https://picsum.photos/seed/cp6/400/500', partner:'uniqlo', price:3500, wears:18, category:'Bottoms',  color:'#D4C4A8', lastWorn:'3 days ago' },
  { id:207, name:'Knit Cardigan (Oat)',   img:'https://picsum.photos/seed/cp7/400/500', partner:'myntra', price:2800, wears:11, category:'Layers',   color:'#E8DDD0', lastWorn:'2 weeks ago' },
  { id:208, name:"Grandma's Silk Scarf",  img:'https://picsum.photos/seed/cp8/400/500', partner:null,     price:0,    wears:4,  category:'Acc.',     color:'#C0A882', lastWorn:'2 months ago' },
  { id:209, name:'Relaxed Linen Set',     img:'https://picsum.photos/seed/cp9/400/500', partner:'uniqlo', price:5200, wears:7,  category:'Sets',     color:'#D0C8B8', lastWorn:'4 days ago' },
  { id:210, name:'Gifted Silk Cami',      img:'https://picsum.photos/seed/cp10/400/500',partner:null,     price:0,    wears:2,  category:'Tops',     color:'#D4C0A8', lastWorn:'3 months ago' },
];

const MY_DROPS = [
  { id:301, title:'Weekend Linen Edit',    cover:'https://picsum.photos/seed/md1w/600/338', pieces:6, published:'3d ago', views:284, saves:12, shopClicks:31, status:'published' },
  { id:302, title:'Office Quiet Luxe',     cover:'https://picsum.photos/seed/md2w/600/338', pieces:8, published:'2w ago', views:891, saves:44, shopClicks:98, status:'published' },
  { id:303, title:'Monsoon Capsule',        cover:'https://picsum.photos/seed/md3w/600/338', pieces:5, published:null,   views:0,   saves:0,  shopClicks:0,  status:'draft' },
];

/* ── ICONS ────────────────────────────────────────────────────────────── */
const Ico = ({ n, size=24, color='currentColor', sw=1.5 }) => {
  const d = {
    home:     <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H14v-5h-4v5H4a1 1 0 01-1-1V9.5z"/>,
    search:   <><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></>,
    compass:  <><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></>,
    drops:    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0L12 2.69z"/>,
    hanger:   <><path d="M12 4a2 2 0 010 4"/><path d="M12 8L3 17h18L12 8z"/></>,
    user:     <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    heart:    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>,
    arrow_l:  <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    chevron_r:<polyline points="9 18 15 12 9 6"/>,
    chevron_d:<polyline points="6 9 12 15 18 9"/>,
    plus:     <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    minus:    <line x1="5" y1="12" x2="19" y2="12"/>,
    x:        <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    check:    <polyline points="20 6 9 17 4 12"/>,
    edit:     <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    share:    <><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></>,
    grid:     <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
    bag:      <><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></>,
    camera:   <><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></>,
    link:     <><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></>,
    eye:      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    drag:     <><circle cx="9" cy="5" r="1" fill="currentColor"/><circle cx="15" cy="5" r="1" fill="currentColor"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="9" cy="19" r="1" fill="currentColor"/><circle cx="15" cy="19" r="1" fill="currentColor"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
      {d[n]}
    </svg>
  );
};

/* ── TOAST ────────────────────────────────────────────────────────────── */
const Toast = ({ msg, action, onAction, onGone }) => {
  useEffect(() => { const t = setTimeout(onGone, 3000); return () => clearTimeout(t); }, []);
  return (
    <div className="toast" style={{display:'flex',alignItems:'center',gap:12,maxWidth:360}}>
      <span>{msg}</span>
      {action && <button onClick={onAction} style={{background:'rgba(255,255,255,0.15)',border:'none',color:'var(--bg)',borderRadius:'var(--r-pill)',padding:'4px 10px',fontSize:12,fontWeight:500,cursor:'pointer',whiteSpace:'nowrap'}}>{action}</button>}
    </div>
  );
};

/* ── AFFILIATE INTERSTITIAL (Screen K) ────────────────────────────────── */
const AffiliateInterstitial = ({ partner, onDone }) => {
  const p = PARTNERS[partner] || { name: partner, abbr:'–' };
  useEffect(() => { const t = setTimeout(onDone, 1400); return () => clearTimeout(t); }, []);
  return (
    <div className="affiliate-overlay">
      <div style={{width:56,height:56,borderRadius:'var(--r-md)',background:'var(--primary)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:700,color:'var(--bg)',letterSpacing:'0.05em'}}>{p.abbr}</div>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:18,fontWeight:500,color:'var(--text-1)',marginBottom:8}}>Taking you to {p.name}</div>
        <div style={{fontSize:14,fontWeight:300,color:'var(--text-2)',lineHeight:1.6,maxWidth:280}}>Prices and availability are set by {p.name}. We'll remember this piece in your closet.</div>
      </div>
      <div className="spinner"/>
      <div style={{fontSize:11,fontWeight:300,color:'var(--text-3)',textAlign:'center',marginTop:8,maxWidth:260}}>Drippr. may earn a small commission. Never costs you more.</div>
    </div>
  );
};

/* ── SPLASH ───────────────────────────────────────────────────────────── */
const Splash = ({ onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 1600); return () => clearTimeout(t); }, []);
  return (
    <div className="splash" style={{width:'100%',height:'100%'}}>
      <span style={{fontWeight:600,fontSize:38,color:'var(--bg)',letterSpacing:'-0.5px'}}>Drippr.</span>
    </div>
  );
};

/* ── ONBOARDING V2 ────────────────────────────────────────────────────── */
const SLIDE_DATA = [
  { line1:'Curated fashion,', italic:'exactly', line2:'your taste.', sub:'Shaped by creators who dress with intention.', img:'https://picsum.photos/seed/ob1p/600/750', img2:'https://picsum.photos/seed/ob1b/300/375', label:'DROP 014 · AUTUMN LAYERS', creator:'curated by @priyamalhotra', layout:'cover' },
  { line1:'Drops that move', italic:'fast.', line2:'Pieces that stay.', sub:'Limited edits from a private circle of stylists.', img:'https://picsum.photos/seed/ob2p/600/750', img2:'https://picsum.photos/seed/ob2b/300/300', img3:'https://picsum.photos/seed/ob2c/300/300', label:null, layout:'grid' },
  { line1:'Your closet,', italic:'finally', line2:'in one place.', sub:'Save from anywhere. Shop where you already do.', img:'https://picsum.photos/seed/ob3p/500/625', img2:'https://picsum.photos/seed/ob3b/380/475', img3:'https://picsum.photos/seed/ob3c/300/375', label:null, layout:'collage' },
];

const OnboardingV2 = ({ onDone }) => {
  const [slide, setSlide] = useState(0);
  const [ts, setTs] = useState(null);
  const s = SLIDE_DATA[slide];
  const next = () => slide < 2 ? setSlide(v => v+1) : onDone();

  const ImageBlock = () => {
    if (s.layout === 'cover') return (
      <div style={{position:'relative',borderRadius:'var(--r-xl)',overflow:'hidden',border:'1px solid var(--border)'}}>
        <img key={slide} src={s.img} alt="" className="ken-burns" style={{width:'100%',aspectRatio:'4/5',objectFit:'cover',objectPosition:'center 30%'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(31,61,43,0.78) 0%, rgba(31,61,43,0) 60%)'}}/>
        <div style={{position:'absolute',top:14,left:14,fontSize:10,fontWeight:600,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(245,239,230,0.8)',background:'rgba(31,61,43,0.45)',backdropFilter:'blur(6px)',borderRadius:'var(--r-pill)',padding:'4px 10px'}}>{s.label}</div>
        <div style={{position:'absolute',bottom:14,right:14,fontSize:11,fontWeight:400,color:'var(--bg)',background:'rgba(31,61,43,0.55)',backdropFilter:'blur(8px)',borderRadius:'var(--r-pill)',padding:'5px 12px'}}>curated by @priyamalhotra</div>
        <div className="fraunces" key={`img-h-${slide}`} style={{position:'absolute',bottom:52,left:20,fontSize:'clamp(26px,4vw,38px)',color:'var(--bg)',lineHeight:1.05,letterSpacing:'-0.02em',animation:'slideUpIn 300ms ease-out both'}}>{s.line1}</div>
      </div>
    );
    if (s.layout === 'grid') return (
      <div style={{display:'grid',gridTemplateColumns:'60% 1fr',gap:8}}>
        <div style={{borderRadius:'var(--r-xl)',overflow:'hidden'}}>
          <img key={slide} src={s.img} alt="" className="ken-burns" style={{width:'100%',aspectRatio:'3/4',objectFit:'cover'}}/>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <div style={{borderRadius:'var(--r-lg)',overflow:'hidden',flex:1}}>
            <img src={s.img2} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
          </div>
          <div style={{borderRadius:'var(--r-lg)',overflow:'hidden',flex:1}}>
            <img src={s.img3} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
          </div>
        </div>
      </div>
    );
    // collage
    return (
      <div style={{position:'relative',height:260,margin:'0 8px'}}>
        <div style={{position:'absolute',bottom:0,left:'8%',width:'60%',borderRadius:'var(--r-lg)',overflow:'hidden',border:'1px solid var(--border)',zIndex:1}}>
          <img src={s.img} alt="" style={{width:'100%',aspectRatio:'3/4',objectFit:'cover'}}/>
        </div>
        <div style={{position:'absolute',top:0,left:'2%',width:'42%',borderRadius:'var(--r-lg)',overflow:'hidden',border:'1px solid var(--border)',zIndex:2,transform:'rotate(-3deg)'}}>
          <img src={s.img2} alt="" style={{width:'100%',aspectRatio:'4/5',objectFit:'cover'}}/>
        </div>
        <div style={{position:'absolute',top:10,right:'2%',width:'34%',borderRadius:'var(--r-lg)',overflow:'hidden',border:'1px solid var(--border)',zIndex:3,transform:'rotate(4deg)'}}>
          <img src={s.img3} alt="" style={{width:'100%',aspectRatio:'3/4',objectFit:'cover'}}/>
        </div>
      </div>
    );
  };

  const ContentBlock = ({ desktop }) => (
    <div style={desktop ? {} : {}}>
      {desktop && (
        <>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
            <span style={{fontWeight:600,fontSize:20,color:'var(--primary)'}}>Drippr.</span>
            <button onClick={onDone} style={{background:'none',border:'none',fontSize:13,color:'var(--text-2)',cursor:'pointer'}}>Skip</button>
          </div>
          <div style={{height:'0.5px',background:'var(--border)',marginBottom:32}}/>
        </>
      )}
      <div style={{fontSize:11,fontWeight:500,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--accent)',marginBottom:14}}>BY INVITATION · NEW MEMBERS WEEKLY</div>
      <div key={`h-${slide}`} className="slide-up">
        <h1 className="fraunces" style={{fontSize:'clamp(28px,3.5vw,42px)',color:'var(--primary)',lineHeight:1.0,letterSpacing:'-0.02em',marginBottom:10}}>
          {s.layout !== 'cover' && <>{s.line1}<br/></>}
          <em style={{fontStyle:'italic',color:'var(--primary-hover)'}}>{s.italic}</em>{' '}{s.line2}
        </h1>
        <p style={{fontSize:15,fontWeight:300,color:'var(--text-2)',lineHeight:1.6,marginBottom:24}}>{s.sub}</p>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:28}}>
        {[0,1,2].map(i => (
          <div key={i} className="prog-bar-track" onClick={() => setSlide(i)} style={{cursor:'pointer'}}>
            <div className={`prog-bar-fill ${i < slide ? 'done' : i === slide ? 'active' : ''}`}/>
          </div>
        ))}
        <span style={{fontSize:11,color:'var(--text-3)',marginLeft:6}}>Step {slide+1} of 3</span>
      </div>
      <button className="btn-primary" style={{maxWidth:desktop?320:undefined}} onClick={next}>{slide < 2 ? 'Continue' : 'Get started'}</button>
      <button onClick={onDone} style={{background:'none',border:'none',color:'var(--text-2)',fontSize:14,marginTop:14,cursor:'pointer',display:'block',textAlign:desktop?'left':'center'}}>Continue as guest</button>
    </div>
  );

  return (
    <div className="ob-container" onTouchStart={e=>setTs(e.touches[0].clientX)} onTouchEnd={e=>{if(ts!==null&&ts-e.changedTouches[0].clientX>60)next();setTs(null);}}>
      {/* Desktop: side-by-side */}
      <div className="ob-image-col ob-desktop-only" style={{padding:'48px 48px 48px 80px',display:'flex',alignItems:'center'}}>
        <div style={{width:'100%',maxWidth:480}}><ImageBlock/></div>
      </div>
      <div className="ob-content-col ob-desktop-only">
        <ContentBlock desktop={true}/>
      </div>

      {/* Mobile: stacked */}
      <div className="ob-mobile-only" style={{flexDirection:'column',height:'100%'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 20px 12px'}}>
          <span style={{fontWeight:600,fontSize:18,color:'var(--primary)'}}>Drippr.</span>
          <button onClick={onDone} style={{background:'none',border:'none',fontSize:13,color:'var(--text-2)',cursor:'pointer'}}>Skip</button>
        </div>
        <div style={{height:'0.5px',background:'var(--border)',margin:'0 20px 16px'}}/>
        <div style={{padding:'0 20px',flex:1,overflow:'hidden'}}>
          <ImageBlock/>
        </div>
        <div style={{padding:'16px 20px 24px',paddingBottom:'calc(24px + env(safe-area-inset-bottom))'}}>
          <ContentBlock desktop={false}/>
        </div>
      </div>
    </div>
  );
};

/* ── SHOP BUTTON ──────────────────────────────────────────────────────── */
const ShopBtn = ({ partner, onShop, label }) => {
  const p = PARTNERS[partner] || { name: partner || 'Partner', abbr:'–' };
  return (
    <button className="btn-shop" onClick={() => onShop(partner)}>
      <span style={{width:24,height:24,borderRadius:4,background:'rgba(255,255,255,0.18)',display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,letterSpacing:'0.04em',flexShrink:0}}>{p.abbr}</span>
      {label || `Shop on ${p.name} →`}
    </button>
  );
};

/* ── HOME V2 ──────────────────────────────────────────────────────────── */
const HomeV2 = ({ nav, saved, onSave, onShop }) => {
  const [dropFilter, setDropFilter] = useState('All');
  const dFilters = ['All','Tonight','This Week','Selling fast'];

  return (
    <div className="screen" style={{paddingBottom:32}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'18px 16px 14px',position:'sticky',top:0,background:'var(--bg)',zIndex:10,borderBottom:'1px solid var(--border)'}}>
        <span style={{fontWeight:600,fontSize:22,color:'var(--primary)'}}>Drippr.</span>
        <button style={{background:'none',border:'none',cursor:'pointer'}}><Ico n="search" size={22} color="var(--primary)"/></button>
      </div>

      {/* Featured Drop */}
      <div style={{margin:'20px 16px 32px'}}>
        <div className="card" style={{overflow:'hidden',borderRadius:'var(--r-xl)'}} onClick={() => nav('drop', DROPS[0])}>
          <div style={{position:'relative',aspectRatio:'16/9'}}>
            <img src={DROPS[0].wide} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(31,61,43,0.88) 0%, transparent 55%)'}}/>
            <div style={{position:'absolute',bottom:20,left:20,right:20}}>
              <div style={{fontSize:11,fontWeight:600,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--accent)',marginBottom:6}}>This week's drop</div>
              <div className="fraunces" style={{fontSize:'clamp(22px,3vw,34px)',fontStyle:'italic',color:'var(--bg)',lineHeight:1.1,marginBottom:8}}>{DROPS[0].title}</div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8}}>
                <span style={{fontSize:13,color:'var(--accent)'}}>by {DROPS[0].creator.handle}</span>
                <button onClick={e=>{e.stopPropagation();nav('drop',DROPS[0]);}} style={{background:'transparent',border:'1px solid var(--bg)',color:'var(--bg)',borderRadius:'var(--r-pill)',height:34,padding:'0 14px',fontSize:13,fontWeight:500,cursor:'pointer'}}>View Drop →</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Creator Picks */}
      <div style={{marginBottom:32}}>
        <div className="section-label" style={{padding:'0 16px'}}>Creator Picks</div>
        <div className="h-scroll" style={{padding:'0 16px'}}>
          {CREATORS.map(c => (
            <div key={c.id} className="card" style={{width:160,flexShrink:0,overflow:'hidden'}} onClick={() => nav('creator', c)}>
              <div style={{height:104,overflow:'hidden'}}><img src={c.img} alt={c.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
              <div style={{padding:'10px 12px'}}>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:3}}>
                  <img src={c.img} alt="" style={{width:20,height:20,borderRadius:'50%',objectFit:'cover'}}/>
                  <span style={{fontSize:13,fontWeight:500}}>{c.name.split(' ')[0]}</span>
                </div>
                <span style={{fontSize:12,fontWeight:300,color:'var(--text-3)'}}>{c.drops} drops</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* From Your Circle */}
      <div style={{marginBottom:32}}>
        <div className="section-label" style={{padding:'0 16px'}}>From Creators You Follow</div>
        <div className="h-scroll" style={{padding:'0 16px'}}>
          {DROPS.map(drop => (
            <div key={drop.id} className="card" style={{width:280,flexShrink:0,overflow:'hidden',borderRadius:'var(--r-xl)'}} onClick={() => nav('drop', drop)}>
              <div style={{aspectRatio:'16/9',position:'relative',overflow:'hidden'}}>
                <img src={drop.wide} alt={drop.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(31,61,43,0.75) 0%, transparent 50%)'}}/>
                <div style={{position:'absolute',bottom:12,left:12,right:12}}>
                  <div style={{fontSize:13,fontWeight:500,color:'var(--bg)',marginBottom:2}}>{drop.title}</div>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    <img src={drop.creator.img} alt="" style={{width:16,height:16,borderRadius:'50%',objectFit:'cover'}}/>
                    <span style={{fontSize:11,color:'var(--accent)'}}>{drop.creator.handle}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending */}
      <div style={{marginBottom:32}}>
        <div className="section-label" style={{padding:'0 16px'}}>Trending Now</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,padding:'0 16px'}}>
          {TRENDING.slice(0,4).map((item,i) => (
            <div key={item.id} className="card" style={{overflow:'hidden'}} onClick={() => nav('product', PRODUCTS[i])}>
              <div style={{aspectRatio:'3/4',position:'relative',overflow:'hidden'}}>
                <img src={item.img} alt={item.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(31,61,43,0.72) 0%, transparent 50%)'}}/>
                <div style={{position:'absolute',bottom:10,left:10,right:10}}>
                  <div style={{fontSize:13,fontWeight:500,color:'var(--bg)',marginBottom:1}}>{item.name}</div>
                  <div style={{fontSize:12,fontWeight:300,color:'var(--accent)'}}>₹{item.price.toLocaleString()}</div>
                </div>
                <button onClick={e=>{e.stopPropagation();onSave(item.id);}} style={{position:'absolute',top:8,right:8,width:30,height:30,borderRadius:'50%',background:'rgba(250,247,241,0.88)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <Ico n="heart" size={14} color={saved.includes(item.id)?'#A04A43':'var(--text-2)'} sw={saved.includes(item.id)?0:1.5}/>
                </button>
              </div>
              <div style={{padding:'6px 10px 8px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <span className="partner-badge">{PARTNERS[item.partner]?.abbr}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Still Shoppable */}
      <div style={{marginBottom:32}}>
        <div className="section-label" style={{padding:'0 16px'}}>Still Shoppable</div>
        <div className="h-scroll" style={{padding:'0 16px'}}>
          {PRODUCTS.slice(0,5).map(p => (
            <div key={p.id} className="card" style={{width:140,flexShrink:0,overflow:'hidden'}} onClick={() => nav('product', p)}>
              <div style={{height:100,overflow:'hidden'}}><img src={p.img} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
              <div style={{padding:'8px 10px 10px'}}>
                <div style={{fontSize:12,fontWeight:500,color:'var(--text-1)',marginBottom:2,lineHeight:1.3}}>{p.name}</div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:12,fontWeight:500,color:'var(--primary)'}}>₹{p.price.toLocaleString()}</span>
                  <button onClick={e=>{e.stopPropagation();onShop(p.partner);}} style={{background:'none',border:'none',fontSize:11,color:'var(--primary)',fontWeight:500,cursor:'pointer',padding:0}}>Shop →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Limited Drops */}
      <div style={{marginBottom:32}}>
        <div className="section-label" style={{padding:'0 16px'}}>Limited Drops</div>
        <div className="h-scroll" style={{padding:'0 16px',marginBottom:14}}>
          {dFilters.map(f => <button key={f} className={`btn-chip${dropFilter===f?' active':''}`} onClick={() => setDropFilter(f)}>{f}</button>)}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,padding:'0 16px'}}>
          {DROPS.map(drop => (
            <div key={drop.id} className="card" style={{overflow:'hidden'}} onClick={() => nav('drop', drop)}>
              <div style={{aspectRatio:'3/4',position:'relative',overflow:'hidden'}}>
                <img src={drop.img} alt={drop.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(31,61,43,0.75) 0%, transparent 55%)'}}/>
                <div style={{position:'absolute',bottom:10,left:10,right:10}}>
                  <div style={{fontSize:13,fontWeight:500,color:'var(--bg)',lineHeight:1.3,marginBottom:2}}>{drop.title}</div>
                  <div style={{fontSize:11,fontWeight:300,color:'var(--accent)'}}>{drop.pieces} pieces · <span style={{color:'#E8A89A'}}>{drop.left} left</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seasonal Banner */}
      <div style={{margin:'0 16px',background:'var(--primary)',borderRadius:'var(--r-xl)',padding:'28px 24px',display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer'}} onClick={() => nav('drop', DROPS[2])}>
        <div>
          <div className="fraunces" style={{fontSize:'clamp(22px,3vw,36px)',color:'var(--bg)',lineHeight:1.1,marginBottom:16}}>The Monsoon<br/>Wardrobe.</div>
          <button style={{background:'none',border:'none',color:'var(--accent)',fontSize:14,fontWeight:500,cursor:'pointer',padding:0}}>Shop Edit →</button>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {PRODUCTS.slice(0,3).map(p => (
            <div key={p.id} style={{width:64,height:64,borderRadius:'var(--r-md)',overflow:'hidden',border:'1px solid rgba(255,255,255,0.15)'}}>
              <img src={p.img} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── DISCOVER ─────────────────────────────────────────────────────────── */
const DiscoverScreen = ({ nav, saved, onSave }) => {
  const [cat, setCat] = useState('Minimal');
  const cats = ['Minimal','Street-luxe','Occasion','Casual','Elevated basics','Workwear','Travel','Party','Under ₹5k','Under ₹10k','Premium'];
  const allItems = [...TRENDING, ...TRENDING.map((t,i) => ({...t, id:t.id+200, img:`https://picsum.photos/seed/disc${i+1}/320/${360+(i*15)}`}))];
  return (
    <div className="screen">
      <div style={{padding:'18px 16px 0',position:'sticky',top:0,background:'var(--bg)',zIndex:10}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <h2 style={{fontSize:22,fontWeight:600,color:'var(--primary)'}}>Discover</h2>
          <button style={{background:'none',border:'none',cursor:'pointer'}}><Ico n="search" size={22} color="var(--primary)"/></button>
        </div>
        <div className="h-scroll" style={{paddingBottom:12,borderBottom:'1px solid var(--border)'}}>
          {cats.map(c => <button key={c} className={`btn-chip${cat===c?' active':''}`} onClick={() => setCat(c)}>{c}</button>)}
        </div>
      </div>
      <div style={{columns:2,columnGap:10,padding:'12px 16px 24px'}}>
        {allItems.map((item,i) => (
          <div key={item.id} style={{breakInside:'avoid',marginBottom:10}}>
            <div className="card" style={{overflow:'hidden'}} onClick={() => nav('product', PRODUCTS[i % PRODUCTS.length])}>
              <div style={{position:'relative'}}>
                <img src={item.img} alt={item.name} style={{width:'100%',display:'block'}}/>
                <button onClick={e=>{e.stopPropagation();onSave(item.id);}} style={{position:'absolute',top:8,right:8,width:30,height:30,borderRadius:'50%',background:'rgba(250,247,241,0.9)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <Ico n="plus" size={14} color="var(--primary)" sw={2}/>
                </button>
              </div>
              <div style={{padding:'9px 12px 11px'}}>
                <div style={{fontSize:13,fontWeight:500,color:'var(--text-1)',marginBottom:2}}>{item.name}</div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:12,fontWeight:300,color:'var(--text-2)'}}>₹{item.price.toLocaleString()}</span>
                  <span className="partner-badge">{PARTNERS[item.partner]?.abbr}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── DROPS LIST ───────────────────────────────────────────────────────── */
const DropsScreen = ({ nav }) => (
  <div className="screen">
    <div style={{padding:'18px 16px 14px',borderBottom:'1px solid var(--border)'}}>
      <h2 style={{fontSize:22,fontWeight:600,color:'var(--primary)'}}>Drops</h2>
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:14,padding:16}}>
      {DROPS.map(drop => (
        <div key={drop.id} className="card" style={{overflow:'hidden',display:'flex'}} onClick={() => nav('drop', drop)}>
          <div style={{width:120,height:160,flexShrink:0,overflow:'hidden'}}>
            <img src={drop.img} alt={drop.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
          </div>
          <div style={{flex:1,padding:'16px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
            <div>
              <div style={{fontSize:11,fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'var(--accent)',marginBottom:6}}>Drop · {drop.pieces} pieces</div>
              <div className="fraunces" style={{fontSize:20,lineHeight:1.15,color:'var(--primary)',marginBottom:6}}>{drop.title}</div>
              <div style={{fontSize:13,fontWeight:300,color:'var(--text-2)',lineHeight:1.5}}>{drop.tagline}</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8,marginTop:10}}>
              <img src={drop.creator.img} alt="" style={{width:20,height:20,borderRadius:'50%',objectFit:'cover'}}/>
              <span style={{fontSize:12,color:'var(--text-2)'}}>by {drop.creator.name}</span>
              <span style={{marginLeft:'auto',fontSize:11,color:'var(--error)',fontWeight:500}}>{drop.left} left</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ── PRODUCT DETAIL V2 (Affiliate) ────────────────────────────────────── */
const ProductDetailV2 = ({ product, nav, onShop, onSave, saved }) => {
  const [size, setSize] = useState(null);
  const [colorIdx, setColorIdx] = useState(0);
  const [openSec, setOpenSec] = useState(null);
  if (!product) return null;
  const p = PARTNERS[product.partner] || { name:'Partner', abbr:'–' };
  const sections = [
    { k:'styling', label:'Styling notes',    body:'Works beautifully with relaxed trousers or a wrap skirt. Style open over a bralette for evening, or buttoned for daytime.' },
    { k:'size',    label:'Size guide',        body:'XS fits 32-34 bust, S fits 34-36, M fits 36-38, L fits 38-40. Recommend sizing up for a relaxed fit.' },
    { k:'ship',    label:'Shipping & returns',body:`Shipping policy set by ${p.name}. Typically 3-5 days. Returns as per their policy.` },
  ];
  return (
    <div className="screen" style={{paddingBottom:90}}>
      <div style={{position:'relative',aspectRatio:'4/5'}}>
        <img src={product.img} alt={product.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        <button onClick={() => nav('back')} style={{position:'absolute',top:16,left:16,width:40,height:40,borderRadius:'var(--r-pill)',background:'rgba(250,247,241,0.92)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <Ico n="arrow_l" size={20} color="var(--primary)"/>
        </button>
        <div style={{position:'absolute',bottom:14,left:'50%',transform:'translateX(-50%)',display:'flex',gap:6}}>
          {[0,1,2,3].map(i => <div key={i} style={{width:i===0?18:7,height:7,borderRadius:'var(--r-pill)',background:i===0?'var(--primary)':'var(--accent)'}}/>)}
        </div>
      </div>
      <div style={{padding:'22px 16px'}}>
        <h1 style={{fontSize:22,fontWeight:600,color:'var(--text-1)',marginBottom:6,lineHeight:1.2}}>{product.name}</h1>
        <div style={{fontSize:20,fontWeight:300,color:'var(--primary)',marginBottom:22}}>₹{product.price.toLocaleString()}</div>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:12,color:'var(--text-2)',marginBottom:10}}>Select size</div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {product.sizes.map(s => (
              <button key={s} onClick={() => setSize(s)} style={{height:36,minWidth:48,borderRadius:'var(--r-pill)',border:`1px solid ${size===s?'var(--primary)':'var(--border)'}`,background:size===s?'var(--primary)':'var(--surface)',color:size===s?'var(--bg)':'var(--text-1)',fontSize:13,fontWeight:500,cursor:'pointer',padding:'0 14px',transition:'all 180ms'}}>{s}</button>
            ))}
          </div>
        </div>
        <div style={{marginBottom:24}}>
          <div style={{fontSize:12,color:'var(--text-2)',marginBottom:10}}>Color</div>
          <div style={{display:'flex',gap:10}}>
            {product.colors.map((c,i) => <div key={c} onClick={() => setColorIdx(i)} style={{width:28,height:28,borderRadius:'50%',background:c,outline:colorIdx===i?'2px solid var(--primary)':'none',outlineOffset:2,cursor:'pointer',border:'1px solid var(--border)'}}/>)}
          </div>
        </div>

        {/* Affiliate shop section */}
        <div style={{marginBottom:8}}>
          <ShopBtn partner={product.partner} onShop={onShop}/>
        </div>
        {product.altPartners?.length > 0 && (
          <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap',marginBottom:8}}>
            <span style={{fontSize:12,color:'var(--text-2)'}}>Also on:</span>
            {product.altPartners.map(ap => (
              <button key={ap.key} className="btn-chip sm" onClick={() => onShop(ap.key)}>{PARTNERS[ap.key]?.name} ₹{ap.price.toLocaleString()}</button>
            ))}
          </div>
        )}
        <div style={{fontSize:11,fontWeight:300,color:'var(--text-3)',marginBottom:18}}>Price updated 2h ago</div>

        <button className="btn-secondary" onClick={() => onSave(product.id)} style={{marginBottom:20}}>
          <Ico n="heart" size={16} color={saved.includes(product.id)?'#A04A43':'var(--primary)'} sw={saved.includes(product.id)?0:1.5}/>
          {saved.includes(product.id) ? 'Saved to closet' : 'Save to closet'}
        </button>

        <div style={{marginTop:4}}>
          {sections.map(sec => (
            <div key={sec.k} style={{borderBottom:'1px solid var(--border)'}}>
              <button onClick={() => setOpenSec(openSec===sec.k?null:sec.k)} style={{width:'100%',background:'none',border:'none',padding:'15px 0',display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer',fontSize:15,fontWeight:500,color:'var(--text-1)'}}>
                {sec.label}
                <div style={{transform:openSec===sec.k?'rotate(180deg)':'none',transition:'transform 200ms'}}><Ico n="chevron_d" size={17} color="var(--text-2)"/></div>
              </button>
              {openSec===sec.k && <div style={{paddingBottom:16,fontSize:14,color:'var(--text-2)',lineHeight:1.65}}>{sec.body}</div>}
            </div>
          ))}
        </div>
      </div>
      <div style={{position:'fixed',bottom:64,left:0,right:0,background:'var(--surface)',borderTop:'1px solid var(--border)',padding:'12px 16px',zIndex:50}}>
        <ShopBtn partner={product.partner} onShop={onShop}/>
      </div>
    </div>
  );
};

/* ── DROP DETAIL V2 ───────────────────────────────────────────────────── */
const DropDetailV2 = ({ drop, nav, onShop }) => {
  const [expanded, setExpanded] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  if (!drop) return null;
  return (
    <div className="screen" style={{paddingBottom:90}}>
      <div style={{position:'relative',aspectRatio:'4/5',maxHeight:520}}>
        <img src={drop.img} alt={drop.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        <button onClick={() => nav('back')} style={{position:'absolute',top:16,left:16,width:40,height:40,borderRadius:'var(--r-pill)',background:'rgba(250,247,241,0.92)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <Ico n="arrow_l" size={20} color="var(--primary)"/>
        </button>
      </div>
      <div style={{padding:'22px 16px 0'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
          <img src={drop.creator.img} alt="" style={{width:36,height:36,borderRadius:'50%',objectFit:'cover'}}/>
          <span style={{fontSize:14,color:'var(--text-2)'}}>by {drop.creator.name}</span>
          <button style={{marginLeft:'auto',background:'transparent',border:'1px solid var(--primary)',color:'var(--primary)',borderRadius:'var(--r-pill)',height:32,padding:'0 16px',fontSize:13,fontWeight:500,cursor:'pointer'}}>Follow</button>
        </div>
        <h1 className="fraunces" style={{fontSize:30,color:'var(--text-1)',marginBottom:8,lineHeight:1.1}}>{drop.title}</h1>
        <p style={{fontSize:16,fontWeight:300,color:'var(--text-2)',marginBottom:12,lineHeight:1.5}}>{drop.tagline}</p>
        <span style={{display:'inline-block',background:'var(--accent)',color:'var(--primary)',borderRadius:'var(--r-pill)',padding:'5px 14px',fontSize:12,fontWeight:500}}>{drop.pieces} pieces · Limited run</span>
      </div>
      <div style={{padding:'20px 16px',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)',margin:'20px 0 0'}}>
        <p style={{fontSize:15,color:'var(--text-2)',lineHeight:1.7}}>{expanded?'Each piece was sourced with one question: would you wear this on the most beautiful, unremarkable Tuesday of your life? Not a statement piece — a piece that makes getting dressed feel like something to look forward to. Natural linen, relaxed silhouettes, a palette that works with light.':'Each piece was sourced with one question: would you wear this on the most beautiful, unremarkable Tuesday?'}
          {' '}<button onClick={() => setExpanded(e=>!e)} style={{background:'none',border:'none',color:'var(--primary)',fontSize:15,fontWeight:500,cursor:'pointer',padding:0}}>{expanded?'Show less':'Read more'}</button>
        </p>
      </div>
      <div style={{padding:'22px 16px'}}>
        <div className="section-label">Items in this drop</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          {drop.products.map(prod => (
            <div key={prod.id} className="card" style={{overflow:'hidden'}} onClick={() => nav('product', prod)}>
              <div style={{aspectRatio:'1/1',overflow:'hidden'}}><img src={prod.img} alt={prod.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
              <div style={{padding:'10px 12px'}}>
                <div style={{fontSize:13,fontWeight:500,color:'var(--text-1)',marginBottom:3,lineHeight:1.3}}>{prod.name}</div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:13,fontWeight:600,color:'var(--primary)'}}>₹{prod.price.toLocaleString()}</span>
                  <span className="partner-badge" style={{fontSize:10}}>{PARTNERS[prod.partner]?.abbr}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop:16,fontSize:13,fontWeight:300,color:'var(--text-2)',textAlign:'center'}}>{drop.shopClicks} people shopped from this drop</div>
      </div>
      <div style={{position:'fixed',bottom:64,left:0,right:0,background:'var(--surface)',borderTop:'1px solid var(--border)',padding:'12px 16px',zIndex:50}}>
        <button className="btn-shop" onClick={() => setSheetOpen(true)}>Shop the full drop →</button>
      </div>
      {/* Shop all sheet */}
      {sheetOpen && (
        <div style={{position:'fixed',inset:0,zIndex:200}} onClick={() => setSheetOpen(false)}>
          <div style={{position:'absolute',bottom:0,left:0,right:0,background:'var(--surface)',borderRadius:'var(--r-xl) var(--r-xl) 0 0',borderTop:'1px solid var(--border)',padding:'20px 16px 32px',maxHeight:'70vh',overflowY:'auto'}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:16,fontWeight:600,marginBottom:16}}>Shop all pieces</div>
            {drop.products.slice(0,4).map(prod => (
              <div key={prod.id} style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
                <div style={{width:52,height:52,borderRadius:'var(--r-md)',overflow:'hidden',flexShrink:0}}><img src={prod.img} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,marginBottom:2}}>{prod.name}</div><div style={{fontSize:12,color:'var(--text-2)'}}>₹{prod.price.toLocaleString()}</div></div>
                <button onClick={() => { setSheetOpen(false); onShop(prod.partner); }} style={{background:'var(--primary)',color:'var(--bg)',border:'none',borderRadius:'var(--r-pill)',height:32,padding:'0 14px',fontSize:12,fontWeight:500,cursor:'pointer',whiteSpace:'nowrap'}}>Shop →</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── CLOSET SCREEN (Screen A) ─────────────────────────────────────────── */
const ClosetScreen = ({ nav, closet, onAddPiece }) => {
  const [cat, setCat] = useState('All');
  const [longPressed, setLongPressed] = useState(null);
  const cats = ['All','Tops','Bottoms','Layers','Dresses','Sets','Acc.'];
  const filtered = cat === 'All' ? closet : closet.filter(p => p.category === cat);
  const lpTimer = useRef(null);

  const handlePressStart = (id) => { lpTimer.current = setTimeout(() => setLongPressed(id), 500); };
  const handlePressEnd = () => { clearTimeout(lpTimer.current); };

  return (
    <div className="screen">
      <div style={{padding:'18px 16px 0',position:'sticky',top:0,background:'var(--bg)',zIndex:10}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <h2 style={{fontSize:22,fontWeight:600,color:'var(--primary)'}}>My Closet</h2>
          <div style={{display:'flex',gap:10}}>
            <button onClick={() => nav('build-drop')} style={{background:'none',border:'1px solid var(--primary)',color:'var(--primary)',borderRadius:'var(--r-pill)',height:34,padding:'0 14px',fontSize:13,fontWeight:500,cursor:'pointer'}}>Build a drop</button>
            <button onClick={onAddPiece} style={{background:'var(--primary)',color:'var(--bg)',border:'none',borderRadius:'var(--r-pill)',width:34,height:34,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><Ico n="plus" size={16} color="var(--bg)"/></button>
          </div>
        </div>
        <div className="h-scroll" style={{paddingBottom:12,borderBottom:'1px solid var(--border)'}}>
          {cats.map(c => <button key={c} className={`btn-chip${cat===c?' active':''}`} onClick={() => setCat(c)}>{c}</button>)}
        </div>
      </div>

      <div className="closet-grid">
        {filtered.map(piece => (
          <div key={piece.id} className="card" style={{overflow:'hidden',position:'relative'}}
            onMouseDown={() => handlePressStart(piece.id)} onMouseUp={handlePressEnd}
            onTouchStart={() => handlePressStart(piece.id)} onTouchEnd={handlePressEnd}>
            <div style={{aspectRatio:'3/4',overflow:'hidden',position:'relative'}}>
              <img src={piece.img} alt={piece.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              {piece.partner && (
                <div style={{position:'absolute',bottom:8,left:8}}>
                  <span className="partner-badge" style={{fontSize:10,background:'rgba(250,247,241,0.9)'}}>{PARTNERS[piece.partner]?.abbr}</span>
                </div>
              )}
            </div>
            <div style={{padding:'8px 10px 10px'}}>
              <div style={{fontSize:12,fontWeight:500,color:'var(--text-1)',marginBottom:2,lineHeight:1.3}}>{piece.name}</div>
              <div style={{fontSize:11,fontWeight:300,color:'var(--text-3)'}}>{piece.wears} wears · {piece.lastWorn}</div>
            </div>
          </div>
        ))}
        {/* Add piece card */}
        <div style={{border:'1px dashed var(--border)',borderRadius:'var(--r-lg)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8,cursor:'pointer',minHeight:180,background:'transparent'}} onClick={onAddPiece}>
          <Ico n="plus" size={22} color="var(--text-3)"/>
          <span style={{fontSize:12,color:'var(--text-3)'}}>Add piece</span>
        </div>
      </div>

      {/* Long-press menu */}
      {longPressed && (
        <div style={{position:'fixed',inset:0,background:'rgba(31,61,43,0.3)',zIndex:200,display:'flex',alignItems:'flex-end'}} onClick={() => setLongPressed(null)}>
          <div style={{width:'100%',background:'var(--surface)',borderRadius:'var(--r-xl) var(--r-xl) 0 0',padding:'20px 16px 36px'}} onClick={e=>e.stopPropagation()}>
            <div style={{width:36,height:4,borderRadius:'var(--r-pill)',background:'var(--border)',margin:'0 auto 20px'}}/>
            {['Add to a drop','Log wear','Edit piece','Move to archive','Copy shop link'].map(item => (
              <button key={item} onClick={() => { if(item==='Add to a drop') nav('build-drop'); setLongPressed(null); }} style={{width:'100%',background:'none',border:'none',padding:'14px 0',textAlign:'left',fontSize:15,color:item==='Move to archive'?'var(--error)':'var(--text-1)',cursor:'pointer',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:10}}>
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── ADD PIECE (Screen B) ─────────────────────────────────────────────── */
const AddPiece = ({ nav, onAdd }) => {
  const [path, setPath] = useState(null); // 'link' | 'photo' | 'discover'
  const [url, setUrl] = useState('');
  const [fetching, setFetching] = useState(false);
  const [preview, setPreview] = useState(null);
  const [source, setSource] = useState(null);
  const partnerLogos = ['Myntra','Ajio','Nykaa','Zara','Uniqlo','H&M'];

  const simulateFetch = () => {
    setFetching(true);
    setTimeout(() => {
      setPreview({ name:'Linen Shirt (Sand)', price:4200, img:'https://picsum.photos/seed/ap1/300/375', partner:'myntra', sizes:['XS','S','M','L'], color:'#C8B89A' });
      setFetching(false);
    }, 1200);
  };

  if (!path) return (
    <div className="screen" style={{padding:0}}>
      <div style={{padding:'18px 16px 14px',display:'flex',alignItems:'center',gap:12,borderBottom:'1px solid var(--border)'}}>
        <button onClick={() => nav('back')} style={{background:'none',border:'none',cursor:'pointer'}}><Ico n="arrow_l" size={22} color="var(--primary)"/></button>
        <h2 style={{fontSize:20,fontWeight:600,color:'var(--primary)'}}>Add a piece</h2>
      </div>
      <div style={{padding:'24px 16px',display:'flex',flexDirection:'column',gap:12}}>
        {[
          { key:'link',     icon:'link',    label:'Paste a link',      sub:'From Myntra, Ajio, Zara or anywhere', primary:true },
          { key:'photo',    icon:'camera',  label:'Upload a photo',    sub:'For thrifted, gifted, or offline pieces', primary:false },
          { key:'discover', icon:'compass', label:'From Discover',     sub:'Re-save from the Drippr. catalog', primary:false },
        ].map(opt => (
          <button key={opt.key} onClick={() => setPath(opt.key)} style={{background:opt.primary?'var(--primary)':'var(--surface)',border:`1px solid ${opt.primary?'var(--primary)':'var(--border)'}`,borderRadius:'var(--r-xl)',padding:'18px 20px',cursor:'pointer',display:'flex',alignItems:'center',gap:16,textAlign:'left'}}>
            <div style={{width:44,height:44,borderRadius:'var(--r-lg)',background:opt.primary?'rgba(255,255,255,0.15)':'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <Ico n={opt.icon} size={20} color={opt.primary?'var(--bg)':'var(--primary)'}/>
            </div>
            <div>
              <div style={{fontSize:15,fontWeight:500,color:opt.primary?'var(--bg)':'var(--text-1)',marginBottom:3}}>{opt.label}</div>
              <div style={{fontSize:13,fontWeight:300,color:opt.primary?'rgba(245,239,230,0.75)':'var(--text-2)'}}>{opt.sub}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  if (path === 'link') return (
    <div className="screen">
      <div style={{padding:'18px 16px 14px',display:'flex',alignItems:'center',gap:12,borderBottom:'1px solid var(--border)'}}>
        <button onClick={() => setPath(null)} style={{background:'none',border:'none',cursor:'pointer'}}><Ico n="arrow_l" size={22} color="var(--primary)"/></button>
        <h2 style={{fontSize:20,fontWeight:600,color:'var(--primary)'}}>Paste a link</h2>
      </div>
      <div style={{padding:'20px 16px'}}>
        <input className="input-field input-lg" value={url} onChange={e=>setUrl(e.target.value)} placeholder="Paste a Myntra, Ajio, or any product link" style={{marginBottom:16}}/>
        <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:24}}>
          {partnerLogos.map(p => (
            <div key={p} style={{fontSize:10,fontWeight:600,color:'var(--text-3)',letterSpacing:'0.05em'}}>{p.slice(0,2).toUpperCase()}</div>
          ))}
          <span style={{fontSize:12,color:'var(--text-3)'}}>+12 more</span>
        </div>
        {!preview && <button className="btn-primary" onClick={simulateFetch} disabled={!url && !fetching}>{fetching?'Fetching...':'Fetch product'}</button>}
        {fetching && <div style={{display:'flex',justifyContent:'center',padding:24}}><div className="spinner"/></div>}
        {preview && (
          <>
            <div className="card" style={{display:'flex',gap:14,padding:16,marginBottom:20}}>
              <div style={{width:80,height:100,borderRadius:'var(--r-md)',overflow:'hidden',flexShrink:0}}><img src={preview.img} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:500,marginBottom:4}}>{preview.name}</div>
                <div style={{fontSize:15,fontWeight:600,color:'var(--primary)',marginBottom:6}}>₹{preview.price.toLocaleString()}</div>
                <div style={{display:'flex',gap:6}}>{preview.sizes.slice(0,3).map(s => <span key={s} style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'var(--r-pill)',padding:'2px 8px',fontSize:11}}>{s}</span>)}</div>
                <div style={{marginTop:8}}><span className="partner-badge">{PARTNERS[preview.partner]?.name} · Shoppable</span></div>
              </div>
            </div>
            <button className="btn-primary" onClick={() => { onAdd({...preview, id:Date.now(), wears:0, category:'Tops', lastWorn:'Just added'}); nav('back'); }}>Add to closet</button>
          </>
        )}
      </div>
    </div>
  );

  if (path === 'photo') return (
    <div className="screen">
      <div style={{padding:'18px 16px 14px',display:'flex',alignItems:'center',gap:12,borderBottom:'1px solid var(--border)'}}>
        <button onClick={() => setPath(null)} style={{background:'none',border:'none',cursor:'pointer'}}><Ico n="arrow_l" size={22} color="var(--primary)"/></button>
        <h2 style={{fontSize:20,fontWeight:600,color:'var(--primary)'}}>Upload a photo</h2>
      </div>
      <div style={{padding:'20px 16px'}}>
        <div style={{border:'1.5px dashed var(--border)',borderRadius:'var(--r-xl)',padding:'48px 24px',textAlign:'center',marginBottom:20,cursor:'pointer'}}>
          <Ico n="camera" size={32} color="var(--text-3)"/>
          <div style={{marginTop:12,fontSize:14,color:'var(--text-2)'}}>Tap to upload or drag a photo</div>
          <div style={{fontSize:12,color:'var(--text-3)',marginTop:4}}>JPG, PNG — max 10MB</div>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:12,color:'var(--text-2)',marginBottom:8}}>Where is it from?</div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {['Store','Thrifted','Gifted','Inherited',"Don't remember"].map(s => (
              <button key={s} className={`vibe-chip${source===s?' selected':''}`} onClick={() => setSource(s)}>{s}</button>
            ))}
          </div>
        </div>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:12,color:'var(--text-2)',marginBottom:8}}>Piece name</div>
          <input className="input-field" placeholder="e.g. White Linen Shirt"/>
        </div>
        <button className="btn-primary" onClick={() => nav('back')}>Add to closet</button>
      </div>
    </div>
  );

  // 'discover' path
  return (
    <div className="screen">
      <div style={{padding:'18px 16px 14px',display:'flex',alignItems:'center',gap:12,borderBottom:'1px solid var(--border)'}}>
        <button onClick={() => setPath(null)} style={{background:'none',border:'none',cursor:'pointer'}}><Ico n="arrow_l" size={22} color="var(--primary)"/></button>
        <h2 style={{fontSize:20,fontWeight:600,color:'var(--primary)'}}>From Discover</h2>
      </div>
      <div style={{columns:2,columnGap:10,padding:'12px 16px'}}>
        {PRODUCTS.map(p => (
          <div key={p.id} style={{breakInside:'avoid',marginBottom:10}}>
            <div className="card" style={{overflow:'hidden'}} onClick={() => { onAdd({...p, wears:0, lastWorn:'Just added'}); nav('back'); }}>
              <img src={p.img} style={{width:'100%',aspectRatio:'3/4',objectFit:'cover'}}/>
              <div style={{padding:'8px 10px 10px'}}>
                <div style={{fontSize:12,fontWeight:500,marginBottom:2}}>{p.name}</div>
                <div style={{fontSize:11,color:'var(--text-2)'}}>₹{p.price.toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── DROP BUILDER (Screen G) ──────────────────────────────────────────── */
const DropBuilder = ({ nav, closet, onPublish }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [story, setStory] = useState('');
  const [vibes, setVibes] = useState([]);
  const [season, setSeason] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  const [selected, setSelected] = useState([]);
  const [addTab, setAddTab] = useState('closet');
  const [published, setPublished] = useState(false);
  const steps = ['Identity','Add Pieces','Style It'];
  const vibeOpts = ['Minimal','Workwear','Weekend','Monsoon','Travel','Evening','Festive','Layering','Elevated basics','Occasion'];
  const seasons = ['Summer','Monsoon','Winter','Transitional'];

  const toggleSelect = (piece) => {
    setSelected(s => s.find(p=>p.id===piece.id) ? s.filter(p=>p.id!==piece.id) : [...s, piece]);
  };

  if (published) return (
    <div style={{position:'fixed',inset:0,background:'var(--primary)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16,zIndex:300,padding:32,animation:'fadeIn 300ms ease-out'}}>
      <div style={{fontSize:14,fontWeight:300,color:'var(--bg)',letterSpacing:'0.05em',marginBottom:4}}>Your drop is live.</div>
      <div className="fraunces" style={{fontSize:28,fontStyle:'italic',color:'var(--accent)',textAlign:'center',lineHeight:1.1}}>{name || 'Untitled Drop'}</div>
      <div style={{display:'flex',gap:12,marginTop:16}}>
        <button style={{background:'transparent',border:'1px solid rgba(245,239,230,0.4)',color:'var(--bg)',borderRadius:'var(--r-pill)',height:40,padding:'0 20px',fontSize:13,fontWeight:500,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}><Ico n="share" size={16} color="var(--bg)"/>Share</button>
        <button onClick={() => nav('back')} style={{background:'transparent',border:'none',color:'rgba(245,239,230,0.65)',fontSize:13,cursor:'pointer'}}>View drop</button>
      </div>
    </div>
  );

  return (
    <div className="screen" style={{display:'flex',flexDirection:'column',minHeight:'100%'}}>
      <div style={{padding:'18px 16px 14px',display:'flex',alignItems:'center',gap:12,borderBottom:'1px solid var(--border)'}}>
        <button onClick={() => step>0?setStep(s=>s-1):nav('back')} style={{background:'none',border:'none',cursor:'pointer'}}><Ico n="arrow_l" size={22} color="var(--primary)"/></button>
        <h2 style={{fontSize:20,fontWeight:600,color:'var(--primary)'}}>Build a drop</h2>
      </div>

      {/* Progress */}
      <div style={{display:'flex',alignItems:'center',padding:'16px 20px'}}>
        {steps.map((s,i) => (
          <React.Fragment key={s}>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
              <div className="step-dot" style={{background:i<=step?'var(--primary)':'var(--border)'}}>
                {i<step ? <Ico n="check" size={13} color="var(--bg)"/> : <span style={{fontSize:11,fontWeight:600,color:i<=step?'var(--bg)':'var(--text-3)'}}>{i+1}</span>}
              </div>
              <span style={{fontSize:11,color:i<=step?'var(--primary)':'var(--text-3)',fontWeight:500}}>{s}</span>
            </div>
            {i<steps.length-1 && <div style={{flex:1,height:2,background:i<step?'var(--primary)':'var(--border)',margin:'0 4px',marginBottom:22,transition:'background 300ms'}}/>}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1 */}
      {step===0 && (
        <div style={{padding:'0 16px 100px'}}>
          <div style={{marginBottom:18}}>
            <input value={name} onChange={e=>setName(e.target.value)} className="input-field" style={{fontSize:20,fontWeight:600,height:56,borderRadius:'var(--r-md)'}} placeholder="Name your drop"/>
          </div>
          <div style={{marginBottom:18}}>
            <textarea value={story} onChange={e=>setStory(e.target.value)} className="textarea-field" rows={4} placeholder="What's the concept? Why these pieces together?"/>
          </div>
          <div style={{border:'1.5px dashed var(--border)',borderRadius:'var(--r-xl)',padding:'32px',textAlign:'center',marginBottom:20,cursor:'pointer'}}>
            <Ico n="camera" size={24} color="var(--text-3)"/>
            <div style={{fontSize:13,color:'var(--text-2)',marginTop:8}}>Upload cover image</div>
            <div style={{fontSize:12,color:'var(--text-3)',marginTop:2}}>or 16:9 from your first piece</div>
          </div>
          <div style={{marginBottom:18}}>
            <div style={{fontSize:12,color:'var(--text-2)',marginBottom:10}}>Vibe</div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {vibeOpts.map(v => <button key={v} className={`vibe-chip${vibes.includes(v)?' selected':''}`} onClick={() => setVibes(vs => vs.includes(v)?vs.filter(x=>x!==v):[...vs,v])}>{v}</button>)}
            </div>
          </div>
          <div style={{marginBottom:18}}>
            <div style={{fontSize:12,color:'var(--text-2)',marginBottom:10}}>Season</div>
            <div style={{display:'flex',gap:8}}>
              {seasons.map(s => <button key={s} className={`vibe-chip${season===s?' selected':''}`} onClick={() => setSeason(s===season?null:s)}>{s}</button>)}
            </div>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 0',borderTop:'1px solid var(--border)'}}>
            <div>
              <div style={{fontSize:14,fontWeight:500}}>Public drop</div>
              <div style={{fontSize:12,color:'var(--text-2)'}}>Anyone can discover this</div>
            </div>
            <div onClick={() => setIsPublic(v=>!v)} style={{width:44,height:26,borderRadius:'var(--r-pill)',background:isPublic?'var(--primary)':'var(--border)',cursor:'pointer',position:'relative',transition:'background 200ms'}}>
              <div style={{position:'absolute',top:3,left:isPublic?20:3,width:20,height:20,borderRadius:'50%',background:'var(--bg)',transition:'left 200ms'}}/>
            </div>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step===1 && (
        <>
          <div style={{display:'flex',borderBottom:'1px solid var(--border)',padding:'0 16px'}}>
            {['closet','discover','links'].map(t => (
              <button key={t} onClick={() => setAddTab(t)} style={{background:'none',border:'none',borderBottom:`2px solid ${addTab===t?'var(--primary)':'transparent'}`,padding:'12px 14px',fontSize:13,fontWeight:500,color:addTab===t?'var(--primary)':'var(--text-3)',cursor:'pointer',marginBottom:-1,textTransform:'capitalize'}}>
                {t==='closet'?'My Closet':t==='discover'?'Discover':'Paste Links'}
              </button>
            ))}
          </div>
          <div style={{flex:1,overflow:'auto'}}>
            {(addTab==='closet'?closet:PRODUCTS).length === 0 ? (
              <div style={{padding:32,textAlign:'center',color:'var(--text-3)'}}>No pieces yet</div>
            ) : (
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,padding:12}}>
                {(addTab==='closet'?closet:PRODUCTS).map(piece => {
                  const isSel = selected.find(p=>p.id===piece.id);
                  return (
                    <div key={piece.id} style={{position:'relative',borderRadius:'var(--r-md)',overflow:'hidden',cursor:'pointer',border:`2px solid ${isSel?'var(--primary)':'transparent'}`}} onClick={() => toggleSelect(piece)}>
                      <img src={piece.img} alt={piece.name} style={{width:'100%',aspectRatio:'1/1',objectFit:'cover'}}/>
                      {isSel && (
                        <div style={{position:'absolute',top:6,right:6,width:22,height:22,borderRadius:'50%',background:'var(--primary)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                          <Ico n="check" size={12} color="var(--bg)" sw={2.5}/>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {addTab==='links' && (
              <div style={{padding:16}}>
                <input className="input-field input-lg" placeholder="Paste any product URL…" style={{marginBottom:12}}/>
                <button className="btn-primary">Add to drop</button>
              </div>
            )}
          </div>
          {/* Staging strip */}
          {selected.length > 0 && (
            <div className="staging-strip">
              {selected.map(p => (
                <div key={p.id} style={{position:'relative',flexShrink:0}}>
                  <div style={{width:66,height:66,borderRadius:'var(--r-md)',overflow:'hidden'}}>
                    <img src={p.img} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  </div>
                  <button onClick={() => toggleSelect(p)} style={{position:'absolute',top:-4,right:-4,width:18,height:18,borderRadius:'50%',background:'var(--primary)',border:'none',color:'var(--bg)',fontSize:11,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
                </div>
              ))}
              <div style={{marginLeft:'auto',fontSize:13,fontWeight:500,color:'var(--primary)',flexShrink:0}}>{selected.length} pieces</div>
            </div>
          )}
        </>
      )}

      {/* Step 3 */}
      {step===2 && (
        <div style={{padding:'16px 16px 100px'}}>
          <div style={{fontSize:13,fontWeight:500,color:'var(--text-2)',marginBottom:16}}>Styling note per piece (optional)</div>
          {selected.slice(0,3).map(p => (
            <div key={p.id} style={{display:'flex',gap:12,marginBottom:14,alignItems:'flex-start'}}>
              <div style={{width:52,height:52,borderRadius:'var(--r-md)',overflow:'hidden',flexShrink:0}}><img src={p.img} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
              <input className="input-field" style={{height:52,fontStyle:'italic',fontSize:13}} placeholder={`Why ${p.name}?`}/>
            </div>
          ))}
          <div style={{height:1,background:'var(--border)',margin:'20px 0'}}/>
          <div style={{fontSize:13,fontWeight:500,color:'var(--text-2)',marginBottom:8}}>Overall styling notes</div>
          <textarea className="textarea-field" rows={4} placeholder="How should someone wear this drop?" style={{marginBottom:20}}/>
          <div style={{fontSize:13,fontWeight:500,color:'var(--text-2)',marginBottom:10}}>AI pairing suggestions</div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {PRODUCTS.slice(0,3).map(p => (
              <button key={p.id} className="btn-chip" style={{background:'var(--accent)',borderColor:'var(--accent)',color:'var(--primary)',fontSize:12}}>{p.name} +</button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div style={{position:'fixed',bottom:64,left:0,right:0,padding:'12px 16px',background:'var(--surface)',borderTop:'1px solid var(--border)',zIndex:50}}>
        {step<2
          ? <button className="btn-primary" onClick={() => setStep(s=>s+1)}>Continue</button>
          : <button className="btn-primary" onClick={() => { onPublish({name, products:selected}); setPublished(true); }}>Publish drop</button>
        }
      </div>
    </div>
  );
};

/* ── MY DROPS (Screen H) ──────────────────────────────────────────────── */
const MyDropsScreen = ({ nav }) => {
  const [tab, setTab] = useState('published');
  const filtered = MY_DROPS.filter(d => tab==='published' ? d.status==='published' : tab==='drafts' ? d.status==='draft' : false);
  return (
    <div className="screen">
      <div style={{padding:'18px 16px 0',borderBottom:'1px solid var(--border)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <h2 style={{fontSize:22,fontWeight:600,color:'var(--primary)'}}>My Drops</h2>
          <button onClick={() => nav('build-drop')} style={{background:'var(--primary)',color:'var(--bg)',border:'none',borderRadius:'var(--r-pill)',height:34,padding:'0 14px',fontSize:13,fontWeight:500,cursor:'pointer'}}>+ New drop</button>
        </div>
        <div style={{display:'flex',gap:0}}>
          {['published','drafts','private'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{background:'none',border:'none',borderBottom:`2px solid ${tab===t?'var(--primary)':'transparent'}`,padding:'10px 14px',fontSize:13,fontWeight:500,color:tab===t?'var(--primary)':'var(--text-3)',cursor:'pointer',textTransform:'capitalize',marginBottom:-1}}>{t}</button>
          ))}
        </div>
      </div>
      {filtered.length===0 ? (
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'80px 24px',gap:16}}>
          <Ico n="drops" size={48} color="var(--text-3)"/>
          <div style={{fontSize:15,color:'var(--text-2)',textAlign:'center'}}>No {tab} drops yet.</div>
          <button className="btn-chip active" onClick={() => nav('build-drop')}>Build your first drop →</button>
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14,padding:16}}>
          {filtered.map(drop => (
            <div key={drop.id} className="card" style={{overflow:'hidden'}}>
              <div style={{aspectRatio:'16/9',overflow:'hidden'}}>
                <img src={drop.cover} alt={drop.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              </div>
              <div style={{padding:'14px 16px'}}>
                <div style={{fontSize:15,fontWeight:500,marginBottom:4}}>{drop.title}</div>
                <div style={{fontSize:12,fontWeight:300,color:'var(--text-3)',marginBottom:12}}>{drop.pieces} pieces · {drop.status==='published'?`Published ${drop.published}`:'Draft'}</div>
                {drop.status==='published' && (
                  <div style={{display:'flex',gap:16,marginBottom:12}}>
                    {[{icon:'eye',val:drop.views},{icon:'heart',val:drop.saves},{icon:'bag',val:drop.shopClicks+' clicks'}].map((s,i) => (
                      <div key={i} style={{display:'flex',alignItems:'center',gap:4}}>
                        <Ico n={s.icon} size={13} color="var(--text-3)"/>
                        <span style={{fontSize:12,color:'var(--text-2)'}}>{s.val}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{display:'flex',gap:16}}>
                  {['Edit','Share','Archive'].map(a => (
                    <button key={a} style={{background:'none',border:'none',fontSize:13,fontWeight:500,color:'var(--primary)',cursor:'pointer',padding:0}}>{a}</button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── CREATOR PROFILE ──────────────────────────────────────────────────── */
const CreatorProfileScreen = ({ creator, nav }) => {
  const [tab, setTab] = useState('Drops');
  if (!creator) return null;
  return (
    <div className="screen" style={{paddingBottom:24}}>
      <div style={{position:'relative',aspectRatio:'21/9',minHeight:180}}>
        <img src={`https://picsum.photos/seed/cpbg${creator.id}/1200/514`} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(31,61,43,0.92) 0%, transparent 50%)'}}/>
        <button onClick={() => nav('back')} style={{position:'absolute',top:16,left:16,width:40,height:40,borderRadius:'var(--r-pill)',background:'rgba(250,247,241,0.9)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <Ico n="arrow_l" size={20} color="var(--primary)"/>
        </button>
        <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'20px 16px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
            <div style={{display:'flex',alignItems:'flex-end',gap:12}}>
              <img src={creator.img} alt="" style={{width:60,height:60,borderRadius:'50%',objectFit:'cover',border:'2px solid var(--bg)',flexShrink:0}}/>
              <div>
                <div style={{fontSize:20,fontWeight:600,color:'var(--bg)',marginBottom:2}}>{creator.name}</div>
                <div style={{fontSize:13,fontStyle:'italic',fontWeight:300,color:'var(--accent)',marginBottom:4}}>{creator.sig}</div>
                <div style={{fontSize:12,fontWeight:300,color:'var(--accent)'}}>{creator.followers} followers · {creator.drops} drops · {creator.saves} saves</div>
              </div>
            </div>
            <button style={{background:'var(--bg)',color:'var(--primary)',border:'none',borderRadius:'var(--r-pill)',height:34,padding:'0 18px',fontSize:13,fontWeight:500,cursor:'pointer',flexShrink:0}}>Follow</button>
          </div>
        </div>
      </div>
      <div style={{display:'flex',borderBottom:'1px solid var(--border)',padding:'0 16px'}}>
        {['Drops','Lookbooks','Saves'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{background:'none',border:'none',borderBottom:`2px solid ${tab===t?'var(--primary)':'transparent'}`,padding:'13px 16px',fontSize:14,fontWeight:500,color:tab===t?'var(--primary)':'var(--text-3)',cursor:'pointer',marginBottom:-1}}>{t}</button>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,padding:16}}>
        {DROPS.map(drop => (
          <div key={drop.id} className="card" style={{overflow:'hidden'}} onClick={() => nav('drop', drop)}>
            <div style={{aspectRatio:'3/4',position:'relative',overflow:'hidden'}}>
              <img src={drop.img} alt={drop.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(31,61,43,0.72) 0%, transparent 55%)'}}/>
              <div style={{position:'absolute',bottom:10,left:10,right:10}}>
                <div style={{fontSize:13,fontWeight:500,color:'var(--bg)',lineHeight:1.3,marginBottom:2}}>{drop.title}</div>
                <div style={{fontSize:11,fontWeight:300,color:'var(--accent)'}}>{drop.pieces} pieces</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── PROFILE ──────────────────────────────────────────────────────────── */
const ProfileScreen = ({ nav, saved, closet }) => {
  const [tab, setTab] = useState('drops');
  return (
    <div className="screen">
      <div style={{padding:'18px 16px 0'}}>
        <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:20}}>
          <div style={{width:60,height:60,borderRadius:'50%',background:'var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,fontWeight:600,color:'var(--primary)',flexShrink:0}}>A</div>
          <div>
            <div style={{fontSize:18,fontWeight:600}}>Ananya Singh</div>
            <div style={{fontSize:13,fontWeight:300,color:'var(--text-2)'}}>14 drops · 3.2k followers · 89 saves</div>
          </div>
          <button onClick={() => nav('my-drops')} style={{marginLeft:'auto',background:'var(--primary)',color:'var(--bg)',border:'none',borderRadius:'var(--r-pill)',height:34,padding:'0 14px',fontSize:12,fontWeight:500,cursor:'pointer'}}>My drops</button>
        </div>
        <div style={{display:'flex',borderBottom:'1px solid var(--border)'}}>
          {[['drops','Drops'],['closet','Closet'],['saved','Saved']].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)} style={{background:'none',border:'none',borderBottom:`2px solid ${tab===k?'var(--primary)':'transparent'}`,padding:'11px 16px',fontSize:14,fontWeight:500,color:tab===k?'var(--primary)':'var(--text-3)',cursor:'pointer',marginBottom:-1}}>{l}</button>
          ))}
        </div>
      </div>
      {tab==='drops' && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,padding:16}}>
          {MY_DROPS.filter(d=>d.status==='published').map(drop => (
            <div key={drop.id} className="card" style={{overflow:'hidden'}}>
              <div style={{aspectRatio:'16/9',overflow:'hidden'}}><img src={drop.cover} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
              <div style={{padding:'10px 12px'}}>
                <div style={{fontSize:13,fontWeight:500}}>{drop.title}</div>
                <div style={{fontSize:11,color:'var(--text-3)'}}>{drop.pieces} pieces</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab==='closet' && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,padding:16}}>
          {closet.slice(0,6).map(p => (
            <div key={p.id} style={{borderRadius:'var(--r-md)',overflow:'hidden'}}>
              <img src={p.img} style={{width:'100%',aspectRatio:'1/1',objectFit:'cover'}}/>
            </div>
          ))}
        </div>
      )}
      {tab==='saved' && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,padding:16}}>
          {PRODUCTS.filter(p=>saved.includes(p.id)).map(p => (
            <div key={p.id} className="card" style={{overflow:'hidden'}}>
              <img src={p.img} style={{width:'100%',aspectRatio:'3/4',objectFit:'cover'}}/>
              <div style={{padding:'8px 10px'}}><div style={{fontSize:13,fontWeight:500}}>{p.name}</div></div>
            </div>
          ))}
          {PRODUCTS.filter(p=>saved.includes(p.id)).length===0 && <div style={{gridColumn:'1/-1',padding:40,textAlign:'center',color:'var(--text-3)'}}>Nothing saved yet</div>}
        </div>
      )}
    </div>
  );
};

/* ── EXPORTS ──────────────────────────────────────────────────────────── */
Object.assign(window, {
  Ico, Toast, AffiliateInterstitial, Splash, OnboardingV2,
  HomeV2, DiscoverScreen, DropsScreen, ProductDetailV2, DropDetailV2,
  CreatorProfileScreen, ClosetScreen, AddPiece, DropBuilder,
  MyDropsScreen, ProfileScreen, ShopBtn,
  CREATORS, PRODUCTS, DROPS, TRENDING, CLOSET_PIECES, PARTNERS,
});
