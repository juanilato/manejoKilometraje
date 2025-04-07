import { useEffect, useState } from "react";
import styles from "../styles/Home.module.scss";
import Modal from "../components/modal";
import ConfirmDialog from "../components/ConfirmDialog";
type Auto = {
    id: number;
    marca: string;
    modelo: string;
    patente: string;
    kilometraje: number;
    reparaciones?: Reparacion[]; // 👈 esta línea es clave
  };
  

type Reparacion = {
    id: number;
    fecha: string;
    kilometraje: number;
    reparacion: string;
  };
  


export default function Home() {
  const [autos, setAutos] = useState<Auto[]>([]);
  const [form, setForm] = useState<{ marca: string; modelo: string; patente: string; kilometraje: string }>({ marca: "", modelo: "", patente: "", kilometraje: "" });
  const [reparacionForm, setReparacionForm] = useState({ fecha: "", kilometraje: "", vehiculoId: "", reparacion: "" });
  const [actualizaKilometrajeForm, setActualizaKilometraje] = useState({ vehiculoId: "", kilometraje: "" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReparacionModal, setShowReparacionModal] = useState(false);

  const [showActualizarModal, setShowActualizarModal] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const [idAEliminar, setIdAEliminar] = useState<number | null>(null);
  const [tipoAEliminar, setTipoAEliminar] = useState<'vehiculo' | 'reparacion' | null>(null);


  useEffect(() => {
    fetchAutos();
  }, []);

  const fetchAutos = async () => {
    const res = await fetch("/api/autos");
    const data = await res.json();
    setAutos(data);
  };


  const handleActualizarKilometraje = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const id = parseInt(actualizaKilometrajeForm.vehiculoId);
    const km = parseInt(actualizaKilometrajeForm.kilometraje);
  
    if (!id || isNaN(km) || km < 0) {
      alert('Por favor selecciona un vehículo y asegurate que el kilometraje sea válido.');
      return;
    }
  
    try {
      const res = await fetch(`/api/autos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kilometraje: km }),
      });
  
      if (!res.ok) throw new Error('Error al actualizar el kilometraje');
  
      console.log('Kilometraje actualizado');
      // Cerrar modal, limpiar campos, refrescar datos
      setShowActualizarModal(false);
      setActualizaKilometraje({ vehiculoId: "", kilometraje: "" });
      fetchAutos(); // refresca lista de autos si querés
  
    } catch (error) {
      console.error(error);
      alert('Hubo un error al actualizar el kilometraje.');
    }
  };
  
  const handleAddAuto = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/autos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, kilometraje: parseInt(form.kilometraje) }),
    });
    setForm({ marca: "", modelo: "", patente: "", kilometraje: "" });
    setShowAddModal(false);
    fetchAutos();
  };
  const handleDeleteReparacion = async (id: number) => {
    await fetch(`/api/reparaciones/${id}`, { method: "DELETE" });
    fetchAutos();
  };
    
    const handleDeleteAuto = async (id: number) => {
        await fetch(`/api/autos/${id}`, { method: "DELETE" });
        fetchAutos();
    };
  const handleAddReparacion = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(reparacionForm);
    await fetch("/api/reparaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha: new Date(reparacionForm.fecha),
          kilometraje: parseInt(reparacionForm.kilometraje),
          vehiculoId: parseInt(reparacionForm.vehiculoId),
          reparacion: reparacionForm.reparacion, // 👈 esto es lo que Prisma necesita
        }),
      });
    setReparacionForm({ fecha: "", kilometraje: "", vehiculoId: "", reparacion: "" });
    setShowReparacionModal(false);
  };


  return (
    <div className={styles.container}>
      <h1>Registro de la Flota</h1>

      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}>
        <button className={`${styles.btn} ${styles.create}`} onClick={() => setShowAddModal(true)}>
          Agregar Vehículo
        </button>
        <button className={`${styles.btn} ${styles.create}`} onClick={() => setShowReparacionModal(true)}>
          Agregar Reparación
        </button>
        <button className={`${styles.btn} ${styles.create}`} onClick={() => setShowActualizarModal(true)}>
          Actualiza Kilometraje
        </button>
      </div>

      <h2>Vehículos Registrados</h2>
      <ul className={styles.customList}>
      {autos.map((auto) => (
  <li key={auto.id}  className={`${styles.customListItem} ${
    auto.kilometraje < 50000
      ? styles.kmBajo
      : auto.kilometraje <= 150000
      ? styles.kmMedio
      : styles.kmAlto
  }`}>
<div className={styles.vehiculoHeader}>
  <div className={styles.vehiculoHeaderTop}>
    <h3 className={styles.vehiculoTitulo}>
      {auto.marca} {auto.modelo}
    </h3>
    <button
      className={styles.deleteBtn}
      onClick={() => {
        setIdAEliminar(auto.id);
        setTipoAEliminar('vehiculo');
        setConfirmOpen(true);
      }}
    >
      ✕
    </button>
  </div>
  <div className={styles.vehiculoDatos}>
    <span><strong>Patente:</strong> {auto.patente}</span>
    <span><strong>Kilometraje:</strong> {auto.kilometraje} km</span>
  </div>
</div>


    {/* Reparaciones */}
    {auto.reparaciones && auto.reparaciones.length > 0 && (
      <div className={styles.customArreglos}>
        {auto.reparaciones.map((r) => (
          <div key={r.id} className={styles.customArreglo}>
            🛠️ {r.reparacion} · {new Date(r.fecha).toLocaleDateString()} · {r.kilometraje} km
            <button onClick={() => {
              setIdAEliminar(r.id);
              setTipoAEliminar('reparacion');
              setConfirmOpen(true);
            }}>✕</button>
          </div>
        ))}
      </div>
    )}


  </li>
))}

</ul>

      {/* Modal: Agregar Vehículo */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Agregar Vehículo">
        <form onSubmit={handleAddAuto} className={styles.formContainer}>
          {["marca", "modelo", "patente", "kilometraje"].map((field) => (
            <div key={field} className={styles.formInput}>
              <input
                type={field === "kilometraje" ? "number" : "text"}
                placeholder=" "
                value={form[field as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                required
              />
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            </div>
          ))}
          <button type="submit" className={`${styles.btn} ${styles.create}`}>Guardar</button>
        </form>
      </Modal>

{/* Modal: Actualizar Kilometraje */}
<Modal isOpen={showActualizarModal} onClose={() => setShowActualizarModal(false)} title="Actualizar Kilometraje">
        <form onSubmit={handleActualizarKilometraje} className={styles.formContainer}>


          <div className={styles.formInput}>
            <input
              type="number"
              placeholder=" "
              value={actualizaKilometrajeForm.kilometraje}
              onChange={(e) => setActualizaKilometraje({ ...actualizaKilometrajeForm, kilometraje: e.target.value })}
              required
            />
            <label>Kilometraje</label>
          </div>
 
          <div className={styles.formInput}>
            <select
              value={actualizaKilometrajeForm.vehiculoId}
              onChange={(e) => setActualizaKilometraje({ ...actualizaKilometrajeForm, vehiculoId: e.target.value })}
              required
            >
              <option value="">Seleccionar Vehículo</option>
              {autos.map((auto) => (
                <option key={auto.id} value={auto.id}>
                  {auto.marca} {auto.modelo} - {auto.patente}
                </option>
              ))}
            </select>
            <label>Vehículo</label>
          </div>

          <button type="submit" className={`${styles.btn} ${styles.update}`}>Guardar Reparación</button>
        </form>
      </Modal>

      {/* Modal: Agregar Reparación */}
      <Modal isOpen={showReparacionModal} onClose={() => setShowReparacionModal(false)} title="Agregar Reparación">
        <form onSubmit={handleAddReparacion} className={styles.formContainer}>
          <div className={styles.formInput}>
            <input
              type="date"
              value={reparacionForm.fecha}
              onChange={(e) => setReparacionForm({ ...reparacionForm, fecha: e.target.value })}
              required
            />
            <label>Fecha</label>
          </div>

          <div className={styles.formInput}>
            <input
              type="number"
              placeholder=" "
              value={reparacionForm.kilometraje}
              onChange={(e) => setReparacionForm({ ...reparacionForm, kilometraje: e.target.value })}
              required
            />
            <label>Kilometraje</label>
          </div>
          <div  className={styles.formInput}>
              <input
                type={"text"}
                placeholder=" "
                value={reparacionForm.reparacion}
                onChange={(e) => setReparacionForm({ ...reparacionForm, reparacion: e.target.value })}
                required
              />
              <label>Reparación</label>
            </div>
          <div className={styles.formInput}>
            <select
              value={reparacionForm.vehiculoId}
              onChange={(e) => setReparacionForm({ ...reparacionForm, vehiculoId: e.target.value })}
              required
            >
              <option value="">Seleccionar Vehículo</option>
              {autos.map((auto) => (
                <option key={auto.id} value={auto.id}>
                  {auto.marca} {auto.modelo} - {auto.patente}
                </option>
              ))}
            </select>
            <label>Vehículo</label>
          </div>

          <button type="submit" className={`${styles.btn} ${styles.update}`}>Guardar Reparación</button>
        </form>
      </Modal>

      <ConfirmDialog
  isOpen={confirmOpen}
  message={
    tipoAEliminar === 'vehiculo'
      ? '¿Estás seguro de que querés eliminar este vehículo?'
      : '¿Estás seguro de que querés eliminar esta reparación?'
  }
  onCancel={() => {
    setConfirmOpen(false);
    setIdAEliminar(null);
    setTipoAEliminar(null);
  }}
  onConfirm={() => {
    if (idAEliminar !== null && tipoAEliminar !== null) {
      if (tipoAEliminar === 'vehiculo') {
        handleDeleteAuto(idAEliminar);
      } else {
        handleDeleteReparacion(idAEliminar);
      }
    }
    setConfirmOpen(false);
    setIdAEliminar(null);
    setTipoAEliminar(null);
  }}
/>
    </div>
  );
}
