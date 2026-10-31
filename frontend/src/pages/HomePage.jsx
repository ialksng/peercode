import { Link } from "react-router";
import {
  ArrowDownRight,
  ArrowRight,
  Braces,
  Check,
  Code2,
  MessageCircle,
  Video,
} from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";

const features = [
  {
    number: "01",
    icon: Video,
    title: "A room to talk",
    description: "Meet face-to-face, work through an approach, and share your screen when it helps.",
    tone: "bg-primary/10 text-primary",
  },
  {
    number: "02",
    icon: Code2,
    title: "A place to practice",
    description: "Open focused problems and run your solution in JavaScript, Python, or Java.",
    tone: "bg-secondary/10 text-secondary",
  },
  {
    number: "03",
    icon: MessageCircle,
    title: "The conversation stays close",
    description: "Use the room chat to share a thought, a link, or the next step in the problem.",
    tone: "bg-accent/25 text-base-content",
  },
];

function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden text-base-content">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="PeerCode home">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-content shadow-sm">
            <Braces className="size-5" strokeWidth={2.4} />
          </span>
          <span>
            <span className="block text-lg font-extrabold leading-5 tracking-tight">PeerCode</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.19em] text-base-content/55">
              Practice, together
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 text-xs font-semibold text-base-content/55 sm:flex">
            <span className="size-2 rounded-full bg-success" />
            Built for the next good idea
          </span>
          <SignInButton mode="modal">
            <button className="btn btn-primary btn-sm rounded-full px-5 shadow-sm">
              Sign in <ArrowRight className="size-4" />
            </button>
          </SignInButton>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-12 sm:px-8 sm:pt-20 lg:grid-cols-[1fr_0.92fr] lg:gap-20 lg:pb-28">
          <div className="relative z-10">
            <p className="mb-6 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
              <span className="h-px w-8 bg-secondary" />
              A little less pressure. A lot more progress.
            </p>

            <h1 className="display-title max-w-3xl text-5xl leading-[0.99] sm:text-6xl lg:text-[5.3rem]">
              Think out loud.
              <br />
              <span className="text-primary">Figure it out</span>
              <br />
              together.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-base-content/70">
              PeerCode gives you a quiet place to practice technical interviews: a real conversation,
              a shared room, and useful problems to work through.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <SignInButton mode="modal">
                <button className="btn btn-secondary btn-lg rounded-full px-7 text-secondary-content shadow-md shadow-secondary/15">
                  Find your flow <ArrowRight className="size-5" />
                </button>
              </SignInButton>
              <a href="#features" className="btn btn-ghost btn-lg rounded-full px-6 text-base-content/75">
                See how it works <ArrowDownRight className="size-5" />
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-base-300 pt-6">
              {[
                ["03", "languages"],
                ["05", "practice problems"],
                ["1:1", "video rooms"],
              ].map(([value, label]) => (
                <div key={label} className="flex items-baseline gap-2">
                  <span className="font-mono text-xl font-bold text-primary">{value}</span>
                  <span className="text-xs font-semibold text-base-content/55">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="absolute -right-7 -top-8 size-28 rounded-full bg-accent/35 blur-2xl" />
            <div className="absolute -bottom-9 -left-8 size-36 rounded-full bg-primary/15 blur-3xl" />

            <div className="paper-card relative overflow-hidden rounded-[2rem] p-3 sm:p-4">
              <div className="flex items-center justify-between rounded-2xl bg-base-200 px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-content">
                    <Code2 className="size-4" />
                  </span>
                  <div>
                    <p className="text-xs font-bold">Practice room</p>
                    <p className="text-[10px] text-base-content/55">Two Sum · Easy</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-bold text-success">
                  <span className="size-1.5 rounded-full bg-success" />
                  Room ready
                </span>
              </div>

              <div className="mt-3 overflow-hidden rounded-2xl bg-[#202b29] text-[#e8e8dc]">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-[#d87c61]" />
                    <span className="size-2 rounded-full bg-[#e2bd67]" />
                    <span className="size-2 rounded-full bg-[#72aa83]" />
                  </div>
                  <span className="font-mono text-[10px] text-white/45">solution.js</span>
                  <span className="text-[10px] text-white/40">JavaScript</span>
                </div>
                <div className="grid grid-cols-[2rem_1fr] gap-x-3 px-4 py-6 font-mono text-[11px] leading-7 sm:px-6 sm:text-xs">
                  <span className="text-right text-white/25">1</span>
                  <span><span className="text-[#d4a6d4]">function</span> <span className="text-[#efc778]">twoSum</span>(nums, target) {'{'}</span>
                  <span className="text-right text-white/25">2</span>
                  <span className="text-white/45">&nbsp;&nbsp;// Start with what you know</span>
                  <span className="text-right text-white/25">3</span>
                  <span>&nbsp;&nbsp;<span className="text-[#d4a6d4]">const</span> seen = <span className="text-[#d2a1ae]">new</span> Map();</span>
                  <span className="text-right text-white/25">4</span>
                  <span className="text-white/65">&nbsp;&nbsp;...</span>
                  <span className="text-right text-white/25">5</span>
                  <span>{'}'}</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
                  <span className="inline-flex items-center gap-2 text-[10px] text-white/55">
                    <Check className="size-3 text-[#87c89e]" />
                    Make a small start
                  </span>
                  <span className="rounded-lg bg-primary px-3 py-1.5 text-[10px] font-bold text-white">Run code</span>
                </div>
              </div>

              <div className="flex items-center justify-between px-2 pb-1 pt-4 sm:px-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-secondary/15 text-xs font-black text-secondary">A</span>
                  <div>
                    <p className="text-xs font-bold">You + a practice partner</p>
                    <p className="text-[10px] text-base-content/55">Talk it through, one step at a time</p>
                  </div>
                </div>
                <Video className="mr-1 size-5 text-primary" />
              </div>
            </div>
            <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-base-content/40">
              Make space for the process
            </p>
          </div>
        </section>

        <section id="features" className="border-y border-base-300 bg-[#eeece4]/75">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-secondary">Made for the practice</p>
                <h2 className="display-title text-4xl sm:text-5xl">Good work starts with a good room.</h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-base-content/60">
                Everything you need for a focused session, without turning practice into a performance.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {features.map(({ number, icon: Icon, title, description, tone }) => (
                <article key={number} className="paper-card rounded-3xl p-6 sm:p-7">
                  <div className="mb-10 flex items-center justify-between">
                    <span className={`flex size-12 items-center justify-center rounded-2xl ${tone}`}>
                      <Icon className="size-5" />
                    </span>
                    <span className="font-mono text-xs font-bold text-base-content/35">{number}</span>
                  </div>
                  <h3 className="text-xl font-extrabold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-base-content/65">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-7 text-sm sm:flex-row sm:px-8">
        <p className="text-base-content/55">PeerCode · Made by Alok Singh</p>
        <a href="https://ialksng.me" target="_blank" rel="noreferrer" className="btn btn-outline btn-primary btn-sm rounded-full px-5">
          ialksng <ArrowRight className="size-3.5" />
        </a>
      </footer>
    </div>
  );
}

export default HomePage;
