import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
const dir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const b = readFileSync(join(dir, 'entry.png'));
assert.deepEqual([...b.subarray(0, 8)], [137,80,78,71,13,10,26,10], 'PNG signature');
assert(b.length <= 1048576, `size ${b.length} exceeds 1 MiB`);
let p = 8, ended = false, sawHeader = false, sawData = false;
function crc32(data) { let c=0xffffffff; for(const v of data){c^=v;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;} return (c^0xffffffff)>>>0; }
while (p < b.length) {
  assert(p + 12 <= b.length, 'truncated chunk');
  const n=b.readUInt32BE(p), type=b.toString('ascii',p+4,p+8), end=p+12+n;
  assert(end<=b.length, `truncated ${type}`);
  assert.equal(crc32(b.subarray(p+4,p+8+n)), b.readUInt32BE(p+8+n), `CRC ${type}`);
  if(type==='IHDR'){assert(!sawHeader);sawHeader=true;assert.equal(b.readUInt32BE(p+8),960);assert.equal(b.readUInt32BE(p+12),960);}
  if(type==='IDAT')sawData=true;
  p=end;
  if(type==='IEND'){assert.equal(n,0);ended=true;break;}
}
assert(ended && sawHeader && sawData, 'missing required chunks');
assert.equal(p,b.length,'trailing bytes');
console.log(`OK: ${b.length} bytes, 960x960 PNG, complete chunks and CRCs`);
