'use client'

import { SignUp } from '@clerk/nextjs'
import React, { useEffect } from 'react'

const SignUpPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <SignUp/>
  )
}

export default SignUpPage