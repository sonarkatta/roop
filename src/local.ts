import {useEffect,useState} from 'react';
// Only an encrypted envelope is stored. No passphrase, key or plaintext is persisted.
export function useLocalState<T>(key:string,initial:T):[T,(v:T)=>void,{ready:boolean;message:string}]{
 const [value,setValue]=useState<T>(initial);const [ready,setReady]=useState(false);const [message,setMessage]=useState('Loading saved notes...');
 useEffect(()=>{try{const raw=localStorage.getItem(key);if(raw)setValue(JSON.parse(raw));setMessage(raw?'Encrypted notes found on this device.':'Ready. Notes will be encrypted on this device.')}catch{setMessage('Storage unavailable. Do not rely on saving in this browser.')}setReady(true)},[key]);
 const save=(next:T)=>{try{if(next===null)localStorage.removeItem(key);else localStorage.setItem(key,JSON.stringify(next));setValue(next);setMessage(next===null?'All stored notes erased.':'Saved encrypted on this device.')}catch{throw new Error('Storage failed. Notes were not saved.')}};
 return [value,save,{ready,message}];
}
