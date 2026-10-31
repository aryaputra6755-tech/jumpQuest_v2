# Generator karakter HD (vektor -> PNG). Jalankan: python3 scripts/make_hero.py
import math
from PIL import Image, ImageDraw
K=9; FW,FH=80,112; OUT=3   # frame logis 80x112, output 3x (240x336)
OL=(52,26,20,255); OW=1.7
CH=[('#e53935','#e53935','#2f5fd0',0,'#7a4220'),('#e060c8','#e060c8','#7a4ad0',1,'#6a2f6e'),('#2f7fe0','#2f7fe0','#c83a3a',0,'#2f2f55'),('#2faa3a','#2faa3a','#2f5fd0',0,'#5a3a1a')]
def col(h,f=1.0):
    h=h.lstrip('#');r,g,b=[int(h[i:i+2],16) for i in(0,2,4)]
    f2=lambda v:max(0,min(255,int(v*f if f<=1 else v+(255-v)*(f-1))))
    return (f2(r),f2(g),f2(b),255)
SKIN=col('#ffd5b0');WHITE=(255,255,255,255)
def pose(i):
    P=dict(b=0,tilt=0,bf=(32,105),ff=(49,105),bh=(27,67),fh=(55,67),eyes='open',mouth='smile',bend=3,bend2=3)
    if 1<=i<=4:
        ph=(i-1)*math.pi/2+.4;s,c=math.sin(ph),math.cos(ph)
        P.update(b=-abs(c)*2.5,tilt=-5,ff=(41+13*s,105-max(0,c)*10),bf=(39-13*s,105-max(0,-c)*10),fh=(51-12*s,66-3*c),bh=(31+12*s,66+3*c),bend=5,bend2=5)
    elif i==5:P.update(b=-3,tilt=-3,bf=(26,99),ff=(54,91),bh=(21,47),fh=(61,43),bend=-6,bend2=7,mouth='open')
    elif i==6:P.update(b=0,bf=(29,105),ff=(52,103),bh=(19,52),fh=(62,50),mouth='open',eyes='wide')
    elif i==7:P.update(tilt=9,bf=(28,105),ff=(52,105),bh=(18,62),fh=(63,58),eyes='hurt',mouth='open')
    elif i==8:P.update(tilt=24,bf=(30,103),ff=(52,100),bh=(18,52),fh=(62,48),eyes='dead',mouth='open',bend=-4,bend2=6)
    return P
def render(i,cfg):
    cap,sh,ov,girl,hair=cfg;cap_c,sh_c,ov_c,hair_c=col(cap),col(sh),col(ov),col(hair)
    P=pose(i);im=Image.new('RGBA',(FW*K,FH*K),(0,0,0,0));d=ImageDraw.Draw(im);ow=int(OW*K)
    p=lambda v:v*K
    def ell(cx,cy,rx,ry,fill,out=True):d.ellipse([p(cx-rx),p(cy-ry),p(cx+rx),p(cy+ry)],fill=fill,outline=OL if out else None,width=ow)
    def poly(pts,fill,out=True):
        q=[(p(x),p(y)) for x,y in pts];d.polygon(q,fill=fill)
        if out:d.line(q+[q[0]],fill=OL,width=ow,joint='curve')
    def limb(pts,w,fill):
        q=[(p(x),p(y)) for x,y in pts]
        for width,c in((p(w)+2*ow,OL),(p(w),fill)):
            d.line(q,fill=c,width=int(width),joint='curve')
            for x,y in q:d.ellipse([x-width/2,y-width/2,x+width/2,y+width/2],fill=c)
    hx,hy=41,36+P['b'];hip=(hx-2,hy+39)
    def knee(a,b,bend):
        mx,my=(a[0]+b[0])/2,(a[1]+b[1])/2;return(mx+bend,my)
    def leg(f,bend):
        limb([hip,knee(hip,(f[0],f[1]-4),bend),(f[0],f[1]-4)],9.5,ov_c)
        ell(f[0]+3.5,f[1]+.5,9.5,5.6,WHITE);d.line([(p(f[0]-5),p(f[1]+4.2)),(p(f[0]+12),p(f[1]+4.2))],fill=(150,150,170,255),width=int(1.2*K))
        ell(f[0]+9,f[1]-1.5,2.2,1.6,(255,255,255,255),False)
    def arm(sx,sy,h,sgn):
        mx,my=(sx+h[0])/2,(sy+h[1])/2;vx,vy=h[0]-sx,h[1]-sy;n=math.hypot(vx,vy) or 1;px,py=-vy/n*4.5,vx/n*4.5
        if py<0:px,py=-px,-py
        limb([(sx,sy),(mx+px,my+py),h],7.4,sh_c);ell(h[0],h[1],4.9,4.9,SKIN)
    # rambut belakang / kuncir
    if girl:
        ell(hx-24,hy+3,6.5,8.5,hair_c);ell(hx-28,hy+16,5.2,10.5,hair_c)
    arm(hx-10,hy+22,P['bh'],-1);leg(P['bf'],P['bend']);leg(P['ff'],P['bend2'])
    # badan
    poly([(hx-12,hy+18),(hx+9,hy+18),(hx+11,hy+30),(hx+10,hy+41),(hx-13,hy+41),(hx-14,hy+30)],sh_c)
    d.rounded_rectangle([p(hx-13),p(hy+29),p(hx+10),p(hy+42)],radius=p(5),fill=ov_c,outline=OL,width=ow)
    for sx in(hx-8,hx+5):poly([(sx-1.6,hy+19),(sx+1.6,hy+19),(sx+1.8,hy+30),(sx-1.8,hy+30)],ov_c)
    ell(hx-7,hy+31,1.8,1.8,col('#ffd23f'));ell(hx+4,hy+31,1.8,1.8,col('#ffd23f'))
    ell(hx-1,hy+19,12,4.2,col(sh,1.25))   # syal
    # kepala
    ell(hx-5,hy-2,23,21,hair_c)
    ell(hx+1,hy+1,21,19,SKIN);ell(hx-19,hy+3,4,5,SKIN)
    # poni + cambang
    poly([(hx-21,hy-10),(hx-20,hy+9),(hx-15,hy+3),(hx-14,hy-10)],hair_c)
    for a in range(5):
        x0=hx-12+a*6.5;poly([(x0,hy-10),(x0+7,hy-10),(x0+3.5+(1.5 if a%2 else -1),hy-1.5)],hair_c)
    # mata
    e=P['eyes']
    for ex in(hx+1.5,hx+14):
        ey=hy+4
        if e in('open','wide'):
            ry=6.2 if e=='wide' else 5.4;ell(ex,ey,3.9,ry,(42,29,51,255),False);ell(ex,ey+1.5,2.6,ry*.55,(96,64,150,255),False)
            ell(ex-1.2,ey-1.8,1.5,1.5,WHITE,False);ell(ex+1.2,ey+2.2,.8,.8,WHITE,False)
        elif e=='hurt':
            s=1 if ex<hx+8 else -1;d.line([(p(ex-3*s),p(ey-3)),(p(ex+3*s),p(ey)),(p(ex-3*s),p(ey+3))],fill=OL,width=ow)
        else:
            d.line([(p(ex-3),p(ey-3)),(p(ex+3),p(ey+3))],fill=OL,width=ow);d.line([(p(ex-3),p(ey+3)),(p(ex+3),p(ey-3))],fill=OL,width=ow)
    for bx in(hx-1,hx+17):ell(bx,hy+11,3.4,2,(255,150,150,255),False)
    if P['mouth']=='smile':d.arc([p(hx+5),p(hy+8),p(hx+13),p(hy+15)],15,165,fill=OL,width=ow)
    else:ell(hx+9,hy+12.5,2.8,3.3,(120,40,50,255))
    # topi
    d.pieslice([p(hx-25),p(hy-33),p(hx+25),p(hy+13)],180,360,fill=cap_c,outline=OL,width=ow)
    d.line([(p(hx-25),p(hy-10)),(p(hx+25),p(hy-10))],fill=OL,width=ow)
    ell(hx-10,hy-24,7,3.2,col(cap,1.5),False)
    ell(hx+17,hy-8,14.5,4.8,col(cap,.72))
    ell(hx+4,hy-21,6.4,6.4,WHITE)
    st=[(hx+4+(4.6 if k%2==0 else 2.0)*math.cos(k*math.pi/5-math.pi/2),hy-21+(4.6 if k%2==0 else 2.0)*math.sin(k*math.pi/5-math.pi/2)) for k in range(10)]
    poly(st,cap_c,False)
    if girl:poly([(hx-22,hy-8),(hx-30,hy-14),(hx-30,hy-2)],col('#ff5fa8'));poly([(hx-22,hy-8),(hx-14,hy-14),(hx-14,hy-2)],col('#ff5fa8'));ell(hx-22,hy-8,2.4,2.4,col('#ffd23f'))
    arm(hx+9,hy+22,P['fh'],1)
    if P['tilt']:im=im.rotate(P['tilt'],center=(p(40),p(80)),resample=Image.BICUBIC)
    return im.resize((FW*OUT,FH*OUT),Image.LANCZOS)
if __name__=='__main__':
    for n,cfg in enumerate(CH):
        fr=[render(i,cfg) for i in range(9)];sheet=Image.new('RGBA',(FW*OUT*9,FH*OUT))
        for i,f in enumerate(fr):sheet.paste(f,(i*FW*OUT,0))
        sheet.save(f'assets/hero{n}.png',optimize=True)
        f=fr[0];bb=f.getbbox();f.crop((max(0,bb[0]-3),max(0,bb[1]-3),min(f.width,bb[2]+3),min(f.height,bb[3]+3))).save(f'assets/ch{n}.png',optimize=True)
