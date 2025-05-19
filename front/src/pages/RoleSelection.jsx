import React from 'react';
import { Link } from 'react-router-dom';
import { User, Briefcase } from 'lucide-react';

const RoleSelection = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-[#00bcd4] text-white py-4 px-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold">Escoge un Rol</h1>
        <p className="text-sm md:text-base">¿Eres un Cliente o un Profesional?</p>
      </div>

      {/* Content */}
      <div className="flex-grow bg-gray-50 p-4 md:p-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Cliente Card */}
          <div className="overflow-hidden shadow-lg bg-white rounded-lg">
            <div className="flex flex-col h-full">
              <div className="w-full h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                  alt="Cliente"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-full p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-3">
                    <div className="bg-[#e0f7fa] p-2 rounded-full mr-3">
                      <User className="h-5 w-5 text-[#00bcd4]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#333]">
                      Clientes
                    </h2>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Accede a los servicios completos para clientes: Aplica filtros en tu búsqueda de profesionales, agenda citas y califícalos
                  </p>
                </div>
                <div className="mt-4">
                  <Link to="/RegisterClient">
                    <button className="w-full bg-[#00bcd4] hover:bg-[#00aec5] text-white font-medium py-2 rounded">
                      Ingresar
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Profesional Card */}
          <div className="overflow-hidden shadow-lg bg-white rounded-lg">
            <div className="flex flex-col h-full">
              <div className="w-full h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
                  alt="Profesional"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-full p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-3">
                    <div className="bg-[#e0f7fa] p-2 rounded-full mr-3">
                      <Briefcase className="h-5 w-5 text-[#00bcd4]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#333]">
                      Profesionales
                    </h2>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Accede a los servicios completos para profesionales: Configura un perfil, subir ubicación y imágenes de tus oficinas, administrar citas, obtén información precisa de tu desempeño en la página
                  </p>
                </div>
                <div className="mt-4">
                  <Link to="/RegisterProf">
                    <button className="w-full bg-[#00bcd4] hover:bg-[#00aec5] text-white font-medium py-2 rounded">
                      Ingresar
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
