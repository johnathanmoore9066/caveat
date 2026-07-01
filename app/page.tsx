import { siteConfig } from "@/config/site";
import Analyzer from "@/components/Analyzer";
import CounterpartySearch from "@/components/CounterpartySearch";

const worksOn = [
  "Leases",
  "Employment",
  "Freelance",
  "NDAs",
  "Phone plans",
  "Financing",
  "Terms of service",
];

export default function Home() {
  return (
    <div className="wrap">
      <section>
        <p className="eyebrow animate-rise">Read it before you sign it</p>

        <h1 className="display animate-rise d1 mt-5 text-[2.5rem] font-semibold leading-[1.08] sm:text-[3.6rem]">
          <span className="text-aurora">{siteConfig.tagline}</span>
        </h1>

        <p className="animate-rise d2 mt-6 max-w-2xl font-serif text-lg leading-relaxed text-ink/80">
          {siteConfig.description}
        </p>

        <ul className="animate-rise d3 mt-7 flex flex-wrap items-center gap-2">
          {worksOn.map((w) => (
            <li key={w} className="chip">
              {w}
            </li>
          ))}
        </ul>
      </section>

      <div className="animate-rise d3 mt-11 max-w-3xl">
        <CounterpartySearch />
      </div>

      <div className="animate-rise d4 mt-5 max-w-3xl">
        <Analyzer />
      </div>
    </div>
  );
}
