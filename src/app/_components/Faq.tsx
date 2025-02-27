import React from 'react';

function Faq() {
  return (
    <div className="space-y-4 mx-auto max-w-screen-lg mt-20 mb-10">
      <h1 className="text-center text-3xl font-bold">FREQUENTLY ASKED QUESTIONS</h1>

      <details className="group [&_summary::-webkit-details-marker]:hidden" open>
        <summary
          className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-50 p-4 text-gray-900"
        >
          <h2 className="font-medium">How can I improve my mental health on a daily basis?</h2>
          <svg
            className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <p className="mt-4 px-4 leading-relaxed text-gray-700">
          Simple habits like practicing mindfulness, staying physically active, maintaining a balanced diet, getting enough sleep, and seeking social support can significantly boost your mental well-being.
        </p>
      </details>

      <details className="group [&_summary::-webkit-details-marker]:hidden">
        <summary
          className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-50 p-4 text-gray-900"
        >
          <h2 className="font-medium">What are some common signs of stress and anxiety?</h2>
          <svg
            className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <p className="mt-4 px-4 leading-relaxed text-gray-700">
          Symptoms of stress and anxiety may include constant worry, difficulty sleeping, irritability, rapid heartbeat, trouble concentrating, and muscle tension. If these symptoms persist, consider seeking professional help.
        </p>
      </details>

      <details className="group [&_summary::-webkit-details-marker]:hidden">
        <summary
          className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-50 p-4 text-gray-900"
        >
          <h2 className="font-medium">How can I manage my emotions effectively?</h2>
          <svg
            className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <p className="mt-4 px-4 leading-relaxed text-gray-700">
          Managing emotions involves self-awareness, deep breathing techniques, journaling, meditation, and talking to a trusted friend or therapist when needed. Identifying triggers and learning healthy coping strategies can also help.
        </p>
      </details>

      <details className="group [&_summary::-webkit-details-marker]:hidden">
        <summary
          className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-50 p-4 text-gray-900"
        >
          <h2 className="font-medium">When should I seek professional help for my mental health?</h2>
          <svg
            className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <p className="mt-4 px-4 leading-relaxed text-gray-700">
          If you are experiencing persistent sadness, overwhelming anxiety, difficulty functioning in daily life, or thoughts of self-harm, it is important to reach out to a mental health professional as soon as possible.
        </p>
      </details>
    </div>
  );
}

export default Faq;
