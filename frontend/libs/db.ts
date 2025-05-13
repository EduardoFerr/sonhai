import { openDB } from 'idb';

export interface SonhoSalvo {
  id?: number;
  data: string;
  texto: string;
  interpretacao: string | null;
  favorito: boolean;
}

export const initDB = async () => {
  return openDB('sonhos-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('sonhos')) {
        db.createObjectStore('sonhos', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

export const salvarSonho = async (sonho: SonhoSalvo) => {
  const db = await initDB();
  await db.put('sonhos', sonho);
};

export const listarSonhos = async (): Promise<SonhoSalvo[]> => {
  const db = await initDB();
  return db.getAll('sonhos');
};

export const atualizarFavorito = async (id: number, favorito: boolean) => {
  const db = await initDB();
  const sonho = await db.get('sonhos', id);
  if (sonho) {
    sonho.favorito = favorito;
    await db.put('sonhos', sonho);
  }
};

export const deletarSonho = async (id: number) => {
  const db = await initDB();
  await db.delete('sonhos', id);
};
