// drippr-v2-app.jsx — App shell, navigation, routing
const { useState, useEffect, useCallback } = React;

/* ── TWEAK DEFAULTS ─────────────────────────────────────────────────── */
const TWEAK_DEFAULTS_V2 = /*EDITMODE-BEGIN*/{
  "mood": "quiet-luxury",
  "cardEnergy": "editorial",
  "typeScale": "editorial"
}/*EDITMODE-END*/;

const MOODS_V2 = {
  'quiet-luxury': { '--bg':'#F5EFE6','--surface':'#FAF7F1','--primary':'#1F3D2B','--primary-hover':'#244733','--accent':'#CBBBA0','--border':'#E6DDCF','--text-1':'#1F3D2B','--text-2':'#6B7C72','--text-3':'#A8B3AA' },
  'ink-stone':    { '--bg':'#1B2E22','--surface':'#22392B','--primary':'#EFE8DC','--primary-hover':'#FAF7F1','--accent':'#A8957A','--border':'#3A5244','--text-1':'#EFE8DC','--text-2':'#8FAA98','--text-3':'#4D6860' },
  'chalk':        { '--bg':'#F2F0EC','--surface':'#FAFAF7','--primary':'#141414','--primary-hover':'#2E2E2E','--accent':'#9A9085','--border':'#E0DDD5','--text-1':'#141414','--text-2':'#62605A','--text-3':'#ABABAB' },
};
const TYPE_MULT_V2 = { 'intimate':0.80, 'editorial':1, 'grand':1.28 };

/* ── TABS ───────────────────────────────────────────────────────────── */
const TABS = [
  { id:'home',     label:'Home',    icon:'home'    },
  { id:'discover', label:'Discover',icon:'compass' },
  { id:'drops',    label:'Drops',   icon:'drops'   },
  { id:'closet',   label:'Closet',  icon:'hanger'  },
  { id:'profile',  label:'Profile', icon:'user'    },
];

/* ── BOTTOM NAV ─────────────────────────────────────────────────────── */
const BottomNavV2 = ({ active, onTab }) => (
  <div className="bottom-nav">
    {TABS.map(t => (
      <button key={t.id} onClick={() => onTab(t.id)} style={{flex:1,background:'none',border:'none',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3,padding:'6px 0'}}>
        <Ico n={t.icon} size={23} color={active===t.id?'var(--primary)':'var(--text-3)'} sw={active===t.id?2:1.5}/>
        {active===t.id && <span style={{fontSize:10,fontWeight:500,color:'var(--primary)'}}>{t.label}</span>}
      </button>
    ))}
  </div>
);

/* ── SIDEBAR ────────────────────────────────────────────────────────── */
const SidebarV2 = ({ active, onTab }) => (
  <div className="sidebar">
    <div style={{padding:'32px 28px 28px',fontSize:22,fontWeight:600,color:'var(--primary)'}}>Drippr.</div>
    <div style={{flex:1}}>
      {TABS.map(t => (
        <button key={t.id} onClick={() => onTab(t.id)} style={{width:'100%',background:'none',border:'none',borderLeft:`3px solid ${active===t.id?'var(--primary)':'transparent'}`,cursor:'pointer',display:'flex',alignItems:'center',gap:12,padding:'12px 22px',fontSize:15,fontWeight:active===t.id?500:400,color:active===t.id?'var(--primary)':'var(--text-2)',transition:'all 180ms ease',textAlign:'left'}}>
          <Ico n={t.icon} size={18} color={active===t.id?'var(--primary)':'var(--text-2)'} sw={active===t.id?2:1.5}/>
          {t.label}
        </button>
      ))}
      <div style={{height:'0.5px',background:'var(--border)',margin:'12px 16px'}}/>
      <button onClick={() => onTab('my-drops-nav')} style={{width:'100%',background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:12,padding:'12px 22px',fontSize:14,fontWeight:400,color:'var(--text-2)',textAlign:'left'}}>
        <Ico n="grid" size={17} color="var(--text-2)"/>
        My Drops
      </button>
    </div>
    <div style={{padding:'20px 22px',borderTop:'1px solid var(--border)'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
        <div style={{width:36,height:36,borderRadius:'50%',background:'var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:600,color:'var(--primary)',flexShrink:0}}>A</div>
        <div>
          <div style={{fontSize:14,fontWeight:500,color:'var(--text-1)'}}>Ananya</div>
          <div style={{fontSize:11,color:'var(--text-3)'}}>@ananya.s</div>
        </div>
      </div>
      <button style={{width:'100%',background:'var(--primary)',color:'var(--bg)',border:'none',borderRadius:'var(--r-pill)',height:36,fontSize:13,fontWeight:500,cursor:'pointer'}}>Build a drop</button>
    </div>
  </div>
);

// Context must be declared before App uses it
const TweaksCtxV2 = React.createContext({ cardEnergy:'editorial', tm:1 });

/* ── APP ────────────────────────────────────────────────────────────── */
const App = () => {
  const [view, setView]       = useState('splash');
  const [tab, setTab]         = useState('home');
  const [stack, setStack]     = useState([]);
  const [drop, setDrop]       = useState(null);
  const [product, setProduct] = useState(null);
  const [creator, setCreator] = useState(null);
  const [saved, setSaved]     = useState([]);
  const [closet, setCloset]   = useState(CLOSET_PIECES);
  const [toast, setToast]     = useState(null);
  const [affiliate, setAffiliate] = useState(null); // partner key for interstitial
  const [tweaks, setTweak]    = useTweaks(TWEAK_DEFAULTS_V2);

  // Apply mood palette
  useEffect(() => {
    const vars = MOODS_V2[tweaks.mood] || MOODS_V2['quiet-luxury'];
    Object.entries(vars).forEach(([k,v]) => document.documentElement.style.setProperty(k,v));
  }, [tweaks.mood]);

  const showToast = (msg, action, onAction) => setToast({ msg, action, onAction });

  // Navigation
  const nav = useCallback((to, data) => {
    if (to === 'back') {
      if (stack.length > 0) {
        const prev = stack[stack.length - 1];
        setStack(s => s.slice(0,-1));
        setView(prev.view);
        if (prev.tab) setTab(prev.tab);
      } else { setView('main'); }
      return;
    }
    if (to === 'home')      { setView('main'); setTab('home');   setStack([]); return; }
    if (to === 'drop')      { setDrop(data);    setStack(s=>[...s,{view,tab}]); setView('drop');    return; }
    if (to === 'product')   { setProduct(data); setStack(s=>[...s,{view,tab}]); setView('product'); return; }
    if (to === 'creator')   { setCreator(data); setStack(s=>[...s,{view,tab}]); setView('creator'); return; }
    if (to === 'add-piece') { setStack(s=>[...s,{view,tab}]); setView('add-piece'); return; }
    if (to === 'build-drop'){ setStack(s=>[...s,{view,tab}]); setView('build-drop'); return; }
    if (to === 'my-drops')  { setStack(s=>[...s,{view,tab}]); setView('my-drops'); return; }
    if (to === 'my-drops-nav') { setStack(s=>[...s,{view,tab}]); setView('my-drops'); return; }
  }, [view, tab, stack]);

  const handleTab = t => { setTab(t); setView('main'); setStack([]); };

  const handleSave = id => {
    setSaved(s => s.includes(id) ? s.filter(x=>x!==id) : [...s, id]);
    showToast(saved.includes(id) ? 'Removed from saves' : 'Saved ♡');
  };

  const handleShop = partner => {
    setAffiliate(partner);
  };

  const handleAffiliateClose = () => {
    setAffiliate(null);
    const p = PARTNERS[affiliate];
    showToast(
      `Did you buy it? Log it in your closet.`,
      'Yes, log it',
      () => { setToast(null); nav('add-piece'); }
    );
  };

  const handleAddPiece = piece => {
    setCloset(c => [{ ...piece, id: Date.now(), wears:0, category:'Tops', lastWorn:'Just added' }, ...c]);
    showToast('Added to your closet');
  };

  const handlePublishDrop = (drop) => {
    showToast('Drop published to your circle');
  };

  const detailViews = ['drop','product','creator','add-piece','build-drop','my-drops'];
  const showNav = !detailViews.includes(view);
  const isRoot  = view==='splash' || view==='onboard';

  const content = () => {
    if (view==='splash')     return <Splash onDone={() => setView('onboard')}/>;
    if (view==='onboard')    return <OnboardingV2 onDone={() => setView('main')}/>;
    if (view==='drop')       return <DropDetailV2 drop={drop} nav={nav} onShop={handleShop}/>;
    if (view==='product')    return <ProductDetailV2 product={product} nav={nav} onShop={handleShop} onSave={handleSave} saved={saved}/>;
    if (view==='creator')    return <CreatorProfileScreen creator={creator} nav={nav}/>;
    if (view==='add-piece')  return <AddPiece nav={nav} onAdd={handleAddPiece}/>;
    if (view==='build-drop') return <DropBuilder nav={nav} closet={closet} onPublish={handlePublishDrop}/>;
    if (view==='my-drops')   return <MyDropsScreen nav={nav}/>;
    // Tab screens
    if (tab==='home')     return <HomeV2 nav={nav} saved={saved} onSave={handleSave} onShop={handleShop}/>;
    if (tab==='discover') return <DiscoverScreen nav={nav} saved={saved} onSave={handleSave}/>;
    if (tab==='drops')    return <DropsScreen nav={nav}/>;
    if (tab==='closet')   return <ClosetScreen nav={nav} closet={closet} onAddPiece={() => nav('add-piece')}/>;
    if (tab==='profile')  return <ProfileScreen nav={nav} saved={saved} closet={closet}/>;
  };

  return (
    <>
      <TweaksCtxV2.Provider value={{ cardEnergy: tweaks.cardEnergy, tm: TYPE_MULT_V2[tweaks.typeScale] || 1 }}>
        <div className="app">
          {!isRoot && <SidebarV2 active={tab} onTab={handleTab}/>}
          <div className="main-content" key={`${view}-${tab}`}>
            {content()}
          </div>
          {!isRoot && showNav && <BottomNavV2 active={tab} onTab={handleTab}/>}
        </div>
      </TweaksCtxV2.Provider>

      {/* Affiliate interstitial — outside app shell so it covers everything */}
      {affiliate && <AffiliateInterstitial partner={affiliate} onDone={handleAffiliateClose}/>}

      {/* Toast */}
      {toast && <Toast msg={toast.msg} action={toast.action} onAction={toast.onAction} onGone={() => setToast(null)}/>}

      {/* Tweaks panel */}
      <TweaksPanel>
        <TweakSection label="Mood"/>
        <TweakRadio label="Palette" value={tweaks.mood}
          options={['quiet-luxury','ink-stone','chalk']}
          labels={['Quiet Luxury','Ink & Stone','Chalk']}
          onChange={v => setTweak('mood', v)}/>
        <TweakSection label="Card Energy"/>
        <TweakRadio label="Image framing" value={tweaks.cardEnergy}
          options={['editorial','gallery','cinematic']}
          labels={['Editorial','Gallery','Cinematic']}
          onChange={v => setTweak('cardEnergy', v)}/>
        <TweakSection label="Type Scale"/>
        <TweakRadio label="Fraunces weight" value={tweaks.typeScale}
          options={['intimate','editorial','grand']}
          labels={['Intimate','Editorial','Grand']}
          onChange={v => setTweak('typeScale', v)}/>
      </TweaksPanel>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
