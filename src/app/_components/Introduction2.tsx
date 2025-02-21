import { ImportIcon, LockIcon, MemoryStickIcon, PublicTreeIcon, TimerIcon, UserIcon } from '@/components/Icon'
import React from 'react'
// import {
//     ImportIcon,
//     MemoryStickIcon,
//     PublicTreeIcon,
//     TimerIcon,
//     UserIcon,
//     LockIcon,
//   } from "../components/Icons";

function Introduction2() {
  return (
    <section
          className='mx-auto max-w-screen-xl px-4 md:px-6 xl:px-0 flex flex-col gap-10 items-center justify-center w-full py-12 md:py-24 lg:py-32 lg:items-start'
          id='features'
        >
          <div className='grid gap-10 sm:grid-cols-2 md:grid-cols-3 w-full 2xl:grid-cols-3 lg:gap-12'>
            <div className='flex flex-col items-center text-center space-y-4 lg:text-left lg:items-start'>
              <UserIcon className='h-12 w-12 text-primary' />
              <div className='space-y-2'>
                <h3 className='text-xl font-bold'>Individual Profiles</h3>
                <p className='max-w-[300px] text-muted-foreground'>
                  Create detailed profiles for each member of your family,
                  including photos, biographies, and important life events.
                </p>
              </div>
              
            </div>
            <div className='flex flex-col items-center text-center space-y-4 lg:text-left lg:items-start'>
              <TimerIcon className='h-12 w-12 text-primary' />
              <div className='space-y-2'>
                <h3 className='text-xl font-bold'>
                  Individual & Family Timelines
                </h3>
                <p className='max-w-[300px] text-muted-foreground'>
                  Follow the journey of your family through interactive
                  timelines, documenting key events and milestones for
                  individuals and the family as a whole.
                </p>
              </div>
              {/* <Link
                  href='#'
                  className='inline-flex h-9 items-center justify-center rounded-md bg-[#E6E5E5] px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-[#E6E5E5]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
                  prefetch={false}
                >
                  Learn More
                </Link> */}
            </div>
            <div className='flex flex-col items-center text-center space-y-4 lg:text-left lg:items-start'>
              <MemoryStickIcon className='h-12 w-12 text-primary' />
              <div className='space-y-2'>
                <h3 className='text-xl font-bold'>
                  Historical Memories Preservation
                </h3>
                <p className='max-w-[300px] text-muted-foreground'>
                  Preserve your family&apos;s stories, photos, and heirlooms in
                  a secure digital archive to be passed down for generations.
                </p>
              </div>
              {/* <Link
                  href='#'
                  className='inline-flex h-9 items-center justify-center rounded-md bg-[#E6E5E5] px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-[#E6E5E5]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
                  prefetch={false}
                >
                  Learn More
                </Link> */}
            </div>
            {/* </div> */}
            {/* <div className='grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:gap-12'> */}
            <div className='flex flex-col items-center text-center space-y-4 lg:text-left lg:items-start'>
              <LockIcon className='h-12 w-12 text-primary' />
              <div className='space-y-2'>
                <h3 className='text-xl font-bold'>Roles & Permissions</h3>
                <p className='max-w-[300px] text-muted-foreground'>
                  Manage access and permissions for family members, allowing
                  them to view, contribute, and collaborate on your family tree.
                </p>
              </div>
              {/* <Link
                  href='#'
                  className='inline-flex h-9 items-center justify-center rounded-md bg-[#E6E5E5] px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-[#E6E5E5]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
                  prefetch={false}
                >
                  Learn More
                </Link> */}
            </div>
            <div className='flex flex-col items-center text-center space-y-4 lg:text-left lg:items-start'>
              <PublicTreeIcon className='h-12 w-12 text-primary' />
              <div className='space-y-2'>
                <h3 className='text-xl font-bold'>Make Family Tree Public</h3>
                <p className='max-w-[300px] text-muted-foreground'>
                  Share your family tree with the world by making it public.
                  Allow others to view and explore your family&apos;s history,
                  connections, and milestones while maintaining control over
                  what information is shared.
                </p>
              </div>
              
            </div>
            <div className='flex flex-col items-center text-center space-y-4 lg:text-left lg:items-start'>
              <ImportIcon className='h-12 w-12 text-primary' />
              <div className='space-y-2'>
                <h3 className='text-xl font-bold'>Export Family Tree</h3>
                <p className='max-w-[300px] text-muted-foreground'>
                  Export your family tree as a PDF or SVG file to share with
                  family members or preserve for future generations.
                </p>
              </div>
              
            </div>
          </div>
        </section>
  )
}

export default Introduction2