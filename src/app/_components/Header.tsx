"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 z-20 w-full px-8 md:px-16 lg:px-32 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="h-[80px] w-[120px]">
            <Link href="/">
              <img
                src="./image/logo-removebg-preview.png"
                alt="logo"
                className="h-full w-full object-contain "
              />
            </Link>
          </div>

          {/* Navigation Links - Centered */}
          <div className="flex-1 flex justify-center">
            <nav
              className={`hidden md:flex items-center gap-8 ${
                isScrolled ? "text-black" : "text-white"
              }`}
            >
              <Link
                href="#about"
                className="text-base font-medium transition-colors duration-300 hover:text-gray-500"
              >
                About
              </Link>
              <Link
                href="#intro"
                className="text-base font-medium transition-colors duration-300 hover:text-gray-500"
              >
                Introduction
              </Link>
              <Link
                href="#faq"
                className="text-base font-medium transition-colors duration-300 hover:text-gray-500"
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                className="text-base font-medium transition-colors duration-300 hover:text-gray-500"
              >
                Contact us
              </Link>
            </nav>
          </div>

          {/* Signup / Get Started Button - Right-Aligned */}
          <div className="hidden md:flex">
            <Link
              href="/signup"
              className="bg-rose-600 text-white px-6 py-2 rounded-sm text-base font-medium transition-all duration-300 hover:bg-rose-800"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`md:hidden text-3xl transition-colors duration-300 ${
              isScrolled ? "text-black" : "text-black"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="menu"
          >
            <i className={`bi ${isMenuOpen ? "bi-x" : "bi-list"} text-white`}></i>
          </button>

          {isMenuOpen && (
            <nav className="absolute top-full left-0 w-full bg-white shadow-lg py-4 flex flex-col items-center gap-4 text-black">
              
              <Link className="text-base font-medium hover:text-gray-500" href="/offers">
                About
              </Link>
              <Link className="text-base font-medium hover:text-gray-500" href="/offers">
                Introduction
              </Link>
              <Link className="text-base font-medium hover:text-gray-500" href="/services">
                FAQ
              </Link>
              <Link className="text-base font-medium hover:text-gray-500" href="/contact">
                Contact us
              </Link>
              {/* Get Started button inside mobile menu */}
              <Link
              href="/signup"
              className="bg-rose-600 text-white px-6 py-2 rounded-sm text-base font-medium transition-all duration-300 hover:bg-rose-800"
            >
              Get Started
            </Link>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
