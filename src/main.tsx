import React from 'react';
import {createRoot} from 'react-dom/client';
import {App} from './App';
class SafeBoundary extends React.Component<{children:React.ReactNode},{failed:boolean}>{
 state={failed:false}; static getDerivedStateFromError(){return {failed:true}}
 render(){return this.state.failed?<main style={{padding:30,fontFamily:'system-ui'}}><h1>Roop</h1><p>The page could not start. Open it in Safari or Chrome and reload. Your stored notes were not erased.</p></main>:this.props.children}
}
createRoot(document.getElementById('root')!).render(<SafeBoundary><App/></SafeBoundary>);
