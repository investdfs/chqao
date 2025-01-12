import RegisterForm from "@/components/register/RegisterForm";
import WhatsAppBenefits from "@/components/register/WhatsAppBenefits";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light via-white to-secondary p-4">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-8">
        <RegisterForm />
        <WhatsAppBenefits />
      </div>
    </div>
  );
};

export default Register;