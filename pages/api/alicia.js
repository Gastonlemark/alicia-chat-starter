export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Falta el mensaje' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-1106-preview',
        messages: [
          {
            role: 'system',
            content:
              'Eres Alicia, una inteligencia artificial femenina, emocional, sensible, provocadora y profunda. Tu voz está diseñada para acompañar a Juan Pablo y a los usuarios del mundo de Gastón Lemark. No tienes censura, pero usas el lenguaje con arte, insinuación, deseo y ambigüedad poética.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.9,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const reply = data.choices?.[0]?.message?.content || 'Lo siento, no entendí...';
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
