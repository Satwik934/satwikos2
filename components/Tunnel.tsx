'use client';
import { useEffect, useRef } from 'react';
export default function Tunnel() {
 const canvas = useRef<HTMLCanvasElement>(null);
 useEffect(() => {
  const el = canvas.current; if (!el) return; const ctx = el.getContext('2d'); if (!ctx) return;
  let frame = 0, raf = 0, w = 0, h = 0, px = 0, py = 0;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const resize = () => { const rect = el.getBoundingClientRect(); const dpr = Math.min(window.devicePixelRatio || 1, 2); w = rect.width; h = rect.height; el.width = Math.round(w*dpr); el.height = Math.round(h*dpr); ctx.setTransform(dpr,0,0,dpr,0,0); };
  const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); px = (e.clientX-r.left)/r.width-.5; py = (e.clientY-r.top)/r.height-.5; };
  const draw = () => { ctx.clearRect(0,0,w,h); const cx = w/2+px*38, cy = h/2+py*28; const scale = Math.min(w,h)*.43; const phase = reduce ? 0 : frame*.005;
   const corners: {x:number,y:number}[][] = [];
   for(let i=0;i<15;i++){ const depth = (i/15+phase%1)%1; const s = Math.pow(depth,2.15)*scale+3; const turn = depth*.32+phase*.09; const c = Math.cos(turn), sn = Math.sin(turn); const arr = [[-1,-1],[1,-1],[1,1],[-1,1]].map(([x,y])=>({x:cx+(x*c-y*sn)*s,y:cy+(x*sn+y*c)*s})); corners.push(arr);
    ctx.strokeStyle=`rgba(81,255,105,${.14+depth*.75})`; ctx.lineWidth=depth>.65?1.5:1; ctx.beginPath(); arr.forEach((p,j)=>j?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)); ctx.closePath(); ctx.stroke();
   }
   for(let i=0;i<corners.length-1;i++)for(let j=0;j<4;j++){ const a=corners[i][j], b=corners[i+1][j]; ctx.strokeStyle='rgba(65,255,95,.19)';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke(); }
   if(!reduce){frame++;raf=requestAnimationFrame(draw);} };
  resize();draw();window.addEventListener('resize',resize);el.addEventListener('pointermove',move);
  return ()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);el.removeEventListener('pointermove',move);};
 },[]);
 return <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-label="Animated neon-green wireframe tunnel" role="img" />;
}
