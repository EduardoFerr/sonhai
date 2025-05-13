import { useEffect, useRef, useState } from 'react';

/**
 * Hook para capturar voz e retornar o texto reconhecido.
 * @param onTexto Callback chamado sempre que um texto for reconhecido pela fala.
 */
export function useVoz(onTexto: (texto: string) => void) {
  const [gravando, setGravando] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Reconhecimento de voz não suportado neste navegador.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onresult = (event: SpeechRecognitionResult) => {
      const texto = Array.from(event)
        .map((result) => event[0].transcript)
        .join(' ')
        .trim();

      if (texto) {
        onTexto(texto);
      }
    };

    recognition.onerror = (event: SpeechRecognitionResult) => {
      console.error('Erro no reconhecimento de voz:', event);
    };

    recognition.onend = () => {
      if (gravando) {
        recognition.start(); // reinicia se estava gravando
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [onTexto, gravando]);

  const iniciar = () => {
    if (recognitionRef.current && !gravando) {
      recognitionRef.current.start();
      setGravando(true);
    }
  };

  const parar = () => {
    if (recognitionRef.current && gravando) {
      recognitionRef.current.stop();
      setGravando(false);
    }
  };

  return {
    iniciar,
    parar,
    gravando,
  };
}
