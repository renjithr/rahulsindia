/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FBFAF7",   // paper
        surface:    "#FFFFFF",
        border:     "#E4E0D8",
        ink:        "#1A1A18",   // charcoal
        muted:      "#6B675E",
        // Party palette. Two shades each: *Ink for text (WCAG AAA on paper),
        // the base for chart strokes and fills (>= 3:1, WCAG 1.4.11).
        rahul:      "#1D5FA8",   // blue   — counterfactual   6.18:1
        rahulInk:   "#14457C",   //                            9.26:1
        modi:       "#D2691E",   // orange — actual            3.48:1
        modiInk:    "#803A07",   //                            7.96:1
        primary:    "#14457C",   // alias -> rahulInk (nav, focus rings, links)
        accent:     "#8C2F2F",
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        body:    ["Georgia", '"Iowan Old Style"', "serif"],
        ui:      ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        mono:    ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      maxWidth: { reading: "68ch" },
      boxShadow: { card: "0 1px 2px rgba(26,26,24,.04), 0 8px 24px -12px rgba(26,26,24,.10)" },
    },
  },
  plugins: [],
}
