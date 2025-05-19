import React, { useState } from 'react';
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Eye, EyeOff, Mail, Lock, User, Globe, MapPin, Building, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Link } from 'react-router-dom';
import ProfilePhotoUpload from './ProfilePhotoUpload';

const RegistrationFormProf = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    profession: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    city: '',
    office: '',
    description: ''
  });
  const [officePhotos, setOfficePhotos] = useState([]);

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

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleOfficePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && officePhotos.length < 5) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setOfficePhotos([...officePhotos, event.target.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registro con:', formData, 'Fotos de oficina:', officePhotos);
    // Aquí iría la lógica para registrar al usuario
  };

  return (
    <div className="bg-white rounded-md shadow-lg p-6 w-full max-w-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-[#00bcd4]">Registro</h1>
        <p className="text-gray-500 text-sm">Introduce tus credenciales</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center mb-6">
          <ProfilePhotoUpload />
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
          <label className="text-sm font-medium text-gray-700">Profesión</label>
          <div className="relative">
            <Select onValueChange={(value) => handleSelectChange('profession', value)}>
              <SelectTrigger className="w-full bg-blue-50 border-blue-100 focus:border-[#00bcd4] focus:ring-[#00bcd4] pl-10">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Building className="h-4 w-4 text-gray-400" />
                </div>
                <SelectValue placeholder="Doctor, Psicólogo, Odontólogo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="psicologo">Psicólogo</SelectItem>
                <SelectItem value="odontologo">Odontólogo</SelectItem>
                <SelectItem value="fisioterapeuta">Fisioterapeuta</SelectItem>
                <SelectItem value="nutricionista">Nutricionista</SelectItem>
              </SelectContent>
            </Select>
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

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Introducir Oficina (pueden ser múltiples)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Building className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              name="office"
              value={formData.office}
              onChange={handleChange}
              placeholder="Calle 123, avenida Gran Avenida"
              className="pl-10 bg-blue-50 border-blue-100 focus:border-[#00bcd4] focus:ring-[#00bcd4] transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Agregar fotos de oficina (máximo 5)</label>
          <div className="flex gap-2 flex-wrap">
            {officePhotos.map((photo, index) => (
              <div key={index} className="w-12 h-12 rounded-md overflow-hidden">
                <img src={photo} alt="Oficina" className="w-full h-full object-cover" />
              </div>
            ))}
            {officePhotos.length < 5 && (
              <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-md cursor-pointer" onClick={() => document.getElementById('officePhotos').click()}>
                <Plus className="h-6 w-6 text-gray-400" />
              </div>
            )}
            <input
              id="officePhotos"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleOfficePhotoUpload}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Descripción</label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descripción"
            className="bg-blue-50 border-blue-100 focus:border-[#00bcd4] focus:ring-[#00bcd4] transition-all min-h-[100px]"
          />
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

export default RegistrationFormProf;
