'use client'
import StepHeader from '@/components/StepHeader'

export default function ProductStepsLayout({ children }) {
  return (
    // <html lang="en">
    //   <body className={open.className} data-body="dc">
    <>
    <StepHeader />
    {children}
    </>
    // </html>
  )
}
