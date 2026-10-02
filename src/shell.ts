import {useEffect,useState} from 'react';
export type ShellState={state:'checking'|'ready'|'error';detail:string};
export function useOfflineShell(){
 const [result,setResult]=useState<ShellState>({state:'checking',detail:''});
 useEffect(()=>{
  let ended=false;let channel:MessageChannel|null=null;
  const error=(detail:string)=>{if(!ended)setResult({state:'error',detail})};
  const check=()=>{
   channel?.port1.close();const worker=navigator.serviceWorker.controller;
   if(!worker){if(!ended)setResult({state:'checking',detail:'Waiting for this page to be controlled. Reload online if this stays pending.'});return}
   channel=new MessageChannel();channel.port1.onmessage=e=>{const d=e.data;if(d?.type!=='ROOP_SHELL_AUDIT'||ended)return;
    setResult(d.complete?{state:'ready',detail:''}:{state:'error',detail:d.missing?.length?'Missing page files: '+d.missing.join(', '):'Offline page cache could not be checked.'});channel?.port1.close()};
   worker.postMessage({type:'ROOP_SHELL_AUDIT'},[channel.port2]);
  };
  if(!('serviceWorker' in navigator)){error('This browser does not offer offline page storage.');return}
  navigator.serviceWorker.addEventListener('controllerchange',check);
  const timer=setTimeout(()=>{if(!ended)setResult(prev=>prev.state==='ready'?prev:{state:'error',detail:'Offline page storage not confirmed. Stay online and reload once. Do not erase website data.'})},15000);
  navigator.serviceWorker.register('./sw.js').then(()=>{check();navigator.serviceWorker.ready.then(check)}).catch(()=>error('Offline page installation failed. Stay online and reload once.'));
  return()=>{ended=true;clearTimeout(timer);channel?.port1.close();navigator.serviceWorker.removeEventListener('controllerchange',check)};
 },[]);
 return result;
}
