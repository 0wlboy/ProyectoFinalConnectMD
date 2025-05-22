import { useState } from 'react';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Eye, EyeOff, Mail, Lock, User, Globe, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Link } from 'react-router-dom';
import ProfilePhotoUpload from './ProfilePhotoUpload';
import axios from 'axios';

// Expresiones regulares para validación
const nameRegex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[~!@#$%^&*()_+{}:;<>,.?/\\-]).{8,}$/;
;

const RegistrationFormClient = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profilePicture: null,
    password: '',
    confirmPassword: '',
    role: 'client',
    country: '',
    city: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ message: '', type: '' }); // type: 'success' or 'error'
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    // Validar el campo actual
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!nameRegex.test(value)) {
          error = 'Solo se permiten letras y espacios.';
        }
        break;
      case 'email':
        if (!emailRegex.test(value)) {
          error = 'Por favor, introduce un correo electrónico válido.';
        }
        break;
      case 'password':
        if (!passwordRegex.test(value)) {
          error = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.';
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          error = 'Las contraseñas no coinciden.';
        }
        break;
      default:
        break;
    }

    setErrors({
      ...errors,
      [name]: error
    });
  };

  const handlePhotoUpload = (file) => {
    setFormData({
      ...formData,
      profilePicture: file
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
    setSubmitStatus({ message: '', type: '' }); // Clear previous submit messages

    // --- Refined Validation ---
    const validationErrors = {};
    let formIsValid = true;

    // Validate firstName
    if (!formData.firstName.trim()) {
        validationErrors.firstName = 'El nombre es requerido.';
        formIsValid = false;
    } else if (!nameRegex.test(formData.firstName)) {
        validationErrors.firstName = 'Solo se permiten letras y espacios.';
        formIsValid = false;
    }

    // Validate lastName
    if (!formData.lastName.trim()) {
        validationErrors.lastName = 'El apellido es requerido.';
        formIsValid = false;
    } else if (!nameRegex.test(formData.lastName)) {
        validationErrors.lastName = 'Solo se permiten letras y espacios.';
        formIsValid = false;
    }

    // Validate email
    if (!formData.email.trim()) {
        validationErrors.email = 'El correo electrónico es requerido.';
        formIsValid = false;
    } else if (!emailRegex.test(formData.email)) {
        validationErrors.email = 'Por favor, introduce un correo electrónico válido.';
        formIsValid = false;
    }

    // Validate password
    if (!formData.password) {
        validationErrors.password = 'La contraseña es requerida.';
        formIsValid = false;
    } else if (!passwordRegex.test(formData.password)) {
        validationErrors.password = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.';
        formIsValid = false;
    }

    // Validate confirmPassword
    if (!formData.confirmPassword) {
        validationErrors.confirmPassword = 'Por favor, confirma tu contraseña.';
        formIsValid = false;
    } else if (formData.confirmPassword !== formData.password) {
        validationErrors.confirmPassword = 'Las contraseñas no coinciden.';
        formIsValid = false;
    }
    
    setErrors({
        firstName: validationErrors.firstName || '',
        lastName: validationErrors.lastName || '',
        email: validationErrors.email || '',
        password: validationErrors.password || '',
        confirmPassword: validationErrors.confirmPassword || '',
    });

    if (!formIsValid) {
        return;
    }
    // --- End Refined Validation ---

    setIsLoading(true);
    try {
      const data = new FormData();
      data.append('firstName', formData.firstName);
      data.append('lastName', formData.lastName);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('role', formData.role);
      data.append('country', formData.country);
      data.append('city', formData.city);

      if (formData.profilePicture) {
        data.append('profilePicture', formData.profilePicture, formData.profilePicture.name);
      }
      // Consider using an environment variable for the API URL
      const API_URL = 'http://localhost:5173/users/register';
      const response = await axios.post(API_URL, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Registro exitoso:', response.data);
        setSubmitStatus({ message: '¡Registro exitoso! Ya puedes iniciar sesión.', type: 'success' });
        // Optionally, clear form or redirect:
        // setFormData({ firstName: '', lastName: '', ... });
        // setTimeout(() => navigate('/login'), 3000); // If using react-router v6
    } catch (error) {
        console.error('Error al registrar:', error);
        let errorMessage = 'Error al registrar. Inténtalo de nuevo más tarde.';
        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        }
        setSubmitStatus({ message: errorMessage, type: 'error' });
        // If backend returns specific field errors, you might want to update `errors` state:
        // if (error.response && error.response.data && error.response.data.errors) {
        //   setErrors(prevErrors => ({ ...prevErrors, ...error.response.data.errors }));
        // }
    } finally {
        setIsLoading(false);
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
          {/* Display API submission status messages */}
          {submitStatus.message && (
            <p className={`text-sm mb-4 ${submitStatus.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
              {submitStatus.message}
            </p>
          )}
        </div>
        <div className="flex justify-center mb-6">
          <ProfilePhotoUpload onPhotoUpload={handlePhotoUpload} />
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
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
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
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
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
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
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
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
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

        <Button
          type="submit"
          className="w-full bg-[#00bcd4] hover:bg-[#00aec5] text-white font-medium py-2 transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Registrando...' : 'Registrar'}
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
