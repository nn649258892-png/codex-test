(function(root){
  const digits = s => [...s].map(Number);
  function describe(n){const d=digits(n),distinct=new Set(d).size;return {n,sum:d.reduce((a,b)=>a+b,0),span:Math.max(...d)-Math.min(...d),odd:d.filter(x=>x%2).length,big:d.filter(x=>x>=5).length,shape:distinct===1?'triple':distinct===2?'pair':'distinct',routes:d.map(x=>x%3).join('')};}
  const universe=Array.from({length:1000},(_,i)=>describe(String(i).padStart(3,'0')));
  function filter(f){return universe.filter(x=>{
    const d=digits(x.n);
    if(f.mode==='g3'&&(x.shape!=='pair'||x.n!==[...x.n].sort().join('')))return false;
    if(f.mode==='g6'&&(x.shape!=='distinct'||x.n!==[...x.n].sort().join('')))return false;
    return x.sum>=f.sumMin&&x.sum<=f.sumMax&&x.span>=f.spanMin&&x.span<=f.spanMax&&
      (f.odd===''||x.odd===Number(f.odd))&&(f.big===''||x.big===Number(f.big))&&
      (f.shape===''||x.shape===f.shape)&&(!f.route||[...x.routes].sort().join('')===f.route)&&
      d.every((n,i)=>(f.mode==='straight'?f.positions[i]:f.pool).includes(n))&&
      (f.include||[]).every(n=>d.includes(n))&&!(f.exclude||[]).some(n=>d.includes(n));
  });}
  function randomInt(max){const limit=Math.floor(4294967296/max)*max;let v;do{v=crypto.getRandomValues(new Uint32Array(1))[0];}while(v>=limit);return v%max;}
  function sample(items,count){const a=[...items];for(let i=a.length-1;i>0;i--){const j=randomInt(i+1);[a[i],a[j]]=[a[j],a[i]];}return a.slice(0,count);}
  function parseHistory(text){const rows=[],issues=new Set();const lines=text.replace(/^\uFEFF/,'').split(/\r?\n/);for(let i=0;i<lines.length;i++){let line=lines[i].trim();if(!line)continue;if(i===0&&/期号|issue/i.test(line))continue;const parts=line.split(/[,，\s\t]+/);let issue,number;if(parts.length===1){issue=String(rows.length+1);number=parts[0];}else if(parts.length===2){[issue,number]=parts;}else if(parts.length===4&&parts.slice(1).every(p=>/^\d$/.test(p))){issue=parts[0];number=parts.slice(1).join('');}else throw Error('第 '+(i+1)+' 行格式不正确，请使用“期号,三位号码”。');if(!/^\d{3}$/.test(number)||!/^\d{1,12}$/.test(issue))throw Error('第 '+(i+1)+' 行须包含数字期号和完整三位号码（保留前导 0）。');if(issues.has(issue))throw Error('第 '+(i+1)+' 行期号重复：'+issue);issues.add(issue);rows.push({issue,...describe(number)});if(rows.length>10000)throw Error('最多导入 10,000 期。');}if(!rows.length)throw Error('请先输入历史数据。');return rows;}
  function stats(rows){return Array.from({length:10},(_,digit)=>{let omission=0;for(let i=rows.length-1;i>=0&&!rows[i].n.includes(String(digit));i--)omission++;return {digit,count:rows.reduce((n,r)=>n+[...r.n].filter(x=>+x===digit).length,0),omission,unseen:omission===rows.length};});}
  const api={universe,describe,filter,sample,parseHistory,stats};if(typeof module!=='undefined')module.exports=api;root.Lottery=api;
})(globalThis);
