"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const HeroScene = dynamic(
  () => import("./hero-scene").then((module) => module.HeroScene),
  { ssr: false },
);

const projects = [
  {
    number: "01",
    title: "Straumann APAC",
    type: "Event platform",
    image: "/projects/straumann-live.jpg",
    dates: "02/2026 - 06/2026",
    problem:
      "Create one reliable digital journey for registration, payment, ticketing and on-site engagement across an APAC event.",
    role:
      "Full-stack developer. Owned the frontend architecture and implemented the supporting Laravel APIs and data flows.",
    decision:
      "Separated the experience into reusable event modules while keeping payment, QR ticket and check-in states explicit and traceable.",
    result:
      "Successfully launched for around 200 participants with OnePay, OTP authentication, QR check-in and PDF certificates.",
    tech: ["Next.js", "TypeScript", "Laravel", "MySQL", "Testing"],
    link: "https://events-straumannapac.com/en",
  },
  {
    number: "02",
    title: "BLive",
    type: "E-commerce",
    image: "/projects/blive-live.jpg",
    dates: "2025 - present",
    problem:
      "Turn a growing product catalogue and affiliate model into a fast, usable commerce experience across devices.",
    role:
      "Frontend developer. Owned reusable modules, state and API integration from project structure through production support.",
    decision:
      "Kept server data and client interaction concerns separate, then designed reusable product, promotion and checkout building blocks.",
    result:
      "Delivered product discovery, flash sale, cart, checkout, orders, rewards and referral flows with SEO and automated test coverage for core commerce journeys.",
    tech: ["React 19", "Next.js 16", "TypeScript", "Redux", "SWR"],
    link: "https://blivemart.com/",
  },
  {
    number: "03",
    title: "K-Life",
    type: "Commerce experience",
    image: "/projects/klife-live.jpg",
    dates: "10/2025 - 03/2026",
    problem:
      "Present a diverse retail catalogue through a friendly, responsive interface without losing clarity across content-heavy pages.",
    role:
      "Frontend developer. Built customer-facing pages and reusable UI while coordinating API requirements and responsive behaviour.",
    decision:
      "Created consistent visual primitives and layout rules so campaign pages and catalogue sections could evolve without fragmenting the UI.",
    result:
      "Shipped the public commerce experience with reusable sections, responsive layouts and production API integrations.",
    tech: ["React", "Next.js", "TypeScript", "REST API", "Responsive"],
    link: "https://k-life.vn/",
  },
];

const snippets = {
  html: {
    label: "Semantic HTML",
    note: "Accessible product card with meaningful structure and labels.",
    code: `<article class="product-card" aria-labelledby="product-title-42">
  <a class="product-card__media" href="/products/42">
    <img src="/images/product.webp"
         alt="Biodegradable surface cleaner"
         width="640" height="640" loading="lazy" />
  </a>
  <div class="product-card__body">
    <p class="product-card__eyebrow">Home care</p>
    <h3 id="product-title-42">Surface cleaner</h3>
    <p class="product-card__price" aria-label="Price: 129,000 VND">
      129,000₫
    </p>
    <button type="button" aria-label="Add Surface cleaner to cart">
      Add to cart
    </button>
  </div>
</article>`,
  },
  css: {
    label: "BEM + modern CSS",
    note: "A component convention that stays readable across projects.",
    code: `.product-card {
  container-type: inline-size;
  display: grid;
  gap: 1rem;
  border: 1px solid var(--line);
  background: var(--surface);
}

.product-card__media {
  aspect-ratio: 1;
  overflow: clip;
}

.product-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 240ms ease;
}

@container (min-width: 30rem) {
  .product-card { grid-template-columns: 42% 1fr; }
}

@media (prefers-reduced-motion: no-preference) {
  .product-card:hover img { transform: scale(1.035); }
}`,
  },
  typescript: {
    label: "Modular TypeScript",
    note: "Typed request state with cancellation and predictable errors.",
    code: `type ProductQuery = {
  keyword?: string;
  page: number;
  category?: string;
};

type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

export async function getProducts(
  query: ProductQuery,
  signal?: AbortSignal,
): Promise<ApiResult<Product[]>> {
  const params = new URLSearchParams(
    Object.entries(query)
      .filter(([, value]) => value != null && value !== "")
      .map(([key, value]) => [key, String(value)]),
  );

  const response = await fetch(\`/api/products?\${params}\`, { signal });
  if (!response.ok) return { ok: false, message: "Unable to load products" };
  return { ok: true, data: await response.json() };
}`,
  },
};

type SnippetKey = keyof typeof snippets;

const skills = [
  ["Languages & frameworks", "JavaScript ES6+", "TypeScript", "React.js", "Next.js", "HTML5", "CSS3"],
  ["Interface craft", "Responsive UI", "Semantic HTML", "Accessibility", "Tailwind CSS", "Three.js / WebGL", "Figma"],
  ["Engineering", "REST APIs", "State management", "Testing", "Performance", "Git", "CI/CD"],
];

export function PortfolioClient() {
  const [theme, setTheme] = useState<"golden" | "night">("golden");
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSnippet, setActiveSnippet] = useState<SnippetKey>("html");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <main>
      <header className="site-nav" aria-label="Primary navigation">
        <a className="wordmark" href="#top" aria-label="Phạm Xuân Phúc, home">
          PXP<span>.</span>
        </a>
        <nav className={menuOpen ? "nav-links is-open" : "nav-links"}>
          {[
            ["About", "#about"],
            ["Projects", "#projects"],
            ["Code lab", "#code-lab"],
            ["Experience", "#experience"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            className="theme-toggle"
            type="button"
            aria-label={`Switch to ${theme === "golden" ? "Milky Way" : "Golden Hour"} theme`}
            onClick={() => setTheme(theme === "golden" ? "night" : "golden")}
          >
            <span aria-hidden="true">{theme === "golden" ? "●" : "✦"}</span>
            {theme === "golden" ? "Golden hour" : "Milky way"}
          </button>
          <button
            className="motion-toggle"
            type="button"
            aria-pressed={motionEnabled}
            onClick={() => setMotionEnabled(!motionEnabled)}
          >
            {motionEnabled ? "Motion on" : "Motion off"}
          </button>
          <button
            className="menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            Menu
          </button>
        </div>
      </header>

      <section className="hero" id="top">
        <HeroScene theme={theme} motionEnabled={motionEnabled} />
        <div className="stars" aria-hidden="true">
          {Array.from({ length: 28 }, (_, index) => (
            <span key={index} style={{ "--i": index } as React.CSSProperties} />
          ))}
        </div>
        <div className="sun" aria-hidden="true" />
        <div className="mountains mountains-back" aria-hidden="true" />
        <div className="mountains mountains-front" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">Frontend Developer · Hanoi</p>
          <h1>
            I build digital products
            <br />
            <em>from first decision to production.</em>
          </h1>
          <p className="hero-intro">
            React, Next.js and TypeScript with a practical eye for responsive interfaces,
            reusable systems and the small details users feel.
          </p>
          <div className="hero-actions">
            <a className="button button-solid" href="#projects">
              Explore selected work
            </a>
            <a className="button button-ghost" href="/docs/Pham_Xuan_Phuc_Frontend_Developer_CV.pdf" download>
              Download CV
            </a>
          </div>
        </div>
        <p className="hero-caption">Interactive Three.js landscape · shaped by code and photography</p>
      </section>

      <section className="section about" id="about">
        <div className="section-heading">
          <p className="section-index">01 / About</p>
          <h2>Product ownership, without losing the pixels.</h2>
        </div>
        <div className="about-grid">
          <div className="about-copy">
            <p>
              I am Phạm Xuân Phúc, a frontend developer with more than three years of
              experience delivering production web applications at Nanoweb.
            </p>
            <p>
              My work sits between product thinking and implementation: clarifying requirements,
              proposing frontend architecture, shaping API contracts, building reusable UI,
              testing, deploying and staying with the product when real users arrive.
            </p>
            <p className="muted">
              Photography keeps my eye trained on rhythm, composition and light. The same habit
              shows up in how I inspect spacing, responsive behaviour and interaction detail.
            </p>
          </div>
          <dl className="facts">
            <div><dt>3+</dt><dd>years building production web products</dd></div>
            <div><dt>15+</dt><dd>client projects across commerce, events and operations</dd></div>
            <div><dt>E2E</dt><dd>frontend ownership from technical decisions to production support</dd></div>
            <div><dt>2025</dt><dd>Employee of the Year at Nanoweb</dd></div>
          </dl>
        </div>
      </section>

      <section className="section skills" id="skills">
        <div className="section-heading compact">
          <p className="section-index">02 / Capabilities</p>
          <h2>Strong foundations, pragmatic tools.</h2>
        </div>
        <div className="skill-grid">
          {skills.map(([title, ...items]) => (
            <article key={title} className="skill-group">
              <h3>{title}</h3>
              <div>{items.map((item) => <span key={item}>{item}</span>)}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="section projects" id="projects">
        <div className="section-heading">
          <p className="section-index">03 / Selected work</p>
          <h2>Real products, real constraints.</h2>
          <p className="section-lead">
            Three production projects selected for interface craft, technical ownership and delivery.
          </p>
        </div>
        <div className="project-list">
          {projects.map((project) => (
            <article className="project-card" key={project.title}>
              <div className="film-strip" aria-hidden="true">
                {Array.from({ length: 12 }, (_, index) => <span key={index} />)}
              </div>
              <a className="project-image" href={project.link} target="_blank" rel="noreferrer">
                <Image
                  src={project.image}
                  alt={`${project.title} project preview`}
                  width={1600}
                  height={900}
                  sizes="(max-width: 1280px) 100vw, 1200px"
                  quality={95}
                  unoptimized
                />
                <span>{project.number}</span>
              </a>
              <div className="project-content">
                <div className="project-title-row">
                  <div><p>{project.type}</p><h3>{project.title}</h3></div>
                  <time>{project.dates}</time>
                </div>
                <dl className="project-details">
                  <div><dt>Problem</dt><dd>{project.problem}</dd></div>
                  <div><dt>My role</dt><dd>{project.role}</dd></div>
                  <div><dt>Key decision</dt><dd>{project.decision}</dd></div>
                  <div><dt>Result</dt><dd>{project.result}</dd></div>
                </dl>
                <div className="project-footer">
                  <div className="tech-list">{project.tech.map((tech) => <span key={tech}>{tech}</span>)}</div>
                  <a href={project.link} target="_blank" rel="noreferrer">View live project ↗</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section code-lab" id="code-lab">
        <div className="section-heading">
          <p className="section-index">04 / Code lab</p>
          <h2>The details behind the interface.</h2>
          <p className="section-lead">
            Small, focused samples demonstrating semantic HTML, maintainable CSS conventions and modular TypeScript.
          </p>
        </div>
        <div className="code-shell">
          <div className="code-tabs" role="tablist" aria-label="Code sample language">
            {(Object.keys(snippets) as SnippetKey[]).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={activeSnippet === key}
                onClick={() => setActiveSnippet(key)}
              >
                {snippets[key].label}
              </button>
            ))}
          </div>
          <div className="code-layout">
            <div className="code-note">
              <p className="eyebrow">Why this sample</p>
              <h3>{snippets[activeSnippet].label}</h3>
              <p>{snippets[activeSnippet].note}</p>
              <p className="muted">This portfolio is itself a public-facing code sample built with React and TypeScript.</p>
            </div>
            <pre aria-label={`${snippets[activeSnippet].label} code sample`}>
              <code>{snippets[activeSnippet].code}</code>
            </pre>
          </div>
        </div>
      </section>

      <section className="section experience" id="experience">
        <div className="section-heading compact">
          <p className="section-index">05 / Experience</p>
          <h2>Built through ownership.</h2>
        </div>
        <article className="timeline-item">
          <div className="timeline-date">05/2023 - present</div>
          <div>
            <p className="eyebrow">Nanoweb · Hanoi</p>
            <h3>Frontend Developer</h3>
            <ul>
              <li>Develop and operate production applications with React, Next.js and TypeScript.</li>
              <li>Propose frontend architecture, reusable components, state strategy and API integration flows.</li>
              <li>Coordinate with clients, backend developers and stakeholders from requirements to release.</li>
              <li>Handle testing, deployment, performance improvements and production issue resolution.</li>
            </ul>
          </div>
        </article>
      </section>

      <section className="contact" id="contact">
        <p className="section-index">06 / Contact</p>
        <h2>Let&apos;s build something thoughtful.</h2>
        <p>Available for a mid-level frontend opportunity in Hanoi.</p>
        <div className="contact-grid">
          <a href="mailto:phamphuc05071998@gmail.com"><span>Email</span>phamphuc05071998@gmail.com</a>
          <a href="tel:+84972462798"><span>Phone</span>+84 972 462 798</a>
          <a href="https://www.linkedin.com/in/phamphuc1998/" target="_blank" rel="noreferrer"><span>LinkedIn</span>phamphuc1998</a>
          <a href="/docs/Pham_Xuan_Phuc_Frontend_Developer_CV.pdf" download><span>Resume</span>Download PDF</a>
        </div>
      </section>

      <footer>
        <p>© 2026 Phạm Xuân Phúc · Frontend Developer</p>
        <a href="#top">Back to the light ↑</a>
      </footer>
    </main>
  );
}
