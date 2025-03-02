import DashboardLayout from '@/components/DashboardLayout'
import React, { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode;
}

function layout({children}: LayoutProps) {
  return (
    <div>
        <DashboardLayout>
            {children}
        </DashboardLayout>
    </div>
  )
}

export default layout