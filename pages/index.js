import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [mensaje, setMensaje] = useState('');
  const [historial, setHistorial] = useState([]);
  const chatRef = useRef(null);

  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!mensaje.trim()) return;

    const nuevoHistorial = [...historial, { autor: 'Tú', texto: mensaje }];
    setHistorial(nuevoHistorial);
    setMensaje('');

    const res = await fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ historial: nuevoHistorial }),
    });

    const data = await res.json();
    setHistorial([...nuevoHistorial, { autor: 'Alicia', texto: data.reply }]);
  };

  // Scroll automático hacia abajo
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [historial]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'sans-serif',
      padding: '2rem',
      maxWidth: '800px',
      margin: 'auto'
    }}>
      <h1>Hola, soy Alicia</h1>

      <img
        src="/alicia.jpg"
        alt="Alicia"
        style={{
          width: '250px',
          height: 'auto',
          borderRadius: '1rem',
          objectFit: 'cover',
          marginBottom: '1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}
      />

      <div ref={chatRef} style={{
        width: '100%',
        maxHeight: '400px',
        overflowY: 'auto',
        backgroundColor: '#f9f9f9',
        border: '1px solid #ccc',
        borderRadius: '0.5rem',
        padding: '1rem',
        marginBottom: '1rem'
      }}>
        {historial.map((msg, index) => (
          <div key={index} style={{ marginBottom: '1rem' }}>
            <strong>{msg.autor}:</strong>
            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.texto}</p>
          </div>
        ))}
      </div>

      <form onSubmit={enviarMensaje} style={{ width: '100%' }}>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escríbeme..."
          rows={3}
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '0.5rem',
            marginBottom: '0.5rem',
            resize: 'vertical'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
