import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Read from "./pages/Read";
import Modi from "./pages/Modi";
import Everyday from "./pages/Everyday";
import Democracy from "./pages/Democracy";
import { data } from "./lib/data";
import { PovProvider, usePov } from "./lib/pov";

function Shell() {
  const { pov, other, subject, otherSubject, toggle } = usePov();
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4
                                focus:z-50 focus:rounded focus:bg-primary focus:px-4 focus:py-2
                                focus:font-ui focus:text-sm focus:text-white">Skip to content</a>
      <nav className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-3">
            <Link to="/" className="font-display text-lg tracking-tight transition-colors
                                    duration-300 hover:text-rahulInk">
              {subject.split("’s")[0]}&rsquo;s{" "}
              <span className={`italic ${pov === "rahul" ? "text-rahulInk" : "text-modiInk"}`}>
                India
              </span>
            </Link>
            <button type="button" onClick={toggle}
              aria-label={`Switch to ${otherSubject}`}
              className={`rounded-full border px-3 py-1 font-ui text-[11px] font-semibold
                          transition-all duration-300 ease-out active:scale-95 ${
                other === "modi"
                  ? "border-modi/40 bg-modi/10 text-modiInk hover:border-modi hover:bg-modi/[0.16]"
                  : "border-rahul/40 bg-rahul/10 text-rahulInk hover:border-rahul hover:bg-rahul/[0.16]"
              }`}>
              <span aria-hidden="true"
                    className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle ${
                      other === "modi" ? "bg-modi" : "bg-rahul"}`} />
              Switch to {otherSubject}
            </button>
          </div>
          <div className="hidden text-right font-ui text-[11px] leading-tight text-muted sm:block">
            <p>
              Synthetic control · treatment year{" "}
              <span className="num">{data.meta.treatmentYear}</span>
            </p>
            <p className="mt-0.5">
              Figures updated{" "}
              <span className="num">
                {new Date(data.meta.updated + "T00:00:00Z").toLocaleDateString("en-GB", {
                  day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
                })}
              </span>
            </p>
          </div>
        </div>
      </nav>
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/indicator/:id" element={<Detail />} />
          <Route path="/read" element={<Read />} />
          <Route path="/modi" element={<Modi />} />
          <Route path="/everyday" element={<Everyday />} />
          <Route path="/democracy" element={<Democracy />} />
        </Routes>
      </main>
      <footer className="rule mt-8">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="max-w-reading font-ui text-[11px] leading-relaxed text-muted">
            {data.meta.method}
          </p>
          <p className="mt-3 font-ui text-[11px] text-muted">
            Built {data.meta.built} · {data.meta.sources.join(" · ")}
          </p>
        </div>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <PovProvider>
        <Shell />
      </PovProvider>
    </BrowserRouter>
  );
}
