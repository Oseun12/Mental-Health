'use client'

import React from 'react'
import { motion } from "framer-motion";

function Overview() {
    const fadeIn = {
        hidden: { opacity: 0, y: 50 },
        visible: (delay: number) => ({
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, delay },
        }),
      };
  return (
    <div className="bg-gray-50 py-20">
        <div className="mx-auto max-w-screen-xl items-center">
            <div className='text-center'>
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                {[
                    {
                    title: "Why is Mental Health Important?",
                    content:
                        "Mental health is just as important as physical health. Poor mental health can lead to a range of issues, including stress, anxiety, depression, and even physical illnesses such as heart disease. On the other hand, good mental health fosters resilience, enhances productivity, and strengthens relationships.",
                    },
                    {
                    title: "Common Mental Health Challenges",
                    content: (
                        <ul className="mt-4 text-sm text-gray-700">
                        <li><strong>Stress:</strong> A normal response to demanding situations, but chronic stress can harm mental well-being.</li>
                        <li><strong>Anxiety Disorders:</strong> Excessive worry or fear that interferes with daily activities.</li>
                        <li><strong>Depression:</strong> Persistent sadness, loss of interest in activities, and a lack of motivation.</li>
                        <li><strong>Burnout:</strong> Emotional exhaustion due to prolonged stress and overwork.</li>
                        <li><strong>Social Isolation:</strong> A lack of meaningful social interactions, leading to loneliness and emotional distress.</li>
                        </ul>
                    ),
                    },
                    {
                    title: "How to Maintain Good Mental Health",
                    content: (
                        <ul className="mt-4 text-sm text-gray-700">
                        <li><strong>Practice Self-Care:</strong> Engage in activities that bring joy, relaxation, and fulfillment.</li>
                        <li><strong>Stay Active:</strong> Regular physical exercise helps improve mood and reduce stress.</li>
                        <li><strong>Build Strong Relationships:</strong> Stay connected with friends, family, and supportive communities.</li>
                        <li><strong>Manage Stress:</strong> Use mindfulness, deep breathing, and time management techniques.</li>
                        <li><strong>Seek Professional Help:</strong> When needed, consult therapists, counselors, or mental health professionals.</li>
                        </ul>
                    ),
                    },
                    {
                    title: "Breaking the Stigma Around Mental Health",
                    content:
                        "Many people hesitate to discuss mental health due to stigma and misconceptions. However, raising awareness and encouraging open conversations can help break these barriers. Mental health issues are common, and seeking help should be seen as a sign of strength, not weakness.",
                    },
                ].map((item, index) => (
                    <motion.div
                    key={index}
                    className="flex flex-col h-full"
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    custom={0.5}
                    >
                    <div className="flex flex-col justify-between h-full block rounded-md border bg-rose-100 border-gray-300 p-4 shadow-sm sm:p-6">
                        <div>
                        <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                        <p className="mt-4 text-sm text-gray-700">{item.content}</p>
                        </div>
                    </div>
                    </motion.div>
                ))}
            </div>

        </div>
    </div>
  )
}

export default Overview