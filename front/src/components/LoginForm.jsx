import { useState } from 'react';
import { Link } from 'react-router-dom'; // Importar Link
import { Input } from "./ui/input.jsx";
import { Button } from "./ui/button.jsx";
import { Checkbox } from "./ui/checkbox.jsx";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";


const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempted with:', { email, password, rememberMe });
    // Handle login logic here
  };

  return (
    <div className="bg-white rounded-md shadow-lg p-6 w-full max-w-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-[#00bcd4]">Iniciar Sesion</h1>
        <p className="text-gray-500 text-sm">Introduce tus credenciales para acceder</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Correo Electronico</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="h-4 w-4 text-gray-400" />
            </div>
            <Input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo@gmail.com"
              className="pl-10 pr-10 bg-blue-50 border-blue-100 focus:border-[#00bcd4] focus:ring-[#00bcd4] transition-all"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-gray-400 hover:text-[#00bcd4]"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">Contraseña</label>
            <a href="#" className="text-xs text-[#00bcd4] hover:underline">¿Olvidaste tu contraseña?</a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <Input 
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="pl-10 pr-10 bg-blue-50 border-blue-100 focus:border-[#00bcd4] focus:ring-[#00bcd4] transition-all"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={togglePasswordVisibility}
                className="h-6 w-6 text-gray-400 hover:text-[#00bcd4]"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="rememberMe" 
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked)}
          />
          <label 
            htmlFor="rememberMe" 
            className="text-sm text-gray-600 cursor-pointer"
          >
            ¿Recordar mi Sesión?
          </label>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-[#00bcd4] hover:bg-[#00aec5] text-white font-medium py-2 transition-colors"
        >
          Ingresar
        </Button>
      </form>

      <div className="text-center mt-6">
        <p className="text-gray-600 text-sm">
          ¿No tienes cuenta? 
          <Link to="/RoleSelection" className="text-[#00bcd4] hover:underline ml-1">Registrate</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;