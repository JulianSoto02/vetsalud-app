import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('cliente@vetsalud.com');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    // Simple validation
    if (!email.trim() || !password.trim()) {
      setError('Por favor, completa todos los campos');
      setIsSubmitting(false);
      return;
    }
    
    // Attempt login
    const success = login(email, password);
    
    if (!success) {
      setError('Credenciales incorrectas. Intenta nuevamente.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-teal-600 py-6 px-6 text-white text-center">
          <h3 className="text-xl font-semibold">Acceso Clientes</h3>
          <p className="mt-1 text-teal-100 text-sm">
            Inicia sesión para acceder a la información de tus mascotas
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <label 
              htmlFor="email" 
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="correo@ejemplo.com"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Para demo: cliente@vetsalud.com
            </p>
          </div>
          
          <div className="mb-6">
            <label 
              htmlFor="password" 
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="••••••••"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Para demo: 1234
            </p>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-teal-600 text-white py-2 px-4 rounded-md font-medium 
              ${isSubmitting 
                ? 'opacity-70 cursor-not-allowed' 
                : 'hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2'}`}
          >
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;