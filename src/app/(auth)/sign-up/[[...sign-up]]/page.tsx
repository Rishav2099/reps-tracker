import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <SignUp 
        // appearance={{
        //   elements: {
        //     card: 'shadow-lg bg-base-100 p-6 rounded-lg',
        //     formButtonPrimary: 'btn btn-primary',
        //     formFieldInput: 'input input-bordered input-primary',
        //   },
        // }}
      />
      <div>
        heloo sign up
      </div>
    </div>
  );
}
