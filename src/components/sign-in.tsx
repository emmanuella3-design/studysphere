import {useAuthActions} from "@convex-dev/auth/react";
import {useState} from "react";
import {Eye,EyeOff,Mail,LockKeyhole,ArrowLeft,ShieldCheck,Sparkles,KeyRound} from "lucide-react";

type Mode="signIn"|"signUp";
type SignInMethod="password"|"otp";

export function SignIn(){
 const {signIn}=useAuthActions();
 const [mode,setMode]=useState<Mode>("signIn");
 const [method,setMethod]=useState<SignInMethod>("password");
 const [step,setStep]=useState<"form"|"code">("form");
 const [email,setEmail]=useState("");
 const [showPassword,setShowPassword]=useState(false);
 const [error,setError]=useState("");
 const [notice,setNotice]=useState("");
 const [busy,setBusy]=useState(false);

 function resetMessages(){setError("");setNotice("");}

 async function submitPassword(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();setBusy(true);resetMessages();
  try{
   const fd=new FormData(e.currentTarget);
   await signIn("password",fd);
  }catch(err){setError(err instanceof Error?err.message:"Unable to sign in. Check your email and password.");}
  finally{setBusy(false);}
 }

 async function sendOtp(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();setBusy(true);resetMessages();
  try{
   const fd=new FormData(e.currentTarget);
   const value=String(fd.get("email")||"").trim().toLowerCase();
   if(!value){throw new Error("Enter your email address.");}
   await signIn("resend-otp",fd);
   setEmail(value);setStep("code");
   setNotice(mode==="signUp"?"A 6-digit verification code was sent to your email.":"A 6-digit sign-in code was sent to your email.");
  }catch(err){setError(err instanceof Error?err.message:"Could not send the verification code. Please try again.");}
  finally{setBusy(false);}
 }

 async function verifyOtp(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();setBusy(true);resetMessages();
  try{
   const fd=new FormData(e.currentTarget);
   await signIn("resend-otp",fd);
  }catch(err){setError(err instanceof Error?err.message:"That code could not be verified. Check it and try again.");}
  finally{setBusy(false);}
 }

 function changeMode(next:Mode){
  setMode(next);setStep("form");setMethod(next==="signUp"?"otp":"password");resetMessages();setShowPassword(false);
 }

 return <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[30px] border border-[hsl(var(--line))] bg-white shadow-2xl shadow-[hsl(var(--navy))]/10 md:grid-cols-[.9fr_1.1fr]">
  <div className="auth-wine-panel relative hidden min-h-[570px] flex-col justify-between overflow-hidden p-9 text-white md:flex">
   <div className="absolute -right-20 -top-16 size-64 rounded-full border-[35px] border-white/5"/>
   <div className="absolute -bottom-24 -left-16 size-72 rounded-full bg-white/[.04]"/>
   <div className="relative"><div className="grid size-12 place-items-center rounded-2xl bg-white/15"><Sparkles className="size-6"/></div><p className="mt-8 text-xs font-extrabold uppercase tracking-[.24em] text-white/65">StudySphere</p><h2 className="mt-3 text-4xl font-black leading-tight">Your next chapter starts here.</h2><p className="mt-4 max-w-xs leading-7 text-white/70">A secure student workspace for learning with AI, planning your studies, and reaching your goals.</p></div>
   <div className="relative rounded-2xl border border-white/15 bg-white/[.07] p-4"><ShieldCheck className="size-5 text-[hsl(var(--wine-soft))]"/><p className="mt-2 text-sm font-bold">Secure access</p><p className="mt-1 text-xs leading-5 text-white/60">New accounts and OTP sign-ins require verification of the email address.</p></div>
  </div>
  <div className="p-6 sm:p-9 md:p-10">
   <div className="mb-7 md:hidden"><div className="grid size-11 place-items-center rounded-2xl bg-[hsl(var(--wine))] text-white"><Sparkles className="size-5"/></div></div>
   {step==="code"?<>
    <button type="button" onClick={()=>{setStep("form");resetMessages();}} className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[hsl(var(--navy))] hover:text-[hsl(var(--wine))]"><ArrowLeft className="size-4"/> Back</button>
    <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[hsl(var(--wine))]">{mode==="signUp"?"VERIFY EMAIL":"SECURE SIGN-IN"}</p>
    <h2 className="mt-2 text-3xl font-black text-[hsl(var(--navy))]">Check your email</h2>
    <p className="mt-2 text-sm leading-6 text-slate-500">Enter the 6-digit code sent to <strong className="text-slate-700">{email}</strong>. It expires in 15 minutes.</p>
    <form className="mt-7 space-y-4" onSubmit={verifyOtp}>
     <input name="email" type="hidden" value={email}/>
     <label className="block text-sm font-bold text-[hsl(var(--navy))]">Verification code<input name="code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required placeholder="000000" className="auth-input mt-2 w-full text-center text-2xl font-black tracking-[.45em]"/></label>
     {error&&<p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
     {notice&&<p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
     <button disabled={busy} className="auth-primary w-full rounded-xl px-4 py-3.5 font-bold text-white disabled:opacity-50">{busy?"Verifying…":"Verify & continue"}</button>
    </form>
    <button type="button" onClick={()=>{setStep("form");resetMessages();}} className="mt-5 text-sm font-bold text-[hsl(var(--wine))]">Use a different email</button>
   </>:<>
    <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[hsl(var(--wine))]">{mode==="signIn"?"WELCOME BACK":"JOIN STUDYSPHERE"}</p>
    <h2 className="mt-2 text-3xl font-black tracking-tight text-[hsl(var(--navy))]">{mode==="signIn"?"Sign in to learn":"Create your account"}</h2>
    <p className="mt-2 text-sm leading-6 text-slate-500">{mode==="signIn"?"Use your password or receive a one-time code by email.":"Verify your email with a one-time code to create your StudySphere account."}</p>

    {mode==="signIn"&&<div className="mt-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
     <button type="button" onClick={()=>{setMethod("password");resetMessages();}} className={`rounded-lg px-3 py-2 text-sm font-bold ${method==="password"?"bg-white text-[hsl(var(--navy))] shadow-sm":"text-slate-500"}`}><span className="inline-flex items-center gap-2"><KeyRound size={15}/> Password</span></button>
     <button type="button" onClick={()=>{setMethod("otp");resetMessages();}} className={`rounded-lg px-3 py-2 text-sm font-bold ${method==="otp"?"bg-white text-[hsl(var(--navy))] shadow-sm":"text-slate-500"}`}><span className="inline-flex items-center gap-2"><Mail size={15}/> Email code</span></button>
    </div>}

    {mode==="signIn"&&method==="password"?<form className="mt-6 space-y-4" onSubmit={submitPassword}>
     <label className="block text-sm font-bold text-[hsl(var(--navy))]">Email address<span className="relative mt-2 block"><Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"/><input name="email" type="email" required autoComplete="email" placeholder="you@gmail.com" className="auth-input w-full pl-10"/></span></label>
     <label className="block text-sm font-bold text-[hsl(var(--navy))]">Password<span className="relative mt-2 block"><LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"/><input name="password" type={showPassword?"text":"password"} required minLength={8} autoComplete="current-password" placeholder="At least 8 characters" className="auth-input w-full pl-10 pr-12"/><button type="button" aria-label={showPassword?"Hide password":"Show password"} title={showPassword?"Hide password":"Show password"} onClick={()=>setShowPassword(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-[hsl(var(--wine))]">{showPassword?<EyeOff className="size-4"/>:<Eye className="size-4"/>}</button></span></label>
     <input name="flow" type="hidden" value="signIn"/>
     {error&&<p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
     <button disabled={busy} className="auth-primary w-full rounded-xl px-4 py-3.5 font-bold text-white disabled:opacity-50">{busy?"Signing in…":"Sign in securely"}</button>
    </form>:<form className="mt-6 space-y-4" onSubmit={sendOtp}>
     <label className="block text-sm font-bold text-[hsl(var(--navy))]">{mode==="signUp"?"Gmail address":"Email address"}<span className="relative mt-2 block"><Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"/><input name="email" type="email" required autoComplete="email" placeholder="you@gmail.com" className="auth-input w-full pl-10"/></span></label>
     {error&&<p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
     <button disabled={busy} className="auth-primary w-full rounded-xl px-4 py-3.5 font-bold text-white disabled:opacity-50">{busy?"Sending code…":mode==="signUp"?"Send verification code":"Email me a sign-in code"}</button>
    </form>}

    <div className="my-6 flex items-center gap-3"><div className="h-px flex-1 bg-slate-200"/><span className="text-xs font-semibold text-slate-400">{mode==="signIn"?"NEW TO STUDYSPHERE?":"ALREADY HAVE AN ACCOUNT?"}</span><div className="h-px flex-1 bg-slate-200"/></div>
    <button type="button" onClick={()=>changeMode(mode==="signIn"?"signUp":"signIn")} className="w-full rounded-xl border border-[hsl(var(--navy))]/20 px-4 py-3 font-bold text-[hsl(var(--navy))] transition hover:border-[hsl(var(--wine))] hover:bg-[hsl(var(--wine))]/5">{mode==="signIn"?"Create an account with email OTP":"Back to sign in"}</button>
   </>}
  </div>
 </div>
}