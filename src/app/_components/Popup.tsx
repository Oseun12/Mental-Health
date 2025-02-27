import React from 'react';

function Popup() {
  return (
    <section className="overflow-hidden mx-auto max-w-screen-xl rounded-lg shadow-2xl md:grid md:grid-cols-3">
      <img
        alt="Mental Wellness"
        src="https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=928&q=80"
        className="h-32 w-full object-cover md:h-full"
      />

      <div className="p-4 text-center sm:p-6 md:col-span-2 lg:p-8">
        <p className="text-sm font-semibold tracking-widest uppercase text-rose-300">
          Mental Wellness Matters
        </p>

        <h2 className="mt-6 font-black uppercase">
          <span className="text-4xl font-black sm:text-5xl lg:text-6xl text-rose-700">
            Prioritize Your Mental Well-Being
          </span>
          <span className="mt-2 block text-sm text-gray-600">
            Join our mindfulness program & improve your mental health today.
          </span>
        </h2>

        <a
          className="mt-8 inline-block w-full bg-black py-4 text-sm font-bold tracking-widest text-white uppercase rounded-lg hover:bg-gray-700 transition"
          href="/signup"
        >
          Start Your Free Plan
        </a>

        <p className="mt-8 text-xs font-medium text-gray-400 uppercase">
          Your journey to better mental health starts now!
        </p>
      </div>
    </section>
  );
}

export default Popup;
