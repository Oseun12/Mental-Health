import DashboardLayout from '@/components/DashboardLayout'
import React from 'react'

function layout({children}) {
  return (
    <div>
        <DashboardLayout>
            {children}
        </DashboardLayout>
    </div>
  )
}

export default layout