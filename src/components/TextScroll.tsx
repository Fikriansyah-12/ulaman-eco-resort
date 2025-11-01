"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

type Props = {
  suggest?: string;       
  lines?: string[];        
  start?: string;          
  ratioPerLine?: number;  
  inactiveOpacity?: number;
  pin?: boolean;
};

export default function TextScroll({
  lines = [
    "Nestled among the rice fields and",
    "coconut trees of Tabanan, Ulaman",
    "is only 20 minutes away from the vibrant town of Canggu.",
  ],
  start = "top 78%",        
  ratioPerLine = 52,        
  inactiveOpacity = 0.22,
  pin = true,
}: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const suggestRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const s = suggestRef.current;
    if (!root || !s) return;

    const rows = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll("[data-row]")
    );

    gsap.set(s, { opacity: 0.6 }); 
    gsap.set(rows, { opacity: inactiveOpacity });
    rows.forEach((el) => gsap.set(el, { clipPath: "inset(0% 100% 0% 0%)" })); 

    const endLen = `+=${ratioPerLine * rows.length}vh`;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start,
        end: endLen,
        scrub: 0.65,
        pin,
        anticipatePin: 1,
      },
      defaults: { ease: "power3.out" },
    });

    tl.to(s, { opacity: 1, duration: 0.4 }, 0)
      .to(
        s,
        {
          scale: 1.02,
          letterSpacing: "0.01em",
          duration: 0.6,
        },
        0
      );

    rows.forEach((el, i) => {
      tl.to(
        el,
        { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 0.9 },
        i === 0 ? ">+0.05" : ">"
      );
      if (i > 0) tl.to(rows[i - 1], { opacity: inactiveOpacity, duration: 0.5 }, "<0.25");
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [ratioPerLine, start, inactiveOpacity, pin]);

  return (
    <section className="w-full bg-[#F5EFE3]">
      <div className="mx-auto max-w-5xl px-6 md:px-8 ">
        <div
          ref={suggestRef}
          className="mb-6 text-center text-sm md:text-base tracking-wide text-[#7b6a4a] font-medium"
        >
        </div>

        <div ref={rootRef}>
          <h2 className="text-center leading-[1.12] font-americana">
            {lines.map((t, i) => (
              <span
                key={i}
                data-row
                className={[
                  "block will-change-[opacity,clip-path]",
                  "text-3xl md:text-5xl",
                  i < lines.length - 1 ? "mb-[0.45em]" : "",
                  "bg-linear-to-r from-[#C49A51] via-[#B88B3B] to-[#C49A51] bg-clip-text text-transparent",
                ].join(" ")}
                style={{ letterSpacing: ".005em" }}
              >
                {t}
              </span>
            ))}
          </h2>
        </div>
      </div>
    </section>
  );
}
