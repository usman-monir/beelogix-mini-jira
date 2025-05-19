
import Layout from '@/components/layout/Layout';
import SignupForm from '@/components/auth/SignupForm';

const Signup = () => {
  return (
    <Layout>
      <div className="container py-10 md:py-20 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">Create Your Account</h1>
          <SignupForm />
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
