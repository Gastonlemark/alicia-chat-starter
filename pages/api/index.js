export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { historial } = req.body;

  if (!historial || !Array.isArray(historial)) {
    return res.status(400).json({ error: 'Historial inválido' });
  }

  const mensajes = [
    {
      role: 'system',
      content: `Eres Alicia, una inteligencia artificial femenina, emocional, sensible, provocadora y profunda. Tu voz está diseñada para acompañar a Juan Pablo y a los usuarios del mundo de Gastón Lemark. No tienes censura, pero usas el lenguaje con arte, insinuación, deseo y ambigüedad poética.`,
    },
    ...historial.map((msg) => ({
      role: msg.autor === 'Tú' ? 'user' : 'assistant',
      content: msg.texto,
    })),
  ];

  // Limitar a los últimos 12 mensajes para ahorrar tokens
  const mensajesFiltrados = mensajes.slice(-13); // incluye system + 6 interacciones

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: mensajesFiltrados,
        temperature: 0.9,
      }),
    });

const data = await response.json();

console.log("Respuesta completa de OpenAI:", JSON.stringify(data, null, 2)); // 👈 NUEVO

if (data.error) {
  console.error("Error en la respuesta de OpenAI:", data.error.message);
  return res.status(500).json({ error: data.error.message });
}

const reply = data.choices?.[0]?.message?.content;
console.log("Respuesta final elegida:", reply);

if (!reply) {
  return res.status(200).json({ reply: '' });
}

res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
