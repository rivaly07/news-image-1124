import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { deflateSync } from 'node:zlib';

// Offline editorial card. No date-specific reporting is bundled in the kit or this repository,
// so the art deliberately labels the missing reporting rather than inventing headlines.
const W = 960, H = 960;
const pixels = Buffer.alloc(W * H * 4);
const C = { bg:[7,14,30], panel:[13,27,48], white:[239,245,250], muted:[144,166,187], cyan:[77,222,228], gold:[255,190,85], red:[255,105,105], line:[36,63,87] };
function rect(x:number,y:number,w:number,h:number,c:number[]) { for(let yy=Math.max(0,y);yy<Math.min(H,y+h);yy++) for(let xx=Math.max(0,x);xx<Math.min(W,x+w);xx++) put(xx,yy,c); }
function put(x:number,y:number,c:number[]) { const i=(y*W+x)*4; pixels[i]=c[0];pixels[i+1]=c[1];pixels[i+2]=c[2];pixels[i+3]=255; }
function line(x0:number,y0:number,x1:number,y1:number,c:number[],th=1) { let dx=Math.abs(x1-x0), sx=x0<x1?1:-1, dy=-Math.abs(y1-y0), sy=y0<y1?1:-1, err=dx+dy; for(;;){rect(x0-th>>1,y0-th>>1,th,th,c);if(x0===x1&&y0===y1)break;const e=2*err;if(e>=dy){err+=dy;x0+=sx}if(e<=dx){err+=dx;y0+=sy}} }
const glyph:Record<string,string[]> = {
'A':['01110','10001','10001','11111','10001','10001','10001'],'B':['11110','10001','10001','11110','10001','10001','11110'],'C':['01111','10000','10000','10000','10000','10000','01111'],'D':['11110','10001','10001','10001','10001','10001','11110'],'E':['11111','10000','10000','11110','10000','10000','11111'],'F':['11111','10000','10000','11110','10000','10000','10000'],'G':['01111','10000','10000','10111','10001','10001','01111'],'H':['10001','10001','10001','11111','10001','10001','10001'],'I':['11111','00100','00100','00100','00100','00100','11111'],'J':['00111','00010','00010','00010','10010','10010','01100'],'K':['10001','10010','10100','11000','10100','10010','10001'],'L':['10000','10000','10000','10000','10000','10000','11111'],'M':['10001','11011','10101','10101','10001','10001','10001'],'N':['10001','11001','10101','10011','10001','10001','10001'],'O':['01110','10001','10001','10001','10001','10001','01110'],'P':['11110','10001','10001','11110','10000','10000','10000'],'Q':['01110','10001','10001','10001','10101','10010','01101'],'R':['11110','10001','10001','11110','10100','10010','10001'],'S':['01111','10000','10000','01110','00001','00001','11110'],'T':['11111','00100','00100','00100','00100','00100','00100'],'U':['10001','10001','10001','10001','10001','10001','01110'],'V':['10001','10001','10001','10001','10001','01010','00100'],'W':['10001','10001','10001','10101','10101','10101','01010'],'X':['10001','10001','01010','00100','01010','10001','10001'],'Y':['10001','10001','01010','00100','00100','00100','00100'],'Z':['11111','00001','00010','00100','01000','10000','11111'],'0':['01110','10001','10011','10101','11001','10001','01110'],'1':['00100','01100','00100','00100','00100','00100','01110'],'2':['01110','10001','00001','00010','00100','01000','11111'],'4':['00010','00110','01010','10010','11111','00010','00010'],'6':['00110','01000','10000','11110','10001','10001','01110'],'8':['01110','10001','10001','01110','10001','10001','01110'],':':['00000','00100','00100','00000','00100','00100','00000'],'/':['00001','00010','00100','01000','10000','00000','00000'],'-':['00000','00000','00000','11111','00000','00000','00000'],'.':['00000','00000','00000','00000','00000','00110','00110']
};
function text(s:string,x:number,y:number,scale:number,c:number[]) { let at=x; for(const ch of s.toUpperCase()){if(ch===' '){at+=4*scale;continue}const g=glyph[ch];if(g)for(let r=0;r<7;r++)for(let k=0;k<5;k++)if(g[r][k]==='1')rect(at+k*scale,y+r*scale,scale,scale,c);at+=6*scale;} }
// Deterministic midnight-blue field with restrained editorial grid.
rect(0,0,W,H,C.bg);
for(let y=18;y<H;y+=32)line(0,y,W-1,y,[11,22,39]);
rect(46,44,8,52,C.cyan); text('WORLD / NEWS DESK',72,48,3,C.white);
text('TUESDAY 24 NOVEMBER 2026',590,55,2,C.muted);
line(46,118,914,118,C.line,2);
text('THE DAY,',48,150,10,C.white); text('IN CONTEXT',48,250,10,C.cyan);
// Stylised globe: concentric rings and longitude/latitude arcs.
const cx=760,cy=335,r=112; // Keep the globe clear of the oversized headline.
for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++){const d=x*x+y*y;if(d<=r*r){const edge=Math.sqrt(r*r-d);if(Math.abs(x*x+y*y-r*r)<r*2||Math.abs(x)<2||Math.abs(y)<2||Math.abs(y)-edge*.52<2)put(cx+x,cy+y,C.cyan);}}
for(let yy=cy-r;yy<=cy+r;yy++){const dy=yy-cy, span=Math.sqrt(Math.max(0,r*r-dy*dy)); for(let xx=cx-span;xx<=cx+span;xx+=1){const f=(xx-cx)/r; if(((Math.floor((xx+yy)/9)%13)===0)&&Math.abs(dy)<r*.86&&Math.abs(f)<.92)put(Math.round(xx),yy,[23,63,78]);}}
// Information card: clearly distinguishes verified date from unavailable reporting.
rect(46,470,868,306,C.panel); rect(46,470,8,306,C.gold);
text('WHAT WE CAN VERIFY',78,500,3,C.gold);
text('THE DATE IS SET.',78,550,4,C.white);
text('THE HEADLINES ARE NOT.',78,590,4,C.white);
line(78,634,880,634,C.line,2);
text('NO LOCAL DATE-SPECIFIC SOURCES',78,663,3,C.cyan);
text('WERE AVAILABLE TO VERIFY EVENTS.',78,699,3,C.cyan);
text('NO STORIES HAVE BEEN INVENTED.',78,735,3,C.muted);
rect(46,816,868,2,C.line);
text('24 NOV 2026',48,842,3,C.white); text('GLOBAL BRIEF / EVIDENCE FIRST',560,842,2,C.muted);
text('MAKE.FUN  /  WORLD NEWS',48,890,2,C.muted);

function chunk(type:string,data:Buffer){const name=Buffer.from(type);const body=Buffer.concat([name,data]);const crc=crc32(body);const out=Buffer.alloc(12+data.length);out.writeUInt32BE(data.length,0);body.copy(out,4);out.writeUInt32BE(crc,8+data.length);return out}
function crc32(b:Buffer){let c=0xffffffff;for(const v of b){c^=v;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1}return(c^0xffffffff)>>>0}
const raw=Buffer.alloc(H*(1+W*4));for(let y=0;y<H;y++){const row=y*(1+W*4);raw[row]=0;pixels.copy(raw,row+1,y*W*4,(y+1)*W*4)}
const png=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',(()=>{const b=Buffer.alloc(13);b.writeUInt32BE(W,0);b.writeUInt32BE(H,4);b[8]=8;b[9]=6;return b})()),chunk('IDAT',deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]);
if(png.length>1048576)throw new Error('PNG exceeds 1 MiB');
const out=process.env.MAKEFUN_OUTPUT_DIR||'/output';mkdirSync(out,{recursive:true});writeFileSync(join(out,'entry.png'),png);
