const PROJECT = 'navera-mayfield-village';
const DOMAIN = 'naveramayfieldhomes.com';
const requestCounts = new Map();
const json = (data, status = 200) => new Response(JSON.stringify(data), {status, headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const clean = (value, max = 200) => typeof value === 'string' ? value.trim().slice(0,max) : '';
export async function register(request, env, fetchLead = fetch) {
 if(request.method !== 'POST') return json({error:'Method not allowed.'},405);
 const origin = request.headers.get('origin');
 const allowed = new Set(['https://naveramayfieldhomes.com','https://www.naveramayfieldhomes.com','https://navera-mayfield-homes.nutmegox16.chatgpt.site']);
 for (const host of [env.VERCEL_URL, env.VERCEL_PROJECT_PRODUCTION_URL]) { if (host && /^[a-z0-9.-]+\.vercel\.app$/i.test(host)) allowed.add(`https://${host}`); }
 if(!origin || !allowed.has(origin)) return json({error:'Please submit using the Navera website.'},403);
 if(!(request.headers.get('content-type')||'').includes('application/json')) return json({error:'Invalid submission format.'},415);
 // Read bounded chunks rather than trusting Content-Length.
 const reader=request.body?.getReader();if(!reader)return json({error:'Please complete the form.'},400);
 let bytes=0, chunks=[];
 while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.length;if(bytes>12000){await reader.cancel();return json({error:'The submission is too large.'},413)}chunks.push(value)}
 let input;try{const data=new Uint8Array(bytes);let offset=0;for(const c of chunks){data.set(c,offset);offset+=c.length}input=JSON.parse(new TextDecoder().decode(data))}catch{return json({error:'Please complete the form and try again.'},400)}
 if(!input||typeof input!=='object'||Array.isArray(input))return json({error:'Invalid submission.'},400);
 if(clean(input.website))return json({leadAccepted:false},200);
 const firstName=clean(input.firstName,80),lastName=clean(input.lastName,80),email=clean(input.email,254).toLowerCase(),phone=clean(input.phone,40);
 const isRealtor=clean(input.isRealtor,3),workingWithRealtor=clean(input.workingWithRealtor,40),interest=clean(input.interest,120),heardAbout=clean(input.heardAbout,100);
 if(!firstName||!lastName||!/^\S+@\S+\.\S+$/.test(email)||phone.replace(/\D/g,'').length<10||phone.replace(/\D/g,'').length>15||!['yes','no'].includes(isRealtor)||!workingWithRealtor||!interest||!heardAbout||input.consent!==true)return json({error:'Please complete all required fields and the email consent checkbox.'},400);
 if(!env.LEAD_API_URL||!env.LEAD_API_TOKEN||!env.LEAD_IP_SALT)return json({error:'Registration is temporarily unavailable. Please call 416-910-8923.'},503);
 const ip=request.headers.get('cf-connecting-ip')||'';
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(env.LEAD_IP_SALT+':'+ip));
 const ipHash=Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('').slice(0,32);
 const now=Date.now();for(const [k,v]of requestCounts)if(v.until<now)requestCounts.delete(k);
 const limit=requestCounts.get(ipHash)||{count:0,until:now+10*60*1000};if(limit.count>=5)return json({error:'Too many requests. Please wait a few minutes or call 416-910-8923.'},429);limit.count++;requestCounts.set(ipHash,limit);
 let referer=null,utm={utm_source:null,utm_medium:null,utm_campaign:null};
 try{const u=new URL(clean(input.pageUrl,2000));if(allowed.has(u.origin)){referer=u.origin+u.pathname;for(const key of Object.keys(utm))utm[key]=clean(u.searchParams.get(key),200)||null}}catch{}
 const row={project:PROJECT,domain:DOMAIN,name:`${firstName} ${lastName}`,email,phone,message:null,details:{firstName,lastName,isRealtor,workingWithRealtor,interest,heardAbout,consent:true,smsConsent:input.smsConsent===true,consentVersion:'navera-2026-10-27'},...utm,referer,user_agent:clean(request.headers.get('user-agent'),500)||null,ip_hash:ipHash};
 try{const response=await fetchLead(env.LEAD_API_URL,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${env.LEAD_API_TOKEN}`,Prefer:'return=minimal'},body:JSON.stringify(row),signal:AbortSignal.timeout(10000)});if(response.status!==201)return json({error:'We could not save your enquiry. Please try again or call 416-910-8923.'},503);return json({leadAccepted:true,message:'Thank you. Team Arora has received your Navera enquiry and will follow up with you.'})}catch{return json({error:'We could not save your enquiry. Please try again or call 416-910-8923.'},503)}
}
