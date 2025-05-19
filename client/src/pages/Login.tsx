
import Layout from '@/components/layout/Layout';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <Layout>
      <div className="container py-10 md:py-20 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">Welcome Back</h1>
          <LoginForm />
        </div>
      </div>
    </Layout>
  );
};

export default Login;
