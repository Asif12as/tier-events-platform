import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Join Tier Events
          </h1>
          <p className="text-gray-600">
            Start with a free account and upgrade anytime
          </p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 
                'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
              card: 'shadow-lg',
            },
          }}
        />
      </div>
    </div>
  )
}