import json, sys
try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print('(playwright tidak ada: uji numerik WebGL dilewati)'); sys.exit(0)
import os, subprocess, tempfile
R=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..')
exe=os.path.join(tempfile.mkdtemp(),'dump')
subprocess.check_call(['g++','-std=c++17',os.path.join(R,'tests','shader_fns_dump.cpp'),'-o',exe])
fns=subprocess.check_output([exe]).decode()
CHROME=os.environ.get('RZ_CHROMIUM','/opt/pw-browsers/chromium')
if not os.path.exists(CHROME): print('(chromium tidak ada: uji numerik WebGL dilewati)'); sys.exit(0)
frag = """#version 300 es
precision highp float;
uniform vec4 CB0[61];
uniform vec4 RZ8,RZ9,RZ10,RZ11,RZ12,RZ15,RZ16,RZ17,RZ18,RZ19;
uniform vec4 uIN;   // fd, d, vy, hv
out vec4 o;
""" + fns + """
void main(){
  float f = rz_fogx(uIN.x, uIN.y, vec3(0.0, uIN.z, 0.0), uIN.w);
  vec3 r = rz_rim(vec3(0.0,0.0,1.0), vec3(0.0,0.9,0.436), vec3(0.3));
  o = vec4(f, r.x, r.y, rz_rfade(uIN.x, uIN.y));
}"""
js = """
([frag, cases]) => {
 const c=document.createElement('canvas'); c.width=1;c.height=1; const gl=c.getContext('webgl2');
 if(!gl) return 'nogl';
 const sh=(t,s)=>{ try{const x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);if(!gl.getShaderParameter(x,gl.COMPILE_STATUS))throw (t+':'+gl.getShaderInfoLog(x));return x;}catch(e){throw 'SH'+t+' '+e}};
 const p=gl.createProgram();
 gl.attachShader(p,sh(gl.VERTEX_SHADER,'#version 300 es\\nvoid main(){gl_Position=vec4(0.,0.,0.,1.);gl_PointSize=1.;}'));
 gl.attachShader(p,sh(gl.FRAGMENT_SHADER,frag)); gl.linkProgram(p);
 if(!gl.getProgramParameter(p,gl.LINK_STATUS)) throw gl.getProgramInfoLog(p);
 gl.useProgram(p);
 const out=[];
 for(const cs of cases){
   const u=(n,v)=>{const l=gl.getUniformLocation(p,n); if(l) gl.uniform4fv(l,v);};
   const cb=new Float32Array(61*4); cb.set(cs.cb||[0,0,0,0],0);
   // CB0[11].y = cam y, CB0[15] lamp, CB0[31] sky
   cb[11*4+1]=cs.camy||0; cb.set(cs.lamp||[1,1,1,0],15*4); cb.set(cs.sky||[0.5,0.6,0.8,0],31*4); cb.set([0,0,0,0],16*4);
   gl.uniform4fv(gl.getUniformLocation(p,'CB0'),cb);
   for(const k of ['RZ8','RZ9','RZ10','RZ11','RZ12','RZ15','RZ16','RZ17','RZ18','RZ19']) u(k,cs[k]);
   u('uIN',cs.uIN);
   gl.drawArrays(gl.POINTS,0,1);
   const px=new Uint8Array(4); gl.readPixels(0,0,1,1,gl.RGBA,gl.UNSIGNED_BYTE,px); out.push(Array.from(px).map(v=>v/255));
 }
 return out;
}"""
D=dict(RZ8=[1,1,0,1],RZ9=[0,1,1,0],RZ10=[0,3,0.3,0],RZ11=[1,1,1,0],RZ12=[0.5,0,1,0],RZ15=[0,0,0,1],RZ16=[0,0,0,0],RZ17=[0,1,1,1],RZ18=[0,0,0,0],RZ19=[1,0,300,0])
def C(**k):
    d=dict(D); d.update(k); return d
cases=[
 C(uIN=[0.37,100,0,0]),                                   #0 identity -> 0.37
 C(uIN=[0.9,100,0,0],RZ15=[0.2,0,0,1]),                   #1 end=100 studs: d=100>=end -> fog full (~0)
 C(uIN=[0.9,50,0,0],RZ15=[0.2,0,0,1]),                    #2 d=50 < 0.6*end=60 -> unchanged 0.9
 C(uIN=[0.5,100,500,1],RZ15=[0,0,1,1],camy=600),          #3 wy=100 high above base 0 -> thin fog -> fd rises (>0.5)
 C(uIN=[0.5,100,0,1],RZ15=[0,0,1,1],camy=0),              #4 wy=0 -> stays 0.5
 C(uIN=[0.5,10,0,0],RZ8=[1,1,0.5,1]),                     #5 start=0.5 (200 studs): d=10 -> no fog -> 1.0
 C(uIN=[0.5,100,0,0],RZ8=[1,1,0,0.5]),                    #6 opacity 0.5 -> a=0.25 -> 0.75
 C(uIN=[0.5,100,0,0],RZ8=[2,1,0,1]),                      #7 intensity 2 -> 1-(1-0.25)=0.25
 C(uIN=[0.5,0,0,0],RZ10=[1,3,0.3,0]),                     #8 rim intensity 1 (r channel)
 C(uIN=[0.5,0,0,0],RZ10=[1,3,0.3,0],RZ18=[0,0,1,0]),      #9 mat sens: base lum .3 -> *0.7
 C(uIN=[0.2,100,0,0],RZ19=[0.5,0,300,0]),                 #10 rough .2 < .5 -> 1
 C(uIN=[0.9,100,0,0],RZ19=[0.5,0,300,0]),                 #11 rough .9 > .75 -> 0
 C(uIN=[0.2,300,0,0],RZ19=[1,1,300,0]),                   #12 fade full at d=300 -> 0
]
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path=CHROME,args=['--use-gl=swiftshader','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
    pg=b.new_page(); r=pg.evaluate(js,[frag,cases]); b.close()
if isinstance(r,str): print(r); sys.exit(1)
for i,x in enumerate(r): print(i,[round(v,2) for v in x])
exp={0:(0,0.37),1:(0,0.0),2:(0,0.9),4:(0,0.5),5:(0,1.0),6:(0,0.75),7:(0,0.25),10:(3,1.0),11:(3,0.0),12:(3,0.0)}
bad=0
for i,(ch,v) in exp.items():
    if abs(r[i][ch]-v)>0.03: print("FAIL",i,r[i][ch],v); bad+=1
if not r[3][0]>0.6: print("FAIL 3"); bad+=1
ratio=r[9][1]/max(r[8][1],1e-6)
if abs(ratio-0.7)>0.06: print("FAIL mat ratio",ratio); bad+=1
print("shader_math: gagal",bad); sys.exit(bad)
