
import LoginForm from '../components/LoginForm';


const Login = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <div className="z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;