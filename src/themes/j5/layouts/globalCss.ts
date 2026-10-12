// Keyframes and small helper classes for the Journal 5 reference design (scrolling alerts, vertical and horizontal marquees, the academic double rule).
// Rendered once by SiteLayout. Every animation stops for visitors who prefer reduced motion and pauses on hover and keyboard focus.
export const j5Css = `
@keyframes j5-hscroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
@keyframes j5-vscroll { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
.j5-marquee { display: inline-flex; align-items: center; width: max-content; white-space: nowrap; animation: j5-hscroll 48s linear infinite; }
.j5-hscroll { display: flex; width: max-content; animation: j5-hscroll 32s linear infinite; }
.j5-vscroll { animation: j5-vscroll 26s linear infinite; }
.j5-marquee:hover, .j5-hscroll:hover, .j5-vscroll:hover, .j5-paused { animation-play-state: paused; }
.j5-double-rule { position: relative; height: 5px; width: 100%; }
.j5-double-rule::before, .j5-double-rule::after { content: ""; position: absolute; left: 0; right: 0; height: 1px; background-color: #dcc0be; }
.j5-double-rule::before { top: 0; }
.j5-double-rule::after { bottom: 0; }
@media (prefers-reduced-motion: reduce) {
  .j5-marquee, .j5-hscroll, .j5-vscroll { animation: none !important; transform: none !important; }
  .j5-marquee { white-space: normal; flex-wrap: wrap; }
  .j5-hscroll { width: auto; flex-wrap: wrap; }
  .j5-dup { display: none; }
}
`
