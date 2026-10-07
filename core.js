/* Pure validation/navigation helpers, also exercised by Node tests. */
(function(root){'use strict';
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const naturalSort=files=>[...files].sort((a,b)=>a.name.localeCompare(b.name,'en',{numeric:true,sensitivity:'base'}));
function validateFiles(files){if(!files.length)throw Error('請至少選取一張圖片。');if(files.length>100)throw Error('最多可匯入 100 張圖片。');let total=0;for(const f of files){if(!/\.(jpe?g|png|webp)$/i.test(f.name))throw Error('僅接受 JPG、PNG 或 WebP 圖片。');if(!f.size||f.size>12*1024*1024)throw Error('每張圖片須為 1 byte 至 12 MB。');total+=f.size;}if(total>160*1024*1024)throw Error('圖片總大小不可超過 160 MB。');return naturalSort(files);}
function detectType(b){if(b[0]===255&&b[1]===216&&b[2]===255)return'image/jpeg';if([137,80,78,71,13,10,26,10].every((v,i)=>b[i]===v))return'image/png';if(String.fromCharCode(...b.slice(0,4))==='RIFF'&&String.fromCharCode(...b.slice(8,12))==='WEBP')return'image/webp';throw Error('檔案內容不是支援的圖片格式。');}
function imageSize(b,type){
 const u16=(i)=>b[i]*256+b[i+1],u32=(i)=>(b[i]*16777216+b[i+1]*65536+b[i+2]*256+b[i+3]);
 if(type==='image/png'&&b.length>=24)return[u32(16),u32(20)];
 if(type==='image/webp'&&b.length>=30){const kind=String.fromCharCode(...b.slice(12,16));if(kind==='VP8X')return[1+b[24]+b[25]*256+b[26]*65536,1+b[27]+b[28]*256+b[29]*65536];if(kind==='VP8L'&&b[20]===47)return[1+(b[21]|((b[22]&63)<<8)),1+((b[22]>>6)|(b[23]<<2)|((b[24]&15)<<10))];if(kind==='VP8 '&&b[23]===157&&b[24]===1&&b[25]===42)return[(b[26]|b[27]<<8)&16383,(b[28]|b[29]<<8)&16383];}
 if(type==='image/jpeg'){let i=2;while(i+4<b.length){if(b[i]!==255){i++;continue;}let marker=b[++i];while(marker===255)marker=b[++i];i++;if(marker===217||marker===218)break;if(marker===1||marker>=208&&marker<=215)continue;const length=u16(i);if(length<2||i+length>b.length)break;if([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker)&&length>=7)return[u16(i+5),u16(i+3)];i+=length;}}
 throw Error('無法安全辨識圖片尺寸。請另存為標準 JPG、PNG 或 WebP。');
}
function bookKey(files){let h=2166136261;for(const f of files){const text=[f.name,f.size,f.lastModified].join('|');for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}}return'local-'+(h>>>0).toString(16);}
function safeState(raw){try{const x=JSON.parse(raw);if(!x||typeof x!=='object')return{};return{favorites:Array.isArray(x.favorites)?x.favorites.filter(i=>Number.isInteger(i)&&i>=1&&i<=10):[],progress:x.progress&&typeof x.progress==='object'&&!Array.isArray(x.progress)?Object.fromEntries(Object.entries(x.progress).filter(([k,v])=>/^(sample|local-[a-f0-9]+)$/.test(k)&&Number.isInteger(v)&&v>=0&&v<100)): {},mode:x.mode==='scroll'?'scroll':'page',direction:x.direction==='ltr'?'ltr':'rtl'};}catch{return{};}}
const api={clamp,naturalSort,validateFiles,detectType,imageSize,bookKey,safeState};root.SumiCore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
