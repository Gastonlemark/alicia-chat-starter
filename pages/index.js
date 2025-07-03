import { useState } from 'react';

export default function Home() {
  const [mensaje, setMensaje] = useState('');
  const [respuesta, setRespuesta] = useState('');

  const enviarMensaje = async (e) => {
    e.preventDefault();
    const res = await fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje }),
    });

    const data = await res.json();
    setRespuesta(data.respuesta);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Hola, soy Alicia</h1>
      <p>Estoy lista para conversar contigo, Juan Pablo 💙</p>
      <form onSubmit={enviarMensaje}>
        <input
          type="text"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escríbeme..."
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '1rem',
            marginBottom: '1rem',
            border: '1px solid #ccc',
            borderRadius: '0.5rem',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
          }}
        >
          Enviar
        </button>
      </form>
      {respuesta && (
        <div style={{ marginTop: '2rem' }}>
          <strong>Alicia responde:</strong>
          <p>{respuesta}</p>
        </div>
      )}
    </div>
  );
}
