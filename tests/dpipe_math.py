#!/usr/bin/env python3
"""Uji numerik pass depth pipeline (AO/SSR/DOF/autofocus/debug) di WebGL2 dengan scene sintetis (lantai, kotak, dinding)."""
import json, os, subprocess, sys, tempfile
try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("(playwright tidak ada: uji dpipe dilewati)"); sys.exit(0)
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
CHROME = os.environ.get("RZ_CHROMIUM", "/opt/pw-browsers/chromium")
if not os.path.exists(CHROME):
    print("(chromium tidak ada: uji dpipe dilewati)"); sys.exit(0)
t = tempfile.mkdtemp()
subprocess.check_call(["g++", "-std=c++17", os.path.join(R, "tests", "dpipe_dump.cpp"), "-o", os.path.join(t, "dump")])
subprocess.check_call([os.path.join(t, "dump"), t])
src = {n: open(os.path.join(t, n + ".frag")).read() for n in ["ao", "ssr", "comp", "final", "focus"]}
src["vert"] = open(os.path.join(t, "v.vert")).read()

JS = r"""
async ([src]) => {
const W=192,H=108;
const c=document.createElement('canvas'); c.width=W; c.height=H; const gl=c.getContext('webgl2');
if(!gl) return {err:'nogl'};
if(!gl.getExtension('EXT_color_buffer_float')) return {err:'noext'};
// ---- matriks (kolom-mayor)
const mul=(a,b)=>{const r=new Array(16).fill(0);for(let i=0;i<4;i++)for(let j=0;j<4;j++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+j]*b[i*4+k];r[i*4+j]=s;}return r;};
const persp=(fov,asp,n,f)=>{const t=1/Math.tan(fov/2);return [t/asp,0,0,0, 0,t,0,0, 0,0,(f+n)/(n-f),-1, 0,0,2*f*n/(n-f),0];};
const norm=v=>{const l=Math.hypot(...v);return v.map(x=>x/l);};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const lookAt=(e,t,u)=>{const f=norm([t[0]-e[0],t[1]-e[1],t[2]-e[2]]);const s=norm(cross(f,u));const uu=cross(s,f);
 return [s[0],uu[0],-f[0],0, s[1],uu[1],-f[1],0, s[2],uu[2],-f[2],0, -dot(s,e),-dot(uu,e),dot(f,e),1];};
const inv=(m)=>{const a=m.slice();const r=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
 for(let i=0;i<4;i++){let p=i;for(let k=i+1;k<4;k++)if(Math.abs(a[i*4+k])>Math.abs(a[i*4+p]))p=k;
  if(p!==i){for(let j=0;j<4;j++){[a[j*4+i],a[j*4+p]]=[a[j*4+p],a[j*4+i]];[r[j*4+i],r[j*4+p]]=[r[j*4+p],r[j*4+i]];}}
  const d=a[i*4+i];for(let j=0;j<4;j++){a[j*4+i]/=d;r[j*4+i]/=d;}
  for(let k=0;k<4;k++){if(k===i)continue;const f=a[i*4+k];for(let j=0;j<4;j++){a[j*4+k]-=f*a[j*4+i];r[j*4+k]-=f*r[j*4+i];}}}
 return r;};
const cam=[0,6,12];
const V=lookAt(cam,[0,0.5,-6],[0,1,0]);
const P=persp(60*Math.PI/180,W/H,0.5,400);
const VP=mul(P,V), IVP=inv(VP);
const tr=(m,v)=>{const o=[0,0,0,0];for(let i=0;i<4;i++)o[i]=m[i]*v[0]+m[4+i]*v[1]+m[8+i]*v[2]+m[12+i]*v[3];return o;};
// ---- scene sintetis
const depth=new Float32Array(W*H), col=new Float32Array(W*H*4);
const box={c:[0,1.2,-4],h:1.2};
const hitScene=(o,d)=>{let best=1e9,bc=null,bn=null;
 if(d[1]<-1e-6){const t=-o[1]/d[1];if(t>0.01){const p=[o[0]+d[0]*t,0,o[2]+d[2]*t];if(Math.abs(p[0])<60&&p[2]>-80&&p[2]<40){best=t;const ck=((Math.floor(p[0]/2)+Math.floor(p[2]/2))&1);bc=ck?[0.55,0.55,0.55]:[0.3,0.3,0.3];}}}
 // dinding z=-30
 if(d[2]<-1e-6){const t=(-30-o[2])/d[2];if(t>0.01&&t<best){const p=[o[0]+d[0]*t,o[1]+d[1]*t,-30];if(Math.abs(p[0])<40&&p[1]>0&&p[1]<14){best=t;const st=((Math.floor(p[0]/1)+Math.floor(p[1]/1))&1);bc=st?[0.9,0.9,0.2]:[0.1,0.1,0.5];}}}
 // kotak (slab)
 let tn=-1e9,tf=1e9,nrm=null;
 for(let a=0;a<3;a++){const lo=box.c[a]-box.h,hi=box.c[a]+box.h;
  if(Math.abs(d[a])<1e-9){if(o[a]<lo||o[a]>hi){tn=1e9;break;}}
  else{let t1=(lo-o[a])/d[a],t2=(hi-o[a])/d[a];let s=-1;if(t1>t2){[t1,t2]=[t2,t1];s=1;}
   if(t1>tn){tn=t1;nrm=[0,0,0];nrm[a]=s*(d[a]>0?-1:1)*(d[a]>0?1:1);} if(t2<tf)tf=t2;}}
 if(tn<tf&&tn>0.01&&tn<best){best=tn;bc=[0.85,0.1,0.1];}
 return best<1e8?{t:best,c:bc}:null;};
for(let j=0;j<H;j++)for(let i=0;i<W;i++){
 const nx=((i+0.5)/W)*2-1, ny=((j+0.5)/H)*2-1;
 const a=tr(IVP,[nx,ny,-1,1]), b=tr(IVP,[nx,ny,1,1]);
 const pa=[a[0]/a[3],a[1]/a[3],a[2]/a[3]], pb=[b[0]/b[3],b[1]/b[3],b[2]/b[3]];
 const d=norm([pb[0]-pa[0],pb[1]-pa[1],pb[2]-pa[2]]);
 const h=hitScene(cam,d); const k=j*W+i;
 if(h){const p=[cam[0]+d[0]*h.t,cam[1]+d[1]*h.t,cam[2]+d[2]*h.t];const cl=tr(VP,[p[0],p[1],p[2],1]);depth[k]=(cl[2]/cl[3])*0.5+0.5;col[k*4]=h.c[0];col[k*4+1]=h.c[1];col[k*4+2]=h.c[2];col[k*4+3]=1;}
 else{depth[k]=1;col[k*4]=0.4;col[k*4+1]=0.6;col[k*4+2]=0.95;col[k*4+3]=1;}
}
// ---- GL
const sh=(t,s)=>{const x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);if(!gl.getShaderParameter(x,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(x));return x;};
const progs={};
for(const n of ['ao','ssr','comp','final','focus']){const p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,src.vert));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,src[n]));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(n+gl.getProgramInfoLog(p));progs[n]=p;}
const vao=gl.createVertexArray();gl.bindVertexArray(vao);
const mkTex=(w,h,ifmt,fmt,type,data,filter)=>{const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,ifmt,w,h,0,fmt,type,data);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,filter);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,filter);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return t;};
const tColor=mkTex(W,H,gl.RGBA16F,gl.RGBA,gl.FLOAT,col,gl.LINEAR);
const tDepth=mkTex(W,H,gl.DEPTH_COMPONENT32F,gl.DEPTH_COMPONENT,gl.FLOAT,depth,gl.NEAREST);
const rt=()=>{const t=mkTex(W,H,gl.RGBA16F,gl.RGBA,gl.FLOAT,null,gl.LINEAR);const f=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,f);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,t,0);
 if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw new Error('fbo');return {t,f};};
const rA=rt(),rB=rt(),rC=rt(),rF=rt(),rFoc=(()=>{const t=mkTex(1,1,gl.RGBA16F,gl.RGBA,gl.FLOAT,null,gl.NEAREST);const f=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,f);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,t,0);return {t,f};})();
const blank=mkTex(1,1,gl.RGBA16F,gl.RGBA,gl.FLOAT,new Float32Array([0,0,0,0]),gl.NEAREST);
const defaults={uMx0:[0,1.5,12,0],uMx1:[1,0.3,1,1],uMx2:[0.02,0.02,0.5,2],uMx3:[0.5,0,0,0],uSs0:[0,32,40,0.6],uSs1:[0.3,0.5,0,0],uSs2:[0,0,0,0],
 uDf0:[0,20,4,0.4],uDf1:[1,1,8,0.3],uDf2:[0,24,4,50],uDf3:[0,0.5,1,1],uDbg:[0,0,0,0],uOl0:[0,1,0.75,0.5],uOl1:[120,450,1,1],uOl2:[1,1,1,0]};
const run=(name,tgt,binds,over,w,h)=>{const p=progs[name];gl.useProgram(p);gl.bindFramebuffer(gl.FRAMEBUFFER,tgt);gl.viewport(0,0,w||W,h||H);
 const U=Object.assign({},defaults,over||{});
 const names=['uColor','uDepth','uTexA','uTexB','uTexC','uHist','uFocus'];
 names.forEach((n,i)=>{gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,binds[n]||blank);gl.uniform1i(gl.getUniformLocation(p,n),i);});
 gl.uniformMatrix4fv(gl.getUniformLocation(p,'uVP'),false,VP);gl.uniformMatrix4fv(gl.getUniformLocation(p,'uInvVP'),false,IVP);gl.uniformMatrix4fv(gl.getUniformLocation(p,'uPrevVP'),false,VP);
 gl.uniform4f(gl.getUniformLocation(p,'uCam'),cam[0],cam[1],cam[2],1);
 gl.uniform4f(gl.getUniformLocation(p,'uView'),1/W,1/H,0,0);
 for(const k in U){const l=gl.getUniformLocation(p,k);if(l)gl.uniform4fv(l,U[k]);}
 gl.drawArrays(gl.TRIANGLES,0,3);};
const read=(fb)=>{gl.bindFramebuffer(gl.FRAMEBUFFER,fb);const o=new Float32Array(W*H*4);gl.readPixels(0,0,W,H,gl.RGBA,gl.FLOAT,o);return o;};
const px=(a,i,j)=>{const k=(j*W+i)*4;return [a[k],a[k+1],a[k+2],a[k+3]];};
const B={uColor:tColor,uDepth:tDepth};
const res={};
// uv->pixel util: proyeksi titik dunia
const pix=(p)=>{const c=tr(VP,[p[0],p[1],p[2],1]);return [Math.floor((c[0]/c[3]*0.5+0.5)*W),Math.floor((c[1]/c[3]*0.5+0.5)*H)];};
res.pixBoxBase=pix([0,0,-2.6]); res.pixFloorFar=pix([6,0,-8]); res.pixFloorFront=pix([0,0,2]);
// 1) identitas: semua mati
run('comp',rC.f,B,{},W,H); run('final',rF.f,Object.assign({uTexC:rC.t},B),{},W,H);
let o=read(rF.f);let md=0;for(let k=0;k<W*H;k++){for(let c=0;c<3;c++)md=Math.max(md,Math.abs(o[k*4+c]-col[k*4+c]));} res.identityMaxDiff=md;
// 2) normal (debug 2)
run('final',rF.f,Object.assign({uTexC:rC.t},B),{uDbg:[2,0,0,0]},W,H); o=read(rF.f); res.nFloor=px(o,res.pixFloorFront[0],res.pixFloorFront[1]);
// kotak sisi atas: titik (0,2.4,-4)
res.pixBoxTop=pix([0,2.4,-4]); res.nBoxTop=px(o,res.pixBoxTop[0],res.pixBoxTop[1]);
// 3) AO
run('ao',rA.f,B,{uMx0:[1.5,1.5,16,0]},W,H); o=read(rA.f);
res.aoBase=px(o,res.pixBoxBase[0],res.pixBoxBase[1])[0]; res.aoFar=px(o,res.pixFloorFar[0],res.pixFloorFar[1])[0]; res.aoFront=px(o,res.pixFloorFront[0],res.pixFloorFront[1])[0];
// 4) SSR: lantai di depan kotak memantulkan kotak merah
run('ssr',rB.f,B,{uSs0:[1.5,48,40,1.0]},W,H); o=read(rB.f);
res.pixFloorInFront=pix([0,0,-1.0]); res.ssrBox=px(o,res.pixFloorInFront[0],res.pixFloorInFront[1]);
res.ssrFar=px(o,res.pixFloorFar[0],res.pixFloorFar[1]);
let ssum=0;for(let k=0;k<W*H;k++)ssum+=o[k*4+3]; res.ssrCover=ssum/(W*H);
// 5) DOF: fokus 18 (kotak ~16), dinding z=-30 (jarak ~43) harus kabur; ukur variansi lokal di dinding
const varOf=(a,x0,y0,x1,y1)=>{let m=0,n=0;for(let j=y0;j<y1;j++)for(let i=x0;i<x1;i++){m+=luma(a,i,j);n++;}m/=n;let v=0;for(let j=y0;j<y1;j++)for(let i=x0;i<x1;i++){const d=luma(a,i,j)-m;v+=d*d;}return v/n;};
const luma=(a,i,j)=>{const k=(j*W+i)*4;return 0.2126*a[k]+0.7152*a[k+1]+0.0722*a[k+2];};
const wallPix=pix([-6,5,-30]);
const dofOver={uDf0:[1,18,3,0.3],uDf1:[1,1,10,0.2],uDf2:[0,32,4,50],uDf3:[0,0.5,1,1]};
run('final',rF.f,Object.assign({uTexC:tColor},B),{},W,H); o=read(rF.f); res.wallVarOff=varOf(o,wallPix[0]-10,wallPix[1]-8,wallPix[0]+10,wallPix[1]+8);
run('final',rF.f,Object.assign({uTexC:tColor},B),dofOver,W,H); o=read(rF.f); res.wallVarOn=varOf(o,wallPix[0]-10,wallPix[1]-8,wallPix[0]+10,wallPix[1]+8);
res.boxPix=pix([0,1.2,-2.8]); const bo=px(o,res.boxPix[0],res.boxPix[1]); res.boxColorDof=bo;
// 6) autofocus ke titik tengah layar
run('focus',rFoc.f,B,{uDf0:[1,20,3,0.3],uDf3:[1,0.0,1,1]},1,1);
gl.bindFramebuffer(gl.FRAMEBUFFER,rFoc.f);const fo=new Float32Array(4);gl.readPixels(0,0,1,1,gl.RGBA,gl.FLOAT,fo);res.focus=fo[0];
// 7) debug grid & depth jalan (tidak crash)
for(const m of [1,3,4,5,6]){run('final',rF.f,Object.assign({uTexC:rC.t,uTexA:rA.t,uTexB:rB.t},B),{uDbg:[m,0,0,0],uDf0:[1,18,3,0.3]},W,H);o=read(rF.f);let s=0;for(let k=0;k<W*H*4;k++)s+=o[k];res['dbg'+m]=s>0&&isFinite(s);}
// 7b) Outline PrismShade: mask tepi (debug) - ada garis di siluet kotak, tidak ada di lantai datar
run('final',rF.f,Object.assign({uTexC:rC.t},B),{uOl0:[1,4,0.75,0.5],uOl2:[1,1,1,1]},W,H);o=read(rF.f);
let olSum=0,olMax=0;for(let k=0;k<W*H;k++){olSum+=o[k*4];olMax=Math.max(olMax,o[k*4]);}
res.olCount=olSum;res.olMax=olMax;res.olFloor=px(o,res.pixFloorFront[0],res.pixFloorFront[1])[0];
run('final',rF.f,Object.assign({uTexC:rC.t},B),{uOl0:[1,1,0.75,0.5],uOl2:[1,0,0,0]},W,H);o=read(rF.f);
res.olBlend=px(o,0,0)[0];
// 8) komposit AO+SSR menghasilkan perubahan
run('comp',rC.f,Object.assign({uTexA:rA.t,uTexB:rB.t},B),{uMx0:[1.5,1.5,16,0],uSs0:[1.5,48,40,1.0]},W,H);o=read(rC.f);
res.compFloorFront=px(o,res.pixFloorInFront[0],res.pixFloorInFront[1]);res.srcFloorFront=px(col,res.pixFloorInFront[0],res.pixFloorInFront[1]);
return res;}
"""
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path=CHROME, args=["--use-gl=swiftshader", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
    pg = b.new_page()
    r = pg.evaluate(JS, [src])
    b.close()
if "err" in r:
    print("WebGL2 tidak tersedia:", r["err"]); sys.exit(0)
print(json.dumps(r, indent=1))
bad = 0
def chk(name, cond):
    global bad
    if not cond: print("GAGAL:", name); bad += 1
chk("identitas (semua mati) = masukan", r["identityMaxDiff"] < 0.01)
chk("normal lantai ~ (0.5,1,0.5)", abs(r["nFloor"][1] - 1.0) < 0.1 and abs(r["nFloor"][0] - 0.5) < 0.1)
chk("normal sisi atas kotak ~ ke atas", abs(r["nBoxTop"][1] - 1.0) < 0.15)
chk("AO: dasar kotak lebih gelap dari lantai jauh", r["aoBase"] < r["aoFar"] - 0.05)
chk("AO: lantai jauh ~ terang", r["aoFar"] > 0.9)
chk("SSR: lantai depan kotak memantulkan merah", r["ssrBox"][3] > 0.05 and r["ssrBox"][0] > r["ssrBox"][2] + 0.3)
chk("DOF: dinding jauh lebih halus (varian turun)", r["wallVarOn"] < r["wallVarOff"] * 0.6)
chk("DOF: kotak di fokus tetap merah", r["boxColorDof"][0] > 0.6 and r["boxColorDof"][1] < 0.3)
chk("autofocus ~ jarak kotak/titik tengah (>5 dan <40)", 5 < r["focus"] < 40)
chk("mode debug jalan", all(r["dbg%d" % m] for m in [1, 3, 4, 5, 6]))
chk("outline: ada tepi di siluet", r["olMax"] > 0.5 and r["olCount"] > 20)
chk("outline: lantai datar tidak bergaris", r["olFloor"] < 0.05)
chk("komposit mengubah lantai (SSR)", abs(r["compFloorFront"][0] - r["srcFloorFront"][0]) > 0.02)
print("dpipe_math: gagal", bad)
sys.exit(1 if bad else 0)
