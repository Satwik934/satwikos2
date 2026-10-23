import FourierBackground from "../components/FourierBackground";
import Workspace from '../components/Workspace';
import { ArrowDown, ArrowUpRight, Github, Terminal } from 'lucide-react';
export const revalidate = 3600;
type Repo = { id:number; name:string; description:string|null; html_url:string; language:string|null; stargazers_count:number; fork:boolean; archived:boolean };
async function getRepos():Promise<Repo[]>{try{const res=await fetch('https://api.github.com/users/Satwik934/repos?per_page=100&sort=updated',{next:{revalidate:3600},headers:{Accept:'application/vnd.github+json','User-Agent':'SatwikOS-Portfolio'}});if(!res.ok)return [];const data:unknown=await res.json();if(!Array.isArray(data))return [];return (data as Repo[]).filter(r=>!r.fork&&!r.archived).slice(0,6);}catch{return [];}}

export default async function Home() {
    const repos = await getRepos();
  
    return (
      <main>
        {/* NAVIGATION */}
        <header className="site-header">
          <a
            href="#home"
            className="font-bold tracking-tight text-acid flex items-center gap-2"
          >
            <Terminal size={18} />
            SATWIK<span className="text-white">OS</span>
            <span className="text-[10px] text-white/40 font-normal">
              v2.0
            </span>
          </a>
  
          <nav
            aria-label="Main navigation"
            className="flex gap-4 sm:gap-7 text-xs sm:text-sm"
          >
            <a href="#workspace">system</a>
            <a href="#projects">projects</a>
            <a href="#experience">experience</a>
            <a href="#diary">diary</a>
            <a
              href="https://github.com/Satwik934"
              target="_blank"
              rel="noopener noreferrer"
              className="text-acid"
            >
              github ↗
            </a>
          </nav>
        </header>
  
        {/* HERO SECTION */}
        <section
          id="home"
          className="relative min-h-screen overflow-hidden bg-night"
        >
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_70%_40%,rgba(34,197,94,0.08),transparent_60%)]" />
  
          <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-5 py-28 sm:px-8">
            <div className="grid w-full items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
  
              {/* LEFT SIDE: ORIGINAL INTRODUCTION */}
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-acid/30 bg-black/70 px-3 py-2 text-[10px] sm:text-xs text-acid backdrop-blur">
                  <span className="animate-pulse">●</span>
                  SYSTEM ONLINE / WELCOME USER
                </div>
  
                <div className="mt-7 border-l-2 border-acid bg-black/50 p-5 sm:p-7 backdrop-blur-sm">
                  <p className="mb-4 text-xs text-acid sm:text-sm">
                    &gt; initializing developer_universe.exe
                  </p>
  
                  <h1 className="text-5xl font-bold leading-none tracking-[-.07em] sm:text-6xl xl:text-7xl">
                    Hello, I'm
                    <br />
                    <span className="text-acid">
                      Satwik
                      <span className="cursor-blink">_</span>
                    </span>
                  </h1>
  
                  <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/65 sm:text-base">
                    Welcome to my little corner of the internet.
                    A place for code, experiments, and everything
                    I'm curious about.
                  </p>
  
                  <div className="mt-7 flex flex-wrap gap-3">
                    <a
                      href="#projects"
                      className="rounded-md border border-acid/50 bg-acid/10 px-4 py-3 text-xs text-acid transition hover:bg-acid/20"
                    >
                      EXPLORE PROJECTS ↗
                    </a>
  
                    <a
                      href="#experience"
                      className="rounded-md border border-white/15 px-4 py-3 text-xs text-white/70 transition hover:border-acid/50 hover:text-acid"
                    >
                      WORK EXPERIENCE ↗
                    </a>
                  </div>
                </div>
              </div>
  
              {/* RIGHT SIDE: INTERACTIVE FOURIER LAB */}
              <div className="relative z-10 min-w-0">
                <FourierBackground />
              </div>
  
            </div>
          </div>
  
          {/* ENTER BUTTON */}
          <div className="absolute bottom-5 left-0 right-0 z-20 flex justify-center">
            <a
              href="#workspace"
              className="flex items-center gap-2 rounded-full border border-acid/40 bg-black/80 px-5 py-3 text-xs text-acid transition hover:bg-acid/10"
            >
              ENTER THE SYSTEM
              <ArrowDown size={15} />
            </a>
          </div>
  
          <div className="absolute bottom-6 left-6 hidden text-[10px] text-white/30 md:block">
            X: 01010011 / Y: 01100001
          </div>
        </section>
  
        {/* INTERACTIVE FILESYSTEM + PROJECTS + EXPERIENCE */}
        <Workspace repos={repos} />
  
        {/* FOOTER */}
        <footer className="border-t border-white/10 py-10">
          <div className="section-wrap flex flex-col items-start justify-between gap-4 text-xs text-white/45 sm:flex-row sm:items-center">
            <span>
              © {new Date().getFullYear()} Satwik934 ·
              Made with curiosity.
            </span>
  
            <a
              className="flex items-center gap-2 text-acid"
              href="https://github.com/Satwik934"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={15} />
              github.com/Satwik934
              <ArrowUpRight size={14} />
            </a>
          </div>
        </footer>
      </main>
    );
  }
  