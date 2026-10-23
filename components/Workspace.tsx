'use client';
import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Code2, FileCode2, FolderOpen, Github, BookOpen, TerminalSquare } from 'lucide-react';
import { entries } from '../lib/diary';
import { featuredProjects } from '../lib/portfolio';
import { experience } from "../lib/portfolio";
type Repo = { id:number; name:string; description:string|null; html_url:string; language:string|null; stargazers_count:number; fork:boolean; archived:boolean };
const staticFiles: Record<string,string[]> = {
 'about.py': ['# SatwikOS / identity', 'class Developer:', '    username = "Satwik934"', '    focus = "Learning by building"', '', '    def say_hello(self):', '        return "Welcome to my universe"', '', 'developer = Developer()', 'print(developer.say_hello())'],
 'projects.c': ['#include <stdio.h>', '', 'int main(void) {', '    puts("Projects loaded from GitHub API");', '    puts("Open the Projects tab to explore.");', '    return 0;', '}'],
 'experience.java': ['// University of Toronto', 'public class Experience {', '    String organization = "University of Toronto";', '    String type = "Co-op Internship";', '    String duration = "8 months";', '    String achievements = "Automated data workflows, improved 5 web apps, fixed 25+ issues, and reported 15+ bugs.";','}'],
 'contact.java': ['public class Contact {', '    public static void main(String[] args) {', '        System.out.println("github.com/Satwik934");', '    }', '}'],
 'identity.bin': ['01010011 01100001 01110100 01110111', '01101001 01101011', '', '// ASCII: Satwik', '// Explore, build, repeat.']
};
const tabs = ['about.py','projects.c','experience.java','diary.md','contact.java','identity.bin'];
export default function Workspace({repos}:{repos:Repo[]}){
 const [savedFiles,setSavedFiles]=useState<Record<string,string>>({});const [editing,setEditing]=useState(false);const [draft,setDraft]=useState('');
 useEffect(()=>{try{const stored=localStorage.getItem('satwikos-files-v2');if(stored)setSavedFiles(JSON.parse(stored));}catch{}},[]);
 const [active,setActive]=useState('about.py');const [entry,setEntry]=useState(0);const [command,setCommand]=useState('');const [log,setLog]=useState('Type help to list commands.');
 const lines=useMemo(()=>active==='diary.md'?['# '+entries[entry].title,'> '+entries[entry].date,'',...entries[entry].content.split('\n'),'','Tags: '+entries[entry].tags.join(', ')]:staticFiles[active]||[],[active,entry]);
 const content = savedFiles[active] ?? lines.join('\n');
 const openFile=(name:string)=>{setActive(name);setEditing(false);};
 const startEdit=()=>{setDraft(content);setEditing(true);};
 const saveEdit=()=>{const updated={...savedFiles,[active]:draft};setSavedFiles(updated);try{localStorage.setItem('satwikos-files-v2',JSON.stringify(updated));}catch{}setEditing(false);setLog('Saved in this browser only. Edit source code to publish changes.');};
 const resetFile=()=>{const updated={...savedFiles};delete updated[active];setSavedFiles(updated);try{localStorage.setItem('satwikos-files-v2',JSON.stringify(updated));}catch{}setEditing(false);};
 const execute=(e:React.FormEvent)=>{e.preventDefault();const c=command.trim().toLowerCase();if(tabs.includes(c)){openFile(c);setLog('Opened '+c);}else if(c==='help')setLog('Commands: help, whoami, ls, github, clear, or a filename');else if(c==='whoami')setLog('Satwik934 — developer, explorer, builder');else if(c==='ls')setLog(tabs.join('   '));else if(c==='github'){window.open('https://github.com/Satwik934','_blank','noopener,noreferrer');setLog('Opening GitHub…');}else if(c==='clear')setLog('');else setLog('Unknown command. Try help.');setCommand('');};
 return <section id="workspace" className="section-wrap py-20"><div className="section-kicker"><TerminalSquare size={15}/> 01 / INTERACTIVE SYSTEM</div><h2 className="section-heading">Explore the <span>filesystem.</span></h2><p className="muted mb-8">Click files, read code, or type a command. This is a working mini-interface, not a screenshot.</p>
 <div className="window overflow-hidden"><div className="window-title"><div className="flex gap-2"><i className="dot bg-red-400"/><i className="dot bg-yellow-400"/><i className="dot bg-green-400"/></div><span>satwik@os: ~/universe</span><span className="text-acid">● ONLINE</span></div><div className="flex flex-col md:flex-row min-h-[440px]"><aside className="md:w-52 shrink-0 border-b md:border-b-0 md:border-r border-white/10 p-4"><div className="flex items-center gap-2 text-xs text-white/40 mb-4"><FolderOpen size={14}/> EXPLORER</div><div className="flex md:flex-col gap-1 overflow-x-auto">{tabs.map(t=><button key={t} onClick={()=>openFile(t)} className={'file-tab '+(active===t?'selected':'')}><FileCode2 size={14} className="shrink-0"/>{t}</button>)}</div></aside><div className="flex-1 min-w-0"><div className="editor-tab"><Code2 size={14}/>{active}<span className="ml-auto flex items-center gap-3">{editing?<><button onClick={saveEdit} className="text-acid">SAVE</button><button onClick={()=>setEditing(false)} className="text-white/60">CANCEL</button></>:<><button onClick={startEdit} className="text-acid">EDIT</button>{savedFiles[active]!==undefined&&<button onClick={resetFile} className="text-white/60">RESET</button>}</>}</span></div>{editing?<textarea aria-label={'Edit '+active} spellCheck={false} value={draft} onChange={e=>setDraft(e.target.value)} className="code-editor"/>:<div className="code-lines" aria-live="polite">{content.split('\n').map((line,i)=><div className="flex gap-5" key={i}><span className="line-number">{String(i+1).padStart(2,'0')}</span><span className={line.trim().startsWith('#')||line.trim().startsWith('//')?'text-[#7e967f]':line.includes('"')?'text-[#a8e8b2]':'text-acid/90'}>{line||' '}</span></div>)}</div>}<p className="text-[11px] text-white/40 px-5 pb-3">Edits save only to your browser, not GitHub or Vercel.</p>{active==='diary.md'&&<div className="flex flex-wrap gap-2 px-5 pb-5">{entries.map((d,i)=><button key={i} onClick={()=>setEntry(i)} className={'chip '+(entry===i?'chip-active':'')}>{d.date}</button>)}</div>}</div></div><form onSubmit={execute} className="border-t border-white/10 px-4 py-3"><div className="text-xs text-white/45 mb-2" aria-live="polite">{log||'\u00a0'}</div><div className="flex items-center gap-2 text-sm"><span className="text-acid whitespace-nowrap">satwik@os:~$</span><input aria-label="Terminal command" value={command} onChange={e=>setCommand(e.target.value)} placeholder="Type commands here and help command gives you the total commands..." className="bg-transparent flex-1 outline-none min-w-0 text-white placeholder:text-white/25"/><button type="submit" className="text-acid text-xs hover:underline">RUN ↵</button></div></form></div>
 <div id="projects" className="pt-24"><div className="section-kicker"><Code2 size={15}/> 02 / FEATURED BUILDS</div><h2 className="section-heading">Selected <span>projects.</span></h2><p className="muted mb-8">Three projects I want to highlight.</p><div className="grid md:grid-cols-3 gap-4 mb-14">{featuredProjects.map((project,i)=><article key={project.name} className="project-card"><span className="text-acid text-xs">FEATURED_00{i+1}</span><h3 className="text-xl font-bold mt-5">{project.name}</h3><p className="text-white/55 text-sm mt-3 min-h-16">{project.description}</p>{project.url?<a href={project.url} target="_blank" rel="noopener noreferrer" className="text-acid text-xs inline-flex items-center gap-2 mt-5">VIEW PROJECT <ArrowUpRight size={14}/></a>:<span className="text-white/35 text-xs inline-block mt-5">Link coming soon</span>}</article>)}</div> 
{/* HANDPICKED GITHUB PROJECTS */}
<div className="section-kicker">
  <Github size={15} />
  02B / SELECTED REPOSITORIES
</div>

<h2 className="section-heading">
  Things I've <span>built.</span>
</h2>

<p className="muted mb-8">
  A collection of my projects, experiments,
  and collaborative builds.
</p>

<div className="grid md:grid-cols-2 gap-4">
  {[
    
{
    name: "Planetze",
    description: "An Android sustainability app that helps users calculate their carbon footprint, track daily emissions, visualize environmental impact, and adopt eco-friendly habits through personalized recommendations.",
    language: "Software Project",
    techStack: ["Java", "Android SDK", "Firebase Authentication", "Firebase Realtime Database", "MPAndroidChart", "JUnit", "Mockito"],
    url: "https://github.com/Satwik934/CSCB07-Planetze-86",
  },
  
    
    {
    name: "SmartSummarizer",
    description: "A Chrome extension that uses AI to instantly summarize selected text on webpages, helping users save time and quickly understand articles, research papers, and online content.",
    language: "Software Project",
    techStack: ["JavaScript", "HTML", "CSS", "Chrome Extensions API", "Axios"],
    url: "https://github.com/Satwik934/SmartSummarizer",
    },
  
    
    {
    name: "RentReceipts",
    description: "An AI-powered rental research platform built at Hack the Valley that helps Toronto renters evaluate properties using public housing records, inspection scores, neighbourhood data, and interactive maps.",
    language: "Hackathon",
    techStack: ["Next.js", "React", "TypeScript", "Python", "Tailwind CSS", "Supabase", "PostgreSQL", "PostGIS", "Google Gemini API", "MapLibre GL"],
    url: "https://github.com/Edwardddyang/HackTheValley",
    },
  
    
    {
    name: "FriendFind",
    description: "A full-stack social web application that helps users discover potential friends through shared interests, interactive quizzes, and friend requests.",
    language: "Hackathon",
    techStack: ["HTML", "CSS", "JavaScript", "Node.js", "Express.js", "MongoDB", "Mongoose"],
    url: "https://github.com/Satwik934/FriendFind",
    },
  
    {
      name: "RaidCore",
      description:
        "RAID storage simulator featuring disk management, parity, and fault recovery.",
      language: "C",
      techStack: ["C", "C++", "CMake", "RAID", "Inter-Process Communication", "Systems Programming"],
      url: "https://github.com/Satwik934/RaidCore",
    },
    

    {
        name: "Personal Portfolio",
        description: "An interactive developer portfolio website showcasing my software projects, technical skills, work experience, and development journey through a modern, responsive interface.",
        language: "Web Development",
        techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "HTML", "CSS"],
        url: "https://github.com/Satwik934/satwikos2",
      },      
  
  ].map((project) => (
    <a
      key={project.name}
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card group"
    >
      <div className="flex justify-between items-start">
        <Code2 className="text-acid" size={20} />

        <ArrowUpRight
          className="text-white/40 group-hover:text-acid transition"
          size={19}
        />
      </div>

      <h3 className="text-lg mt-5 font-semibold">
        {project.name}
      </h3>

      <p className="text-sm text-white/50 mt-2 min-h-12">
        {project.description}
      </p>
      
<div className="flex flex-wrap gap-2 mt-4">
  {project.techStack.map((tech) => (
    <span
      key={tech}
      className="rounded-md border border-green-900
                 bg-green-950/30 px-3 py-1
                 text-xs font-mono text-green-400"
    >
      {tech}
    </span>
  ))}
</div>

      <div className="flex gap-4 mt-5 text-xs text-white/50">
        <span>{project.language}</span>
        <span className="text-acid">
          VIEW SOURCE ↗
        </span>
      </div>
    </a>
  ))}
</div>
</div>


<div id="experience" className="pt-24">
  <div className="section-kicker">
    <TerminalSquare size={15} />
    03 / EXPERIENCE
  </div>

  <h2 className="section-heading">
    Where I've <span>worked.</span>
  </h2>

  <div className="project-card border-l-2 border-l-acid">
    {/* Company and Duration */}
    <div className="flex flex-wrap justify-between gap-3">
      <div>
        <h3 className="text-xl font-bold">
          {experience.company}
        </h3>

        <p className="text-acid text-sm mt-2">
          {experience.role}
        </p>
      </div>

      <span className="chip h-fit">
        {experience.duration}
      </span>
    </div>

    {/* Work Achievements */}
    <div className="grid md:grid-cols-2 gap-4 mt-8">
      {experience.highlights.map((item, index) => (
        <div
          key={item.title}
          className="rounded-lg border border-green-900/60
                     bg-black/30 p-5 transition-all
                     duration-300 hover:border-green-400
                     hover:bg-green-950/20"
        >
          <div className="text-acid text-xs mb-3">
            ACHIEVEMENT_0{index + 1}
          </div>

          <h4 className="text-lg font-bold text-white mb-3">
            {item.title}
          </h4>

          <p className="text-sm text-white/55 leading-relaxed">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  </div>
</div>

 <div id="diary" className="pt-24"><div className="section-kicker"><BookOpen size={15}/> 03 / DEV LOGS</div><h2 className="section-heading">The developer <span>diary.</span></h2><p className="muted mb-8">My Sample Diary and goals.</p><div className="grid md:grid-cols-3 gap-4">{entries.map((d,i)=><button key={i} onClick={()=>{setActive('diary.md');setEntry(i);document.getElementById('workspace')?.scrollIntoView({behavior:'smooth'});}} className="project-card text-left"><span className="text-acid text-xs">{d.date}</span><h3 className="text-lg mt-4 font-semibold">{d.title}</h3><p className="text-white/50 text-sm mt-3 line-clamp-3">{d.content}</p><span className="text-acid text-xs inline-block mt-5">OPEN ENTRY ↗</span></button>)}</div></div>
 </section>;
}
