"use client";
import React from "react";
import { motion } from "framer-motion";

const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay },
    }),
  };
  

function Introduction() {
  return (
    <section className="bg-gray-50 py-20" id="introduction">
      <div className="mx-auto max-w-screen-3xl px-4 lg:flex lg:items-center">
        <div className="text-center mx-auto">
          <motion.h1
            className="text-4xl font-extrabold sm:text-5xl text-gray-900"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={0.1}
          >
            Understanding Mental Health:
            <strong className="block font-extrabold text-red-700 mt-2">
              A Key to Overall Well-Being
            </strong>
          </motion.h1>

          <motion.p
            className="mt-6 text-lg mx-auto max-w-3xl text-gray-700 leading-relaxed"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={0.3}
          >
            Mental health is a crucial aspect of overall well-being, affecting how we think, feel, and behave in daily life. 
            It determines how we handle stress, relate to others, and make choices. Good mental health enables individuals to 
            cope with life’s challenges, work productively, and contribute meaningfully to their communities.
          </motion.p>

          <div className="md:flex mx-auto max-w-screen-xl gap-10">
            <motion.div
              className="md:w-1/2"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={0.5}
            >
              <h2 className="mt-8 text-2xl font-semibold text-gray-800">
                Why is Mental Health Important?
              </h2>
              <p className="mt-4 text-lg text-gray-700 leading-relaxed">
                Mental health is just as important as physical health. Poor mental health can lead to a range of issues, including 
                stress, anxiety, depression, and even physical illnesses such as heart disease. On the other hand, good mental health 
                fosters resilience, enhances productivity, and strengthens relationships.
              </p>

              <h2 className="mt-8 text-2xl font-semibold text-gray-800">
                Common Mental Health Challenges
              </h2>
              <ul className="mt-4 text-lg text-start text-gray-700 leading-relaxed list-disc list-inside">
                <li><strong>Stress:</strong> A normal response to demanding situations, but chronic stress can harm mental well-being.</li>
                <li><strong>Anxiety Disorders:</strong> Excessive worry or fear that interferes with daily activities.</li>
                <li><strong>Depression:</strong> Persistent sadness, loss of interest in activities, and a lack of motivation.</li>
                <li><strong>Burnout:</strong> Emotional exhaustion due to prolonged stress and overwork.</li>
                <li><strong>Social Isolation:</strong> A lack of meaningful social interactions, leading to loneliness and emotional distress.</li>
              </ul>
            </motion.div>

            <motion.div
              className="md:w-1/2"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={0.7}
            >
              <h2 className="mt-8 text-2xl font-semibold text-gray-800">
                How to Maintain Good Mental Health
              </h2>
              <p className="mt-4 text-lg text-gray-700 leading-relaxed">
                Maintaining mental well-being requires intentional effort. Here are some ways to promote mental health:
              </p>
              <ul className="mt-4 text-lg text-start text-gray-700 leading-relaxed list-disc list-inside">
                <li><strong>Practice Self-Care:</strong> Engage in activities that bring joy, relaxation, and fulfillment.</li>
                <li><strong>Stay Active:</strong> Regular physical exercise helps improve mood and reduce stress.</li>
                <li><strong>Build Strong Relationships:</strong> Stay connected with friends, family, and supportive communities.</li>
                <li><strong>Manage Stress:</strong> Use mindfulness, deep breathing, and time management techniques.</li>
                <li><strong>Seek Professional Help:</strong> When needed, consult therapists, counselors, or mental health professionals.</li>
              </ul>

              <h2 className="mt-8 text-2xl font-semibold text-gray-800">
                Breaking the Stigma Around Mental Health
              </h2>
              <p className="mt-4 text-lg text-gray-700 leading-relaxed">
                Many people hesitate to discuss mental health due to stigma and misconceptions. However, raising awareness and 
                encouraging open conversations can help break these barriers. Mental health issues are common, and seeking help 
                should be seen as a sign of strength, not weakness.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Introduction;
