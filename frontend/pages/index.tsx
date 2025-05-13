import { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import ConfirmModal from '@components/ConfirmModal';
import {
  salvarSonho,
  listarSonhos,
  atualizarFavorito,
  deletarSonho,
  SonhoSalvo,
} from '@libs/db';

export default function Home() {
  const hojeISO = new Date().toISOString().split('T')[0];
  const [dataSelecionada, setDataSelecionada] = useState(hojeISO);
  const [texto, setTexto] = useState('');
  const [resposta, setResposta] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [historico, setHistorico] = useState<SonhoSalvo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null);

  // Voz
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    (async () => setHistorico(await listarSonhos()))();
  }, []);

  useEffect(() => {
    if (listening) setTexto(transcript);
  }, [transcript, listening]);

  const mudarDia = (delta: number) => {
    const d = new Date(`${dataSelecionada}T00:00`);
    d.setDate(d.getDate() + delta);
    setDataSelecionada(d.toISOString().split('T')[0]);
  };

  const toggleMic = () => {
    listening ? SpeechRecognition.stopListening() : (resetTranscript(), SpeechRecognition.startListening({ continuous: true, language: 'pt-BR' }));
  };

  async function enviarSonho() {
    setCarregando(true);
    let interpretacao: string | null = null;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interpretar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      interpretacao = data.interpretacao ?? null;
      setResposta(interpretacao ?? 'Sem interpretação.');
    } catch {
      setResposta('Erro ao interpretar o sonho.');
    } finally {
      await salvarSonho({ data: dataSelecionada, texto, interpretacao, favorito: false });
      setHistorico(await listarSonhos());
      setCarregando(false);
      resetTranscript();
    }
  }

  async function alternarFavorito(id?: number) {
    if (!id) return;
    await atualizarFavorito(id, !(historico.find((s) => s.id === id)?.favorito));
    setHistorico(await listarSonhos());
  }

  // Exclusão com modal
  function pedirExclusao(id?: number) {
    if (!id) return;
    setIdParaExcluir(id);
    setShowModal(true);
  }

  async function confirmarExclusao() {
    if (!idParaExcluir) return;
    await deletarSonho(idParaExcluir);
    setHistorico(await listarSonhos());
    if (idParaExcluir === sonhoAtual?.id) {
      setTexto('');
      setResposta('');
    }
    setShowModal(false);
    setIdParaExcluir(null);
  }

  const sonhoAtual = historico.find((s) => s.data === dataSelecionada);
  if (!browserSupportsSpeechRecognition) return <p>Navegador não suporta reconhecimento de voz.</p>;

  return (
    <main className="p-8 max-w-xl mx-auto">
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">SonhAI – Diário de Sonhos</h1>

        {/* Navegação */}
        <div className="flex justify-center items-center gap-2">
          <button onClick={() => mudarDia(-1)} className="px-2 py-1 bg-gray-200 rounded">◀</button>
          <input type="date" value={dataSelecionada} onChange={(e) => setDataSelecionada(e.target.value)} className="border rounded px-2 py-1" />
          <button onClick={() => mudarDia(1)} className="px-2 py-1 bg-gray-200 rounded">▶</button>
        </div>

        <textarea className="w-full h-40 p-2 border rounded" placeholder="Descreva seu sonho..." value={texto} onChange={(e) => setTexto(e.target.value)} />

        <div className="flex justify-center gap-3">
          <button onClick={toggleMic} className={`w-1/2 px-4 rounded text-white ${listening ? 'bg-red-600 animate-pulse' : 'bg-gray-600'}`}>{listening ? 'Gravando…🎤' : 'Falar'}</button>
          <button onClick={enviarSonho} disabled={carregando || !texto.trim()} className="w-1/2 bg-blue-600 text-white px-4 rounded">{carregando ? 'Interpretando…📝' : 'Interpretar sonho'}</button>
        </div>

        {sonhoAtual && (
          <div className="border-t pt-4 space-y-2">
            <h3 className="font-semibold">Registrado em <time>{sonhoAtual.data}</time></h3>
            <p className="bg-gray-100 rounded italic text-sm">{sonhoAtual.texto}</p>
            <h2 className="font-semibold mb-2">Interpretação:</h2>
            <p>{sonhoAtual.interpretacao ?? 'Sem interpretação.'}</p>
            <div className="flex justify-center gap-2">
              <button onClick={() => alternarFavorito(sonhoAtual.id)} className="text-blue-600 underline text-sm">Favorito {sonhoAtual.favorito ? '⭐' : '★'}</button>
              <button onClick={() => pedirExclusao(sonhoAtual.id)} className="text-red-600 underline text-sm">Excluir 🗑️</button>
            </div>
          </div>
        )}

        {/* {resposta && <div className="p-4 bg-gray-100 rounded"><h2 className="font-semibold mb-2">Interpretação:</h2><p>{resposta}</p></div>} */}
      </section>
      <ConfirmModal open={showModal} texto="Deseja realmente excluir este sonho?" onClose={() => setShowModal(false)} onConfirm={confirmarExclusao} />
    </main>
  );
}