import{c as e,n as t,r as n,t as r}from"./api-CFCfltoH.js";import{n as i,s as a}from"./index-DWBbuKnn.js";var o=a(`eye-off`,[[`path`,{d:`M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49`,key:`ct8e1f`}],[`path`,{d:`M14.084 14.158a3 3 0 0 1-4.242-4.242`,key:`151rxh`}],[`path`,{d:`M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143`,key:`13bj9a`}],[`path`,{d:`m2 2 20 20`,key:`1ooewy`}]]),s=a(`eye`,[[`path`,{d:`M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0`,key:`1nclc0`}],[`circle`,{cx:`12`,cy:`12`,r:`3`,key:`1v7zrd`}]]),c=a(`key-round`,[[`path`,{d:`M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z`,key:`1s6t7t`}],[`circle`,{cx:`16.5`,cy:`7.5`,r:`.5`,fill:`currentColor`,key:`w0ekpg`}]]),l=a(`pencil`,[[`path`,{d:`M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z`,key:`1a8usu`}],[`path`,{d:`m15 5 4 4`,key:`1mk7zo`}]]),u=e(n(),1),d=t(),f=()=>({name:localStorage.getItem(`user_name`)||`User`,email:localStorage.getItem(`email`)||`Not available`,role:localStorage.getItem(`role`)||`user`}),p=e=>e==null||e===``?`Not available`:e,m=(e,t)=>e.response?.data?.message||e.response?.data?.detail||t;function h(){let e=localStorage.getItem(`role`)||`user`,[t,n]=(0,u.useState)(f),[i,a]=(0,u.useState)({}),[o,s]=(0,u.useState)(!0),[h,g]=(0,u.useState)(!1),[y,b]=(0,u.useState)(!1),[x,S]=(0,u.useState)({}),[C,w]=(0,u.useState)({current_password:``,new_password:``}),[T,E]=(0,u.useState)(``);(0,u.useEffect)(()=>{D()},[]);async function D(){try{let e=(await r.get(`/profile/me`)).data||{};n(e),S(e),localStorage.setItem(`user_name`,e.user_name||e.name||f().name),e.email&&localStorage.setItem(`email`,e.email)}catch{n(f()),S(f()),E(`Profile service is unavailable; showing saved session details.`)}try{if(e===`farmer`){let[e,t]=await Promise.all([r.get(`/assignments/me`),r.get(`/baby-crops/`)]);a({"Crop assignments":e.data?.length||0,"Active crops":(t.data||[]).filter(e=>e.growth_stage!==`harvest`).length,"Total orders":0})}else if(e===`shop`){let[e,t,n]=await Promise.all([r.get(`/baby-crops/marketplace`),r.get(`/orders/me`),r.get(`/demand/me`)]);a({"Marketplace purchases":e.data?.length||0,Orders:t.data?.length||0,"Demand requests":n.data?.length||0})}}catch{}finally{s(!1)}}let O=(0,u.useMemo)(()=>{let t=[[`Name`,`name`],[`Email`,`email`],[`Phone number`,`phone`]];return e===`farmer`?[...t,[`Village`,`village`],[`District`,`district`],[`Soil type`,`soil_type`],[`Land acres`,`land_acres`]]:e===`shop`?[...t,[`Shop name`,`shop_name`],[`Shop location`,`location`]]:t},[e]);async function k(e){e.preventDefault();try{let e=(await r.put(`/profile/me`,x)).data||x;n(e),S(e),localStorage.setItem(`user_name`,e.user_name||e.name||`User`),window.dispatchEvent(new Event(`cropverse-profile-updated`)),g(!1),E(`Profile updated successfully.`)}catch(e){E(m(e,`Could not update profile. Please try again.`))}}async function A(e){e.preventDefault();try{await r.put(`/profile/change-password`,C),w({current_password:``,new_password:``}),b(!1),E(`Password changed successfully.`)}catch(e){E(m(e,`Could not change password.`))}}let j=[[`Role`,e],[`Account created`,t.created_at?new Date(t.created_at).toLocaleDateString():`Not available`],[`Last login`,t.last_login?new Date(t.last_login).toLocaleString():`Not available`]];return o?(0,d.jsx)(`div`,{className:`rounded-3xl border border-white/10 bg-white/5 p-10 text-center`,children:`Loading profile...`}):(0,d.jsxs)(`div`,{className:`text-white`,children:[(0,d.jsxs)(`div`,{className:`mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between`,children:[(0,d.jsxs)(`div`,{children:[(0,d.jsx)(`h1`,{className:`text-3xl font-bold`,children:`Your Profile`}),(0,d.jsx)(`p`,{className:`mt-2 text-slate-400`,children:`Your Cropverse account and activity at a glance.`})]}),(0,d.jsxs)(`div`,{className:`flex flex-wrap gap-3`,children:[(0,d.jsxs)(`button`,{onClick:()=>g(!0),className:`flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-medium hover:bg-emerald-500`,children:[(0,d.jsx)(l,{size:17}),`Edit profile`]}),(0,d.jsxs)(`button`,{onClick:()=>b(!0),className:`flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 hover:bg-white/10`,children:[(0,d.jsx)(c,{size:17}),`Change password`]})]})]}),T&&(0,d.jsx)(`div`,{className:`mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-200`,children:T}),(0,d.jsxs)(`div`,{className:`grid gap-6 lg:grid-cols-3`,children:[(0,d.jsxs)(`section`,{className:`rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:col-span-2`,children:[(0,d.jsx)(`div`,{className:`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-3xl`,children:`🌾`}),(0,d.jsx)(`h2`,{className:`text-xl font-semibold`,children:`Account details`}),(0,d.jsx)(`div`,{className:`mt-5 grid gap-5 sm:grid-cols-2`,children:O.map(([e,n])=>(0,d.jsxs)(`div`,{children:[(0,d.jsx)(`p`,{className:`text-sm text-slate-400`,children:e}),(0,d.jsx)(`p`,{className:`mt-1 break-words font-medium`,children:p(t[n]??(n===`name`?t.user_name:void 0))})]},n))})]}),(0,d.jsxs)(`section`,{className:`rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl`,children:[(0,d.jsx)(`h2`,{className:`text-xl font-semibold`,children:`Account status`}),(0,d.jsx)(`div`,{className:`mt-5 space-y-5`,children:j.map(([e,t])=>(0,d.jsxs)(`div`,{children:[(0,d.jsx)(`p`,{className:`text-sm text-slate-400`,children:e}),(0,d.jsx)(`p`,{className:`mt-1 capitalize`,children:t})]},e))})]})]}),Object.keys(i).length>0&&(0,d.jsxs)(`section`,{className:`mt-6`,children:[(0,d.jsx)(`h2`,{className:`mb-4 text-xl font-semibold`,children:`Activity`}),(0,d.jsx)(`div`,{className:`grid gap-4 sm:grid-cols-3`,children:Object.entries(i).map(([e,t])=>(0,d.jsxs)(`div`,{className:`rounded-2xl border border-white/10 bg-white/5 p-5`,children:[(0,d.jsx)(`p`,{className:`text-sm text-slate-400`,children:e}),(0,d.jsx)(`p`,{className:`mt-2 text-3xl font-bold text-emerald-400`,children:t})]},e))})]}),h&&(0,d.jsx)(_,{fields:O,form:x,setForm:S,onClose:()=>g(!1),onSubmit:k}),` `,y&&(0,d.jsx)(v,{password:C,setPassword:w,onClose:()=>b(!1),onSubmit:A})]})}function g({children:e,onClose:t,title:n}){return(0,d.jsx)(`div`,{className:`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4`,onMouseDown:t,children:(0,d.jsxs)(`div`,{className:`w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl`,onMouseDown:e=>e.stopPropagation(),children:[(0,d.jsxs)(`div`,{className:`mb-5 flex items-center justify-between`,children:[(0,d.jsx)(`h2`,{className:`text-xl font-semibold`,children:n}),(0,d.jsx)(`button`,{onClick:t,className:`rounded-lg p-2 hover:bg-white/10`,children:(0,d.jsx)(i,{size:18})})]}),e]})})}function _({fields:e,form:t,setForm:n,onClose:r,onSubmit:i}){let a=[`name`,`phone`,`village`,`district`,`soil_type`,`land_acres`,`shop_name`,`location`],o=e.filter(([e,t])=>a.includes(t));return(0,d.jsx)(g,{title:`Edit profile`,onClose:r,children:(0,d.jsxs)(`form`,{onSubmit:i,className:`space-y-5`,children:[(0,d.jsxs)(`div`,{children:[(0,d.jsx)(`label`,{className:`mb-2 block text-sm text-slate-400`,children:`Email Address`}),(0,d.jsx)(`input`,{value:t.email||``,disabled:!0,className:`
              w-full
              rounded-xl
              border
              border-white/10
              bg-slate-800
              px-4
              py-3
              opacity-60
              cursor-not-allowed
            `}),(0,d.jsx)(`p`,{className:`mt-1 text-xs text-slate-500`,children:`Email cannot be changed.`})]}),o.map(([e,r])=>(0,d.jsxs)(`div`,{children:[(0,d.jsx)(`label`,{className:`mb-2 block text-sm text-slate-400`,children:e}),(0,d.jsx)(`input`,{type:r===`land_acres`?`number`:`text`,step:r===`land_acres`?`0.1`:void 0,value:t[r]??``,onChange:e=>n({...t,[r]:r===`land_acres`?Number(e.target.value):e.target.value}),className:`
                w-full
                rounded-xl
                border
                border-white/10
                bg-slate-950
                px-4
                py-3
                outline-none
                transition
                focus:border-emerald-500
              `})]},r)),(0,d.jsxs)(`div`,{className:`space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4`,children:[(0,d.jsx)(`h3`,{className:`font-medium text-slate-300`,children:`Protected Information`}),(0,d.jsxs)(`div`,{children:[(0,d.jsx)(`p`,{className:`text-sm text-slate-400`,children:`Role`}),(0,d.jsx)(`p`,{className:`capitalize`,children:t.role})]}),(0,d.jsxs)(`div`,{children:[(0,d.jsx)(`p`,{className:`text-sm text-slate-400`,children:`Account Created`}),(0,d.jsx)(`p`,{children:t.created_at?new Date(t.created_at).toLocaleDateString():`Not available`})]}),(0,d.jsxs)(`div`,{children:[(0,d.jsx)(`p`,{className:`text-sm text-slate-400`,children:`Last Login`}),(0,d.jsx)(`p`,{children:t.last_login?new Date(t.last_login).toLocaleString():`Not available`})]})]}),(0,d.jsxs)(`div`,{className:`flex gap-3`,children:[(0,d.jsx)(`button`,{type:`button`,onClick:r,className:`
              flex-1
              rounded-xl
              border
              border-white/10
              py-3
              hover:bg-white/10
            `,children:`Cancel`}),(0,d.jsx)(`button`,{type:`submit`,className:`
              flex-1
              rounded-xl
              bg-emerald-600
              py-3
              font-medium
              hover:bg-emerald-500
            `,children:`Save Changes`})]})]})})}function v({password:e,setPassword:t,onClose:n,onSubmit:r}){let[i,a]=(0,u.useState)(!1),[c,l]=(0,u.useState)(!1);return(0,d.jsx)(g,{title:`Change password`,onClose:n,children:(0,d.jsxs)(`form`,{onSubmit:r,className:`space-y-4`,children:[(0,d.jsxs)(`div`,{className:`relative`,children:[(0,d.jsx)(`input`,{type:i?`text`:`password`,required:!0,placeholder:`Current password`,value:e.current_password,onChange:n=>t({...e,current_password:n.target.value}),className:`
              w-full rounded-xl
              border border-white/10
              bg-slate-950
              px-4 py-3 pr-12
            `}),(0,d.jsx)(`button`,{type:`button`,onClick:()=>a(!i),className:`
              absolute
              right-4
              top-1/2
              -translate-y-1/2
            `,children:i?(0,d.jsx)(o,{size:18}):(0,d.jsx)(s,{size:18})})]}),(0,d.jsxs)(`div`,{className:`relative`,children:[(0,d.jsx)(`input`,{type:c?`text`:`password`,minLength:`8`,required:!0,placeholder:`New password`,value:e.new_password,onChange:n=>t({...e,new_password:n.target.value}),className:`
              w-full rounded-xl
              border border-white/10
              bg-slate-950
              px-4 py-3 pr-12
            `}),(0,d.jsx)(`button`,{type:`button`,onClick:()=>l(!c),className:`
              absolute
              right-4
              top-1/2
              -translate-y-1/2
            `,children:c?(0,d.jsx)(o,{size:18}):(0,d.jsx)(s,{size:18})})]}),(0,d.jsx)(`button`,{className:`
            w-full rounded-xl
            bg-emerald-600
            py-3
            font-medium
            hover:bg-emerald-500
          `,children:`Update password`})]})})}export{h as default};