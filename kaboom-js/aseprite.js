var asepritePlugin=(()=>{var g=Object.defineProperty;var h=(a,t)=>g(a,"name",{value:t,configurable:!0});var p=(a,t)=>()=>(t||a((t={exports:{}}).exports,t),t.exports);var w=p((y,c)=>{c.exports=a=>{function t(m,d,l){let s=new Promise((u,i)=>{let f=a.loadRoot()+l;a.loadSprite(m,d).then(o=>{fetch(f).then(r=>r.json()).then(r=>{let n=r.meta.size;o.frames=r.frames.map(e=>a.quad(e.frame.x/n.w,e.frame.y/n.h,e.frame.w/n.w,e.frame.h/n.h));for(let e of r.meta.frameTags)o.anims[e.name]={from:e.from,to:e.to};u(o)}).catch(()=>{i(`failed to load ${f}`)})}).catch(o=>i(o))});return a.addLoader(s),s}return h(t,"loadAseprite"),{loadAseprite:t}}});return w();})();
//# sourceMappingURL=aseprite.js.map