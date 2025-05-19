import RegistrationFormClient from '../components/RegistrationFormClient';

const RegisterClient = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <div className="z-10 w-full max-w-md">
        <RegistrationFormClient />
      </div>
    </div>
  );
};

export default RegisterClient;