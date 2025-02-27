import React from 'react'
import { GiBrain, GiSelfLove, GiMeditation, GiHealthIncrease  } from "react-icons/gi";
import { RiPsychotherapyLine, RiUserCommunityLine } from "react-icons/ri";

function Introduction2() {
  return (
    <section
      className='mx-auto max-w-screen-xl px-4 md:px-6 xl:px-0 flex flex-col items-center justify-center w-full py-12 md:py-24 lg:py-32'
      id='features'
    >
      <div className='grid gap-10 sm:grid-cols-2 md:grid-cols-3 w-full 2xl:grid-cols-3 lg:gap-12 justify-items-center'>
        <div className='flex flex-col items-center text-center space-y-4'>
          < GiBrain className='h-12 w-12 text-primary' />
          <div className='space-y-2'>
            <h3 className='text-xl font-bold'>Understanding Mental Health</h3>
            <p className='max-w-[300px] text-muted-foreground'>
              Learn about the importance of mental health, how it affects daily life, and ways to maintain psychological well-being.
            </p>
          </div>
        </div>
        <div className='flex flex-col items-center text-center space-y-4'>
          <GiSelfLove className='h-12 w-12 text-primary' />
          <div className='space-y-2'>
            <h3 className='text-xl font-bold'>Wellness & Self-Care</h3>
            <p className='max-w-[300px] text-muted-foreground'>
              Discover effective self-care practices that promote emotional resilience, stress management, and overall well-being.
            </p>
          </div>
        </div>
        <div className='flex flex-col items-center text-center space-y-4'>
          <RiPsychotherapyLine className='h-12 w-12 text-primary' />
          <div className='space-y-2'>
            <h3 className='text-xl font-bold'>Therapy & Counseling</h3>
            <p className='max-w-[300px] text-muted-foreground'>
              Explore different types of therapy and how professional counseling can help in managing mental health conditions.
            </p>
          </div>
        </div>
        <div className='flex flex-col items-center text-center space-y-4'>
          <RiUserCommunityLine className='h-12 w-12 text-primary' />
          <div className='space-y-2'>
            <h3 className='text-xl font-bold'>Community & Support Groups</h3>
            <p className='max-w-[300px] text-muted-foreground'>
              Connect with support groups that provide encouragement, shared experiences, and practical coping strategies.
            </p>
          </div>
        </div>
        <div className='flex flex-col items-center text-center space-y-4'>
          <GiMeditation className='h-12 w-12 text-primary' />
          <div className='space-y-2'>
            <h3 className='text-xl font-bold'>Mindfulness & Meditation</h3>
            <p className='max-w-[300px] text-muted-foreground'>
              Learn how mindfulness and meditation can improve mental clarity, reduce anxiety, and enhance emotional regulation.
            </p>
          </div>
        </div>
        <div className='flex flex-col items-center text-center space-y-4'>
          <GiHealthIncrease className='h-12 w-12 text-primary' />
          <div className='space-y-2'>
            <h3 className='text-xl font-bold'>Personal Growth & Resilience</h3>
            <p className='max-w-[300px] text-muted-foreground'>
              Develop skills to build mental resilience, overcome challenges, and grow towards a healthier and happier life.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Introduction2
