'use client';
 
import { useActionState, Suspense } from 'react';
import { authenticate } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';

function LoginForm() {
  const searchParams = useSearchParams();
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );
 
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="text-center">
            <h2 className="text-2xl font-bold">Admin Access</h2>
            <p className="text-gray-500 mt-2">Please enter your password to continue.</p>
        </div>
        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none dark:bg-gray-800"
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          <div className="flex items-end space-x-1" aria-live="polite" aria-atomic="true">
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
          </div>
          <button
            className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            aria-disabled={isPending}
            disabled={isPending}
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <LoginForm />
        </Suspense>
    )
}