import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Mode = 'login' | 'register' | 'forgot' | 'reset';

export default function AuthPage() {
  const navigate = useNavigate();
  const {
    signIn,
    signUp,
    resendConfirmation,
    resetPasswordForEmail,
    updatePassword,
    isPasswordRecovery,
  } = useAuth();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  // If Supabase detected a PASSWORD_RECOVERY token in the URL, switch to reset mode
  useEffect(() => {
    if (isPasswordRecovery) {
      setMode('reset');
      setError(null);
      setMessage(null);
    }
  }, [isPasswordRecovery]);

  const resetState = () => {
    setError(null);
    setMessage(null);
    setPassword('');
    setConfirmPassword('');
    setRegisteredEmail(null);
  };

  const switchMode = (next: Mode) => {
    resetState();
    setMode(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        await signUp(email, password);
        setRegisteredEmail(email);
        setMessage('Registro exitoso. Revisa tu email para confirmar tu cuenta.');
      } else if (mode === 'login') {
        await signIn(email, password);
        navigate('/');
      } else if (mode === 'forgot') {
        await resetPasswordForEmail(email);
        setMessage(
          'Te hemos enviado un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada.',
        );
      } else if (mode === 'reset') {
        if (password !== confirmPassword) {
          setError('Las contraseñas no coinciden.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres.');
          setLoading(false);
          return;
        }
        await updatePassword(password);
        setMessage('Contraseña actualizada correctamente. Ya puedes iniciar sesión.');
        setTimeout(() => switchMode('login'), 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ha ocurrido un error');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!registeredEmail) return;
    setLoading(true);
    setError(null);
    try {
      await resendConfirmation(registeredEmail);
      setMessage('Email de confirmación reenviado. Revisa tu bandeja de entrada.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ha ocurrido un error');
    } finally {
      setLoading(false);
    }
  };

  const isLoginOrRegister = mode === 'login' || mode === 'register';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <p className="text-3xl font-bold text-gray-900">🚀 MarketingAI</p>
          <p className="text-gray-500 mt-2 text-sm">Plataforma de marketing inteligente</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {/* Tab switcher (only for login/register) */}
          {isLoginOrRegister && (
            <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  mode === 'login'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  mode === 'register'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Registrarse
              </button>
            </div>
          )}

          {/* Forgot / Reset headings */}
          {mode === 'forgot' && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recuperar contraseña</h2>
              <p className="text-sm text-gray-500 mt-1">
                Introduce tu email y te enviaremos un enlace para restablecerla.
              </p>
            </div>
          )}
          {mode === 'reset' && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Nueva contraseña</h2>
              <p className="text-sm text-gray-500 mt-1">
                Elige una nueva contraseña para tu cuenta.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email field — hidden in reset mode */}
            {mode !== 'reset' && (
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">Email</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </label>
            )}

            {/* Password field — hidden in forgot mode */}
            {mode !== 'forgot' && (
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  {mode === 'reset' ? 'Nueva contraseña' : 'Contraseña'}
                </span>
                <input
                  type="password"
                  required
                  autoComplete={
                    mode === 'register' || mode === 'reset' ? 'new-password' : 'current-password'
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </label>
            )}

            {/* Confirm password — only in reset mode */}
            {mode === 'reset' && (
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar contraseña
                </span>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </label>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700 space-y-2">
                <p>{message}</p>
                {/* Resend confirmation button — shown after register success */}
                {mode === 'register' && registeredEmail && (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading}
                    className="text-green-800 underline text-xs font-medium disabled:opacity-50"
                  >
                    ¿No te llegó? Reenviar email de confirmación
                  </button>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading
                ? 'Cargando...'
                : mode === 'login'
                  ? 'Iniciar sesión'
                  : mode === 'register'
                    ? 'Crear cuenta'
                    : mode === 'forgot'
                      ? 'Enviar enlace'
                      : 'Guardar contraseña'}
            </button>
          </form>

          {/* Secondary links */}
          <div className="mt-4 flex flex-col items-center gap-2 text-sm text-gray-500">
            {mode === 'login' && (
              <button
                type="button"
                onClick={() => switchMode('forgot')}
                className="hover:text-gray-700 underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            )}
            {(mode === 'forgot' || mode === 'reset') && (
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="hover:text-gray-700 underline"
              >
                Volver a iniciar sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
