import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useMemo, useState } from "react"
import { useAction, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { AuthGate } from "@/components/auth-gate"
import { Check, Plus, Search, Sparkles, X } from "lucide-react"

export const Route = createFileRoute("/courses")({ component: Courses })
type Course = { name:string; discipline:string; provider:string; mode:string; duration:string; reason?:string }

const families:Record<string,string[]> = {
"Agricultural & Food Sciences":["Agronomy","Animal Science","Crop Science","Soil Science","Horticulture","Food Science","Food Technology","Fisheries Science","Forestry","Plant Breeding","Plant Pathology","Agricultural Economics","Agricultural Extension","Agricultural Engineering","Aquaculture","Entomology","Weed Science","Seed Science","Postharvest Technology","Rural Development"],
"Biological & Life Sciences":["Biology","Botany","Zoology","Ecology","Genetics","Microbiology","Biotechnology","Biochemistry","Molecular Biology","Cell Biology","Marine Biology","Evolutionary Biology","Developmental Biology","Neuroscience","Immunology","Virology","Parasitology","Bioinformatics","Biophysics","Biostatistics"],
"Health & Medicine":["Medicine","Nursing","Dentistry","Pharmacy","Physiotherapy","Occupational Therapy","Radiography","Medical Laboratory Science","Public Health","Epidemiology","Nutrition","Dietetics","Midwifery","Optometry","Audiology","Speech-Language Pathology","Health Administration","Health Informatics","Clinical Psychology","Biomedical Science"],
"Veterinary & Animal Health":["Veterinary Medicine","Veterinary Anatomy","Veterinary Physiology","Veterinary Pathology","Veterinary Pharmacology","Veterinary Microbiology","Veterinary Parasitology","Veterinary Surgery","Veterinary Public Health","Veterinary Epidemiology","Veterinary Radiology","Veterinary Clinical Pathology","Veterinary Reproduction","Veterinary Anesthesia","Veterinary Dermatology","Veterinary Neurology","Veterinary Oncology","Veterinary Cardiology","Veterinary Dentistry","Animal Welfare Science"],
"Engineering & Technology":["Aerospace Engineering","Aeronautical Engineering","Automotive Engineering","Biomedical Engineering","Chemical Engineering","Civil Engineering","Computer Engineering","Electrical Engineering","Electronics Engineering","Environmental Engineering","Industrial Engineering","Materials Engineering","Mechanical Engineering","Mechatronics Engineering","Mining Engineering","Petroleum Engineering","Robotics Engineering","Telecommunications Engineering","Systems Engineering","Nuclear Engineering"],
"Computing & Digital Studies":["Computer Science","Software Engineering","Data Science","Artificial Intelligence","Machine Learning","Cybersecurity","Information Technology","Information Systems","Cloud Computing","Computer Networks","Database Systems","Human-Computer Interaction","Game Development","Web Development","Mobile Computing","Computational Science","Quantum Computing","Computer Graphics","Digital Forensics","DevOps Engineering"],
"Mathematical & Physical Sciences":["Mathematics","Applied Mathematics","Statistics","Actuarial Science","Physics","Applied Physics","Astronomy","Astrophysics","Chemistry","Applied Chemistry","Geology","Geophysics","Meteorology","Atmospheric Science","Oceanography","Materials Science","Earth Science","Environmental Science","Geography","Geospatial Science"],
"Business & Management":["Business Administration","Accounting","Finance","Economics","Marketing","Management","Entrepreneurship","Human Resource Management","Operations Management","Supply Chain Management","Project Management","Business Analytics","International Business","Banking","Insurance","Real Estate","Public Administration","Leadership Studies","Organizational Psychology","Hospitality Management"],
"Social Sciences":["Sociology","Psychology","Anthropology","Political Science","International Relations","Development Studies","Criminology","Demography","Gender Studies","Peace Studies","Security Studies","Social Work","Public Policy","Urban Studies","Regional Studies","Migration Studies","Community Development","Human Geography","Behavioral Science","Social Psychology"],
"Arts & Humanities":["History","Philosophy","Archaeology","Religious Studies","Theology","Classical Studies","Cultural Studies","Literature","English Studies","Linguistics","Comparative Literature","Ethics","Aesthetics","Museum Studies","Heritage Studies","African Studies","Asian Studies","European Studies","American Studies","Area Studies"],
"Languages & Communication":["English Language","French Language","Spanish Language","Arabic Language","German Language","Portuguese Language","Chinese Language","Japanese Language","Korean Language","Russian Language","Translation Studies","Interpretation Studies","Applied Linguistics","Communication Studies","Journalism","Broadcasting","Public Relations","Technical Communication","Digital Media","Publishing"],
"Law & Legal Studies":["Law","Constitutional Law","Criminal Law","Civil Law","Commercial Law","Corporate Law","International Law","Human Rights Law","Environmental Law","Intellectual Property Law","Tax Law","Family Law","Labour Law","Health Law","Cyber Law","Maritime Law","Energy Law","Banking Law","Legal Technology","Forensic Law"],
"Education & Learning":["Education","Early Childhood Education","Primary Education","Secondary Education","Special Education","Educational Psychology","Curriculum Studies","Educational Leadership","Instructional Design","Educational Technology","Adult Education","Higher Education","Teacher Education","Science Education","Mathematics Education","Language Education","Vocational Education","Inclusive Education","Distance Education","Assessment & Evaluation"],
"Architecture & Design":["Architecture","Interior Architecture","Landscape Architecture","Urban Design","Industrial Design","Product Design","Graphic Design","Fashion Design","Textile Design","Interaction Design","User Experience Design","User Interface Design","Animation","Illustration","Photography","Film Design","Sustainable Design","Lighting Design","Architectural Technology","Building Science"],
"Environment & Sustainability":["Environmental Management","Environmental Policy","Conservation Science","Climate Science","Climate Policy","Sustainability Studies","Renewable Energy","Energy Management","Water Resources","Waste Management","Environmental Health","Biodiversity Conservation","Natural Resource Management","Coastal Management","Disaster Management","Environmental Impact Assessment","Ecotourism","Carbon Management","Circular Economy","Sustainable Development"],
"Earth, Marine & Space Studies":["Geology","Paleontology","Hydrology","Limnology","Ocean Engineering","Marine Science","Marine Ecology","Coastal Science","Seismology","Volcanology","Geomorphology","Glaciology","Planetary Science","Space Science","Remote Sensing","Cartography","Geodesy","Geochemistry","Petrology","Mineralogy"],
"Media & Creative Industries":["Film Studies","Television Studies","Music","Music Production","Theatre Arts","Dance","Creative Writing","Screenwriting","Acting","Directing","Sound Engineering","Game Art","Animation Arts","Digital Arts","Fine Arts","Visual Arts","Media Production","Content Creation","Advertising","Creative Entrepreneurship"],
"Architecture, Construction & Built Environment":["Construction Management","Quantity Surveying","Building Surveying","Real Estate Development","Facilities Management","Structural Design","Transportation Planning","Traffic Engineering","Housing Studies","Building Services","Construction Technology","Property Management","Land Surveying","Town Planning","Regional Planning","Smart Cities","Infrastructure Planning","Construction Economics","Building Information Modelling","Construction Safety"],
"Public Service & Policy":["Public Policy","Public Administration","Governance","Public Finance","Diplomacy","Foreign Policy","Political Economy","Public Management","Nonprofit Management","International Development","Humanitarian Studies","Election Studies","Civic Leadership","Policy Analysis","Regulatory Studies","Public Sector Innovation","Government Analytics","Local Government","Global Governance","Administrative Law"],
"Security, Defence & Emergency Studies":["Security Studies","Defence Studies","Military Science","Strategic Studies","Intelligence Studies","Counterterrorism Studies","Cyber Defence","Emergency Management","Fire Science","Disaster Response","Risk Management","Crisis Management","Border Security","Maritime Security","Aviation Security","Forensic Science","Security Management","Peacekeeping Studies","Conflict Resolution","Homeland Security"]
};

const disciplineTracks=["Core Studies","Applied Studies","Advanced Studies"];
const focusAreas=["Foundations","Theory","Methods","Research Methods","Applied Practice","Laboratory Methods","Data Analysis","Professional Practice","Advanced Topics","Capstone & Research"];

const providerByFamily:Record<string,string>={"Veterinary & Animal Health":"Veterinary Medical School","Health & Medicine":"Health Sciences College","Computing & Digital Studies":"Technology Institute","Engineering & Technology":"Engineering Academy","Agricultural & Food Sciences":"Agricultural Institute","Business & Management":"Business Academy","Law & Legal Studies":"Legal Studies Institute","Education & Learning":"Teacher Education College","Arts & Humanities":"Humanities Institute","Languages & Communication":"Language Institute"};
const generatedCatalog:Course[]=[];
for(const [family,items] of Object.entries(families)) for(const discipline of items) for(const track of disciplineTracks) for(const focus of focusAreas) generatedCatalog.push({name:`${discipline} — ${track}: ${focus}`,discipline:`${discipline} — ${track}`,provider:providerByFamily[family]??`${family} Institute`,mode:focus==="Laboratory Methods"||focus==="Professional Practice"?"Hybrid":"Online",duration:focus==="Foundations"||focus==="Theory"?"12 weeks":focus==="Capstone & Research"?"16 weeks":"10 weeks",reason:`${focus} in ${discipline} (${track}), within ${family}.`});
const catalog:Course[]=generatedCatalog;
const disciplineFamilies=Object.entries(families).flatMap(([family,items])=>items.flatMap(d=>disciplineTracks.map(track=>({family,discipline:`${d} — ${track}`}))));
const STORAGE_KEY="studysphere:my-courses"

function Courses(){ return <AuthGate><CoursesContent/></AuthGate> }

function CoursesContent(){
 const data=useQuery(api.student.dashboard)
 const ai=useAction(api.ai.generate)
 const [saved,setSaved]=useState<Course[]>([])
 const [q,setQ]=useState("")
 const [family,setFamily]=useState("All")
 const [discipline,setDiscipline]=useState("All")
 const [result,setResult]=useState<Course[]>(catalog)
 const [busy,setBusy]=useState(false)
 const [notice,setNotice]=useState("")
 useEffect(()=>{try{setSaved(JSON.parse(localStorage.getItem(STORAGE_KEY)??"[]"))}catch{}},[])
 useEffect(()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(saved))}catch{}},[saved])
 const familyOptions=useMemo(()=>["All",...Object.keys(families).sort()],[ ])
 const disciplineOptions=useMemo(()=>["All",...disciplineFamilies.filter(x=>family==="All"||x.family===family).map(x=>x.discipline).sort()],[family])
 const selected=new Set(saved.map(c=>c.name))
 const profileSubjects=data?.profile?.subjects ?? []
 const filtered=useMemo(()=>{
   const query=q.trim().toLowerCase()
   return result.filter(c=>(family==="All"||families[family]?.some(d=>c.discipline.startsWith(d+" —")))&&(discipline==="All"||c.discipline===discipline)&&(!query||[c.name,c.discipline,c.provider,c.mode,c.duration].join(" ").toLowerCase().includes(query)))
 },[q,discipline,result])
 const relevant=useMemo(()=>{
   if(!profileSubjects.length)return catalog.slice(0,6)
   const terms=profileSubjects.join(" ").toLowerCase()
   const matches=catalog.filter(c=>(c.name+" "+c.discipline).toLowerCase().split(" ").some(word=>terms.includes(word)))
   return (matches.length?matches:catalog).slice(0,6)
 },[profileSubjects])
 async function search(){
   const query=q.trim()
   if(!query){setResult(catalog);return}
   setBusy(true);setNotice("")
   try{
     const raw=await ai({mode:"course_search",text:query})
     const parsed=JSON.parse(raw)
     const matches=(parsed.matches??[]).filter((x:any)=>x?.name).map((x:any)=>({name:String(x.name),discipline:String(x.discipline??"General Studies"),provider:String(x.provider??"Recommended provider"),mode:String(x.mode??"Flexible"),duration:String(x.duration??"Self-paced"),reason:x.reason?String(x.reason):undefined}))
     setResult(matches.length?matches:catalog.filter(c=>(c.name+" "+c.discipline).toLowerCase().includes(query.toLowerCase())))
     if(!matches.length)setNotice("Showing the closest matches from the catalogue.")
   }catch{
     setResult(catalog.filter(c=>(c.name+" "+c.discipline).toLowerCase().includes(query.toLowerCase())))
     setNotice("AI search was unavailable, so the catalogue search is showing matching courses.")
   }finally{setBusy(false)}
 }
 function add(c:Course){setSaved(current=>current.some(x=>x.name===c.name)?current:[c,...current]);setNotice(c.name+" added to your study courses.")}
 function remove(name:string){setSaved(current=>current.filter(x=>x.name!==name));setNotice("Course removed from your study list.")}
 return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
   <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-sm font-bold text-[hsl(var(--palm))]">COURSES & DISCIPLINES</p><h1 className="mt-2 text-3xl font-black sm:text-5xl">Find what you want to study.</h1><p className="mt-3 max-w-3xl opacity-70">Search courses and disciplines instantly, discover relevant options, and add the ones you want to your personal study list.</p></div><div className="rounded-2xl border bg-white px-4 py-3 text-sm"><span className="font-black">{saved.length}</span> courses in your study list</div></div>
   <div className="mt-8 rounded-3xl border bg-white p-4 shadow-sm"><div className="flex flex-col gap-3 md:flex-row"><div className="relative flex-1"><Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 opacity-45"/><input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()} placeholder="Search course, discipline, provider or study mode…" className="min-h-12 w-full rounded-2xl border pl-12 pr-4 outline-none focus:ring-2 focus:ring-[hsl(var(--palm-soft))]"/></div><button onClick={search} disabled={busy} className="min-h-12 rounded-2xl bg-[hsl(var(--palm))] px-6 font-bold text-white disabled:opacity-60">{busy?"Finding courses…":"Search with AI"}</button></div><div className="mt-4 grid gap-3 md:grid-cols-2"><label className="text-xs font-bold uppercase opacity-60">Academic family<select value={family} onChange={e=>{setFamily(e.target.value);setDiscipline("All")}} className="mt-1 min-h-11 w-full rounded-xl border bg-white px-3 text-sm font-semibold outline-none"><option value="All">All academic families</option>{familyOptions.filter(x=>x!=="All").map(x=><option key={x} value={x}>{x}</option>)}</select></label><label className="text-xs font-bold uppercase opacity-60">Discipline<select value={discipline} onChange={e=>setDiscipline(e.target.value)} className="mt-1 min-h-11 w-full rounded-xl border bg-white px-3 text-sm font-semibold outline-none"><option value="All">All disciplines{family!=="All"?" in "+family:""}</option>{disciplineOptions.filter(x=>x!=="All").map(x=><option key={x} value={x}>{x}</option>)}</select></label></div><p className="mt-3 text-xs opacity-55">{disciplineFamilies.length.toLocaleString()} discipline tracks · {catalog.length.toLocaleString()} courses in the catalogue</p>{notice&&<p className="mt-3 text-sm font-semibold text-[hsl(var(--palm))]">{notice}</p>}</div>
   <section className="mt-8"><div className="flex items-center gap-2"><Sparkles className="size-5 text-[hsl(var(--palm))]"/><h2 className="text-xl font-black">Relevant for you</h2></div><p className="mt-1 text-sm opacity-60">{profileSubjects.length?"Based on your subjects: "+profileSubjects.join(", "):"Popular starting points while we learn your study interests."}</p><div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{relevant.map(c=><CourseCard key={c.name} c={c} saved={selected.has(c.name)} onAdd={add}/>)}</div></section>
   <section className="mt-10"><h2 className="text-xl font-black">Search results</h2><p className="mt-1 text-sm opacity-60">{filtered.length} course{filtered.length===1?"":"s"} found</p><div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{filtered.slice(0,30).map(c=><CourseCard key={c.name} c={c} saved={selected.has(c.name)} onAdd={add}/>)}{filtered.length>30&&<p className="md:col-span-2 lg:col-span-3 text-center text-sm font-semibold opacity-60">Showing the first 30 matches of {filtered.length.toLocaleString()}. Refine your family, discipline, or search.</p>}{!filtered.length&&<div className="rounded-3xl border bg-white p-8 text-center md:col-span-2 lg:col-span-3"><p className="font-black">No matching courses yet.</p><p className="mt-2 text-sm opacity-60">Try a broader course name or discipline, or use AI search for recommendations.</p></div>}</div></section>
   <section className="mt-10 rounded-3xl border bg-white p-6"><h2 className="text-xl font-black">My study courses</h2><p className="mt-1 text-sm opacity-60">Courses you have chosen to keep for your learning plan.</p><div className="mt-4 space-y-2">{saved.map(c=><div key={c.name} className="flex flex-col gap-3 rounded-2xl bg-black/[.03] p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-extrabold">{c.name}</p><p className="text-sm opacity-60">{c.discipline} · {c.provider} · {c.duration}</p></div><button onClick={()=>remove(c.name)} className="inline-flex items-center gap-2 self-start rounded-xl border bg-white px-3 py-2 text-xs font-bold sm:self-auto"><X className="size-4"/>Remove</button></div>)}{!saved.length&&<p className="py-4 text-sm opacity-55">Nothing added yet. Search above and choose Add to study list.</p>}</div></section>
 </main>
}
function CourseCard({c,saved,onAdd}:{c:Course;saved:boolean;onAdd:(c:Course)=>void}){return <article className="rounded-3xl border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-start justify-between gap-3"><span className="rounded-full bg-[hsl(var(--palm-soft))] px-3 py-1 text-xs font-bold">{c.discipline}</span>{saved?<span className="inline-flex items-center gap-1 text-xs font-bold"><Check className="size-4"/>Added</span>:null}</div><h3 className="mt-4 text-lg font-black">{c.name}</h3><p className="mt-1 text-sm opacity-60">{c.provider}</p><p className="mt-3 text-sm leading-6 opacity-70">{c.reason??(c.mode+" · "+c.duration)}</p><button disabled={saved} onClick={()=>onAdd(c)} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[hsl(var(--navy))] px-4 py-3 text-sm font-bold text-white disabled:cursor-default disabled:opacity-50"><Plus className="size-4"/>{saved?"In study list":"Add to study list"}</button></article>}
