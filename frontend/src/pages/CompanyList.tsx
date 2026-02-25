import { Building2, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCompany } from '../context/CompanyContext';
import { EMPTY_COMPANY } from '../types';

export default function CompanyList() {
  const navigate = useNavigate();
  const { companies, activeCompanyId, setActiveCompanyId, createCompany, deleteCompany, loading } =
    useCompany();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const company = await createCompany({ ...EMPTY_COMPANY, name: newName.trim() });
      navigate(`/companies/${company.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la empresa');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('¿Seguro que quieres eliminar esta empresa? Se perderán todos sus datos.')) return;
    try {
      await deleteCompany(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar la empresa');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Empresas</h1>
        <p className="text-gray-400 text-sm">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Empresas</h1>
          <p className="text-gray-500 mt-1">
            Gestiona los perfiles de empresa para generar campañas
          </p>
        </div>
      </div>

      {/* Company list */}
      {companies.length > 0 && (
        <div className="space-y-3">
          {companies.map((company) => (
            <div
              key={company.id}
              className={`bg-white rounded-xl border p-5 hover:shadow-md transition-shadow ${
                activeCompanyId === company.id
                  ? 'border-brand-400 ring-1 ring-brand-300'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <Link
                  to={`/companies/${company.id}`}
                  className="flex-1 flex items-center gap-3 min-w-0"
                >
                  <div className="p-2 bg-brand-100 rounded-lg flex-shrink-0">
                    <Building2 className="text-brand-600" size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{company.name}</h3>
                      {activeCompanyId === company.id && (
                        <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">
                          Activa
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {company.industry || 'Sin industria'} · {company.socialNetworks.length} red
                      {company.socialNetworks.length !== 1 ? 'es' : ''}
                    </p>
                  </div>
                </Link>
                <div className="flex items-center gap-2 ml-4">
                  {activeCompanyId !== company.id && (
                    <button
                      type="button"
                      onClick={() => setActiveCompanyId(company.id)}
                      className="text-xs px-3 py-1.5 border border-brand-300 text-brand-700 rounded-lg hover:bg-brand-50"
                    >
                      Activar
                    </button>
                  )}
                  <Link
                    to={`/companies/${company.id}`}
                    className="p-2 text-gray-400 hover:text-brand-600 rounded-lg hover:bg-gray-50"
                  >
                    <ChevronRight size={18} />
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(company.id, e)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {companies.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <Building2 className="mx-auto text-gray-300 mb-3" size={40} />
          <p className="text-gray-500 font-medium">No tienes empresas aún</p>
          <p className="text-gray-400 text-sm mt-1">Crea tu primera empresa para empezar</p>
        </div>
      )}

      {/* Create new company */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plus size={18} /> Nueva empresa
        </h2>
        <form onSubmit={handleCreate} className="flex gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nombre de la empresa"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={creating || !newName.trim()}
            className="px-4 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 disabled:opacity-50"
          >
            {creating ? 'Creando...' : 'Crear'}
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </section>
    </div>
  );
}
