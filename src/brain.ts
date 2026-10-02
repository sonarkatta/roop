import type {MLCEngineInterface} from '@mlc-ai/web-llm';
export type Message={role:'user'|'assistant';text:string;at:number};
export const MODEL='SmolLM2-135M-Instruct-q0f16-MLC';
let engine:MLCEngineInterface|null=null;
let epoch=0;
export async function compatibility(){
 const gpu=(navigator as any).gpu;
 if(!isSecureContext||!gpu)return {ok:false,reason:'WebGPU is not available here. On iPhone, use Safari on iOS 26 or later. Your notes still work.'};
 const adapter=await gpu.requestAdapter();
 if(!adapter)return {ok:false,reason:'This browser could not open the GPU. Your notes still work.'};
 if(!adapter.features.has('shader-f16'))return {ok:false,reason:'This GPU does not offer the feature this tiny trial needs. No model was downloaded.'};
 return {ok:true,reason:'GPU features are available. This does not prove the model will fit or answer well on your phone.'};
}
export async function startBrain(progress:(p:number,text:string)=>void){
 const check=await compatibility();if(!check.ok)throw Error(check.reason);
 const session=++epoch;
 const {CreateMLCEngine,prebuiltAppConfig}=await import('@mlc-ai/web-llm');
 const model=prebuiltAppConfig.model_list.find(m=>m.model_id===MODEL);if(!model)throw Error('Trial model is unavailable.');
 const created=await CreateMLCEngine(MODEL,{appConfig:{model_list:[model],cacheBackend:'cache'},initProgressCallback:r=>{if(session===epoch)progress(r.progress,r.text)}},{context_window_size:512});
 if(session!==epoch){await created.unload();throw Error('Loading stopped because the space was locked.');}
 engine=created;
 return true;
}
export function stopBrain(){epoch++;const old=engine;engine=null;if(old){old.interruptGenerate();void old.unload().catch(()=>{})}}
export const disconnectedBrain={async reply(text:string,language:'mr'|'en',history:Message[]=[]){
 if(!engine)return language==='mr'?'तुझा विचार या सत्रात नोंदवला. खाली जतन करण्याची स्थिती तपास. AI अजून जोडलेला नाही.':'Your thought is captured for this session. Check the saving status below. No AI brain is connected.';
 const session=epoch;
 const recent=history.slice(-4).map(m=>({role:m.role,content:m.text.slice(0,200)}));
 const result=await engine.chat.completions.create({messages:[{role:'system',content:'You are Roop, a small local AI trial. Reply briefly in English. Say when you do not know. Do not claim to be a strong model or know personal facts.'},...recent,{role:'user',content:text.slice(0,500)}],max_tokens:96,temperature:0.4});
 if(session!==epoch)throw Error('Space locked. Reply discarded.');
 return result.choices[0]?.message.content||'No answer was generated. This tiny trial may not handle this question.';
}};
