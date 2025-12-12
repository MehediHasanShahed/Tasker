'use client'

import { SignIn } from '@clerk/nextjs'
import React, { useEffect } from 'react'

const SignInPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <SignIn/>
  )
}

export default SignInPage