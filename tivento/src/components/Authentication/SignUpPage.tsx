import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Tivento</h1>
          <p className="text-gray-600">Create your account and start connecting</p>
        </div>
        <SignUp 
          routing="hash"
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white",
              card: "shadow-xl",
            },
          }}
        />
      </div>
    </div>
  );
}