import { siteConfig } from "@/config/site";
import Analyzer from "@/components/Analyzer";
import CounterpartySearch from "@/components/CounterpartySearch";

export default function Home() {
  return (
    <div className="wrap">
      <section className="max-w-prose">
        <p className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-gold">
          Read it before you sign it
        </p>
        <h1 className="display mt-3 text-4xl font-semibold leading-[1.1] sm:text-5xl">
          {siteConfig.tagline}
        </h1>
        <p className="mt-5 font-serif text-lg leading-relaxed text-ink/85">
          {siteConfig.description}
        </p>
      </section>

      <div className="mt-9 max-w-prose">
        <CounterpartySearch />
      </div>

      <div className="mt-6 max-w-prose">
        <Analyzer />
      </div>
    </div>
  );
}
