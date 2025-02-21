"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
          <div className="h-[60px] w-[120px]">
            <Link href="/">
              <img
                src="./assets/new-logo-brandbuild.png"
                alt="logo"
                className="h-full w-full object-contain"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav
            className={`hidden md:flex items-center gap-8 ${
              isScrolled ? "text-black" : "text-white"
            }`}
          >
            {/* <Link
              href="/about"
              className="text-base font-medium transition-colors duration-300 hover:text-gray-500"
            >
              About us
            </Link> */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-base font-medium transition-colors duration-300 hover:text-gray-500"
              >
                About us
                <i className={`bi ${isDropdownOpen ? "bi-chevron-up" : "bi-chevron-down"} ml-2 items-center text-sm`}></i>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
                  <Link
                    href="/about"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    History
                  </Link>
                  {/* <Link
                    href="/offers"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Our Products
                  </Link> */}
                </div>
              )}
            </div>
            <Link
              href="/offers"
              className="text-base font-medium transition-colors duration-300 hover:text-gray-500"
            >
              Products
            </Link>
            <Link
              href="/services"
              className="text-base font-medium transition-colors duration-300 hover:text-gray-500"
            >
              Services
            </Link>
            <Link
              href="/contact"
              className="text-base font-medium transition-colors duration-300 hover:text-gray-500"
            >
              Contact us
            </Link>
          </nav>

          {/* Social Media Icons */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://www.facebook.com/brandbuild.ng"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="facebook"
              className={`transition-colors duration-300 hover:text-orange-500 ${
                isScrolled ? "text-black" : "text-black"
              }`}
            >
              <i className="bi bi-facebook text-xl"></i>
            </a>
            <a
              href="https://www.instagram.com/brandbuild.ng"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="instagram"
              className={`transition-colors duration-300 hover:text-orange-500 ${
                isScrolled ? "text-black" : "text-black"
              }`}
            >
              <i className="bi bi-instagram text-xl"></i>
            </a>
            <a
              href="https://api.whatsapp.com/send?phone=+2349038940088"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="whatsapp"
              className={`transition-colors duration-300 hover:text-orange-500 ${
                isScrolled ? "text-black" : "text-black"
              }`}
            >
              <i className="bi bi-whatsapp text-xl"></i>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`md:hidden text-3xl transition-colors duration-300 ${
              isScrolled ? "text-black" : "text-black"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="menu"
          >
            <i className={`bi ${isMenuOpen ? "bi-x" : "bi-list"}`}></i>
          </button>

          {isMenuOpen && (
            <nav
              className={`absolute top-full left-0 w-full bg-white shadow-lg py-4 flex flex-col items-center gap-4 text-black`}
            >
              {/* <Link
                className="text-base font-medium hover:text-gray-500"
                href="/about"
              >
                About us
              </Link> */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-base font-medium hover:text-gray-500"
                >
                  About Us
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
                    <Link
                      href="/about"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      History
                    </Link>
                    {/* <Link
                      href="/offers"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Seasonal Offers
                    </Link> */}
                  </div>
                )}
              </div>
              <Link
                className="text-base font-medium hover:text-gray-500"
                href="/offers"
              >
                Products
              </Link>
              <Link
                className="text-base font-medium hover:text-gray-500"
                href="/services"
              >
               Services
              </Link>
              <Link
                className="text-base font-medium hover:text-gray-500"
                href="/contact"
              >
                Contact us
              </Link>
              <div className="flex items-center gap-4">
                <Link
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="facebook"
                  className="text-black"
                >
                  <i className="bi bi-facebook text-xl"></i>
                </Link>
                <Link
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="instagram"
                  className="text-black"
                >
                  <i className="bi bi-instagram text-xl"></i>
                </Link>
                <Link
                    href="https://wa.me/2349038940088"
                    target="_blank"
                  rel="noopener noreferrer"
                  aria-label="whatsapp"
                  className="text-black"
                >
                  <i className="bi bi-whatsapp text-xl"></i>
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
