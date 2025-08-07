import{r as y}from"./index.7-fRwNhn.js";import{u as h}from"./index.DVFN_t0d.js";import{c as s}from"./index.CuufFikk.js";function S(e){const[f,r]=y.useState(void 0);return h(()=>{if(e){r({width:e.offsetWidth,height:e.offsetHeight});const a=new ResizeObserver(o=>{if(!Array.isArray(o)||!o.length)return;const n=o[0];let i,t;if("borderBoxSize"in n){const c=n.borderBoxSize,d=Array.isArray(c)?c[0]:c;i=d.inlineSize,t=d.blockSize}else i=e.offsetWidth,t=e.offsetHeight;r({width:i,height:t})});return a.observe(e,{box:"border-box"}),()=>a.unobserve(e)}else r(void 0)},[e]),f}/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],p=s("check",u);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],g=s("circle-alert",l);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]],v=s("loader-circle",b);export{g as C,v as L,p as a,S as u};
//# sourceMappingURL=loader-circle.D8v-saPC.js.map
