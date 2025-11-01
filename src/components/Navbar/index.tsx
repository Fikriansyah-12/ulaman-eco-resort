"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Index() {
  // ====== REFS (elemen yang dianimasikan) ======
  const headerRef = useRef<HTMLElement | null>(null); 
  const innerRef = useRef<HTMLDivElement | null>(null); 
  const logoContainerRef = useRef<HTMLDivElement | null>(null); 
  const logoWrapRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // ====== STATE (UI) ======
  const [scrolled, setScrolled] = useState(false); 
  const [open, setOpen] = useState(false);

  // ====== KONSTANTA UKURAN (MUDAH DIUBAH) ======
  const RANGE = 140; // jarak scroll animasi (px)
  const PAD_START = 28; // padding top/bottom awal (px)
  const PAD_END = 8; // padding top/bottom akhir (px)
  const H_START = 130; // tinggi container logo awal (px)
  const H_END = 100; // tinggi container logo akhir (px)
  const W_START = 280; // lebar logo awal (px)
  const W_END = 180; // lebar logo akhir (px)

  // ====== Header masuk & toggle warna sticky ======
  useEffect(() => {
    if (!headerRef.current) return;

    // animasi masuk dari atas
    gsap.fromTo(
      headerRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
    );

    // ubah warna saat lewat 50px
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ====== Animasi scroll-driven (padding, tinggi, lebar) ======
  useEffect(() => {
    if (!innerRef.current || !logoWrapRef.current || !logoContainerRef.current)
      return;

    // 1) Padding nav: besar -> kecil
    gsap.fromTo(
      innerRef.current,
      { paddingTop: PAD_START, paddingBottom: PAD_START },
      {
        paddingTop: PAD_END,
        paddingBottom: PAD_END,
        ease: "none",
        scrollTrigger: { start: "top top", end: `+=${RANGE}`, scrub: true },
      }
    );

    // 2) Lebar logo: W_START -> W_END
    gsap.fromTo(
      logoWrapRef.current,
      { width: W_START },
      {
        width: W_END,
        ease: "none",
        scrollTrigger: { start: "top top", end: `+=${RANGE}`, scrub: true },
      }
    );

    // 3) Tinggi container logo: H_START -> H_END
    gsap.fromTo(
      logoContainerRef.current,
      { height: H_START },
      {
        height: H_END,
        ease: "none",
        scrollTrigger: { start: "top top", end: `+=${RANGE}`, scrub: true },
      }
    );
  }, []);

  // ====== Mobile menu open/close ======
  useEffect(() => {
    if (!menuRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    if (open) {
      tl.set(menuRef.current, { display: "block" }).fromTo(
        menuRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.25 }
      );
    } else {
      tl.to(menuRef.current, { y: -10, opacity: 0, duration: 0.2 }).set(
        menuRef.current,
        { display: "none" }
      );
    }
  }, [open]);

  const handleNavClick = () => setOpen(false);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${
        scrolled
          ? "bg-[#EFEBE2]/95 backdrop-blur-sm border-b border-[#c69c4d]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* BAR DALAM (padding diatur GSAP) */}
      <div
        ref={innerRef}
        className="flex items-center justify-between px-6 lg:px-12 transition-[padding] duration-300"
        style={{ paddingTop: PAD_START, paddingBottom: PAD_START }}
      >
        {/* LEFT: Nav + Hamburger */}
        <nav className="flex items-center gap-10 flex-1">
          {/* HAMBURGER (2 garis -> hover sama panjang -> klik jadi X) */}
          <button
            aria-label={open ? "Close Menu" : "Open Menu"}
            aria-expanded={open}
            onClick={() => setOpen((s) => !s)}
            className="relative w-9 h-7 group focus:outline-none cursor-pointer flex items-center justify-center"
          >
            <div className="relative w-8 h-6">
              {/* Atas */}
              <span
                className={[
                  "absolute left-0 top-1/2 -translate-y-[8px] rounded",
                  "transition-all duration-300",
                  open
                    ? "w-8 h-[2px] rotate-45 translate-y-0"
                    : "w-1/2 h-[2px] group-hover:w-8",
                  scrolled ? "bg-[#c69c4d]" : "bg-[#f4efe8]",
                ].join(" ")}
                style={{ transformOrigin: "left center" }}
              />
              {/* Bawah */}
              <span
                className={[
                  "absolute left-0 top-1/2 translate-y-[6px] rounded",
                  "transition-all duration-300",
                  open
                    ? "w-8 h-[2px] -rotate-45 -translate-y-0"
                    : "w-8 h-[2px] group-hover:w-8",
                  scrolled ? "bg-[#c69c4d]" : "bg-[#f4efe8]",
                ].join(" ")}
                style={{ transformOrigin: "left center" }}
              />
            </div>
          </button>

          {/* Desktop links */}
          <ul className="hidden md:flex justify-between gap-10 ml-6 text-lg font-extralight tracking-wide">
            <li>
              <Link
                href="/rooms"
                className={`hover:text-[#c69c4d] transition-colors ${
                  scrolled ? "text-[#c69c4d]" : "text-white"
                }`}
              >
                Villas
              </Link>
            </li>
            <li>
              <Link
                href="https://riversidespabyulaman.com/"
                className={`hover:text-[#c69c4d] transition-colors ${
                  scrolled ? "text-[#c69c4d]" : "text-white"
                }`}
              >
                Spa
              </Link>
            </li>
            <li>
              <Link
                href="https://earthbyulaman.com/"
                className={`hover:text-[#c69c4d] transition-colors ${
                  scrolled ? "text-[#c69c4d]" : "text-white"
                }`}
              >
                Dine
              </Link>
            </li>
            <li>
              <Link
                href="/retreats"
                className={`hover:text-[#c69c4d] transition-colors ${
                  scrolled ? "text-[#c69c4d]" : "text-white"
                }`}
              >
                Retreats
              </Link>
            </li>
          </ul>
        </nav>

        {/* CENTER: Logo (anti-kepotong + shrink halus) */}
        <div
          ref={logoContainerRef}
          className="flex justify-center flex-1"
          style={{ height: H_START, willChange: "height" }} // 130 -> 100 (GSAP)
        >
          <Link href="/" onClick={handleNavClick} className="w-full">
            <div
              ref={logoWrapRef}
              className="h-full mx-auto flex items-center justify-center"
              style={{ width: W_START, willChange: "width" }} // 280 -> 120 (GSAP)
            >
              <Image
                src="/logo/ulaman.png"
                alt="Ulaman Logo"
                width={600}
                height={300}
                className="object-contain max-w-full"
                priority
              />
            </div>
          </Link>
        </div>

        {/* RIGHT: CTA */}
        <div className="flex md:hidden items-center space-x-6 flex-1 justify-end">
          <Link
            href="/book"
            onClick={handleNavClick}
            className={`px-6 py-2 rounded-tl-lg rounded-br-lg text-sm transition-all duration-300 hover:bg-[#c69c4d] ${
              scrolled
                ? "border border-[#c69c4d] text-[#c69c4d]"
                : "border border-white text-white"
            }`}
          >
            Book
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6 flex-1 justify-end">
          <Link
            href="/contact"
            onClick={handleNavClick}
            className={`px-10 py-4 rounded-tl-lg rounded-br-lg text-lg transition-colors duration-300
    hover:bg-[#c69c4d] hover:text-white
    ${
      scrolled
        ? "border-2 border-[#c69c4d] text-[#c69c4d]"
        : "border-2 border-white hover:border-[#c69c4d] text-white"
    }
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c69c4d]/60`}
          >
            Stay With Us
          </Link>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div ref={menuRef} className="md:hidden hidden px-6 pt-2 pb-6">
        <ul className="space-y-4">
          <li>
            <Link
              href="/rooms"
              className={`block text-base ${
                scrolled ? "text-[#725f33]" : "text-white"
              }`}
              onClick={handleNavClick}
            >
              Villas
            </Link>
          </li>
          <li>
            <Link
              href="https://riversidespabyulaman.com/"
              className={`block text-base ${
                scrolled ? "text-[#725f33]" : "text-white"
              }`}
              onClick={handleNavClick}
            >
              Spa
            </Link>
          </li>
          <li>
            <Link
              href="https://earthbyulaman.com/"
              className={`block text-base ${
                scrolled ? "text-[#725f33]" : "text-white"
              }`}
              onClick={handleNavClick}
            >
              Dine
            </Link>
          </li>
          <li>
            <Link
              href="/retreats"
              className={`block text-base ${
                scrolled ? "text-[#725f33]" : "text-white"
              }`}
              onClick={handleNavClick}
            >
              Retreats
            </Link>
          </li>
          <li className="pt-2">
            <Link
              href="/contact"
              className="inline-block px-6 py-3 rounded-tl-lg rounded-br-lg border border-[#c69c4d] text-[#c69c4d]"
              onClick={handleNavClick}
            >
              Stay with us
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
