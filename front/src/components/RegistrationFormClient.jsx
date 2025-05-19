import { useState } from 'react';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Eye, EyeOff, Mail, Lock, User, Globe, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"; 
import { Checkbox } from "./ui/checkbox"; 
import { Link } from 'react-router-dom';
import ProfilePhotoUpload from './ProfilePhotoUpload';
import axios from 'axios'

const RegistrationFormClient = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profilePicture:'',
    password: '',
    confirmPassword: '',
    role:'client',
    country: '',
    city: ''
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePhotoUpload = (photoURL) => {
    setFormData({
      ...formData,
      photoURL: photoURL
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/register', formData);
      console.log('Registro exitoso:', response.data);
      // Aquí puedes manejar la respuesta del servidor, como redirigir al usuario o mostrar un mensaje de éxito
    } catch (error) {
      console.error('Error al registrar:', error);
      // Aquí puedes manejar el error, como mostrar un mensaje de error al usuario
    }
  };

  return (
    <div className="bg-white rounded-md shadow-lg p-6 w-full max-w-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-[#00bcd4]">Registro</h1>
        <p className="text-gray-500 text-sm">Introduce tus credenciales</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center mb-6">
          <ProfilePhotoUpload onPhotoUpload={handlePhotoUpload}/>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Nombre</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Nombre"
              className="pl-10 bg-blue-50 border-blue-100 focus:border-[#00bcd4] focus:ring-[#00bcd4] transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Apellido</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Apellido"
              className="pl-10 bg-blue-50 border-blue-100 focus:border-[#00bcd4] focus:ring-[#00bcd4] transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Correo@gmail.com"
              className="pl-10 bg-blue-50 border-blue-100 focus:border-[#00bcd4] focus:ring-[#00bcd4] transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Contraseña</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
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

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Repetir contraseña</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Contraseña"
              className="pl-10 pr-10 bg-blue-50 border-blue-100 focus:border-[#00bcd4] focus:ring-[#00bcd4] transition-all"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={toggleConfirmPasswordVisibility}
                className="h-6 w-6 text-gray-400 hover:text-[#00bcd4]"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Introducir País</label>
          <div className="relative">
            <Select onValueChange={(value) => handleSelectChange('country', value)}>
              <SelectTrigger className="w-full bg-blue-50 border-blue-100 focus:border-[#00bcd4] focus:ring-[#00bcd4] pl-10">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Globe className="h-4 w-4 text-gray-400" />
                </div>
                <SelectValue placeholder="Selecciona tu país" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="venezuela">Venezuela</SelectItem>
                <SelectItem value="colombia">Colombia</SelectItem>
                <SelectItem value="mexico">México</SelectItem>
                <SelectItem value="espana">España</SelectItem>
                <SelectItem value="argentina">Argentina</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Introducir ciudad</label>
          <div className="relative">
            <Select onValueChange={(value) => handleSelectChange('city', value)}>
              <SelectTrigger className="w-full bg-blue-50 border-blue-100 focus:border-[#00bcd4] focus:ring-[#00bcd4] pl-10">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
                <SelectValue placeholder="Selecciona tu ciudad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="caracas">Caracas</SelectItem>
                <SelectItem value="maracaibo">Maracaibo</SelectItem>
                <SelectItem value="valencia">Valencia</SelectItem>
                <SelectItem value="barquisimeto">Barquisimeto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <Checkbox
            id="location"
            // onCheckedChange={(checked) => /* manejar estado de ubicación */ }
            // checked={/* estado de ubicación */}
          />
          <label htmlFor="location" className="text-gray-600">¿Dar mi ubicación exacta?</label>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#00bcd4] hover:bg-[#00aec5] text-white font-medium py-2 transition-colors"
        >
          Registrar
        </Button>
      </form>

      <div className="text-center mt-6">
        <p className="text-gray-600 text-sm">
          ¿Tienes una cuenta?
          <Link to="/" className="text-[#00bcd4] hover:underline ml-1">Iniciar Sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationFormClient;
