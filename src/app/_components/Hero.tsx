import React from "react";
import Image from "next/image";

function Hero() {
  return (
    <section className="relative h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/image/hero-image.webp"
          alt="Background"
          layout="fill"
          objectFit="cover"
          priority
        />
        {/* Dark overlay for opacity effect */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8">
        <div className="max-w-xl text-left"> 
          <h1 className="text-3xl font-extrabold text-white sm:text-5xl">
            Let us find your
            <strong className="block font-extrabold text-rose-500"> Forever Home. </strong>
          </h1>

          <p className="mt-4 max-w-lg text-white sm:text-xl">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt illo tenetur fuga ducimus
            numquam ea!
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/signup"
              className="block  rounded-sm bg-rose-600 px-12 py-3 text-sm font-medium text-white shadow-sm hover:bg-rose-700 sm:w-auto"
            >
              Get Started
            </a>

            {/* <a
              href="#"
              className="block w-full rounded-sm bg-white px-12 py-3 text-sm font-medium text-rose-600 shadow-sm hover:text-rose-700 sm:w-auto"
            >
              Learn More
            </a> */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
