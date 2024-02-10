import { ChangeEvent, useState } from 'react';
import logo from './assets/Logo(1).svg';
import { NewNoteCard } from './componets/new-note-card';
import { Notecard } from './componets/note-card';

interface Note {
  id: string,
  date: Date,
  content: string
}

export function App() {
  // Estados para as Notas
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem('notes');
    return notesOnStorage ? JSON.parse(notesOnStorage) : [];
  });

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  }

  function onNoteDelete(id: string) {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    setSearch(query);
  }

  const filteredNotes = search !== ''
    ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    : notes;

  return (
    <div className="mx-auto max-w-6xl space-y-6 my-12 px-5">
      <img src={logo} alt="Logo" />

      <form className="w-full">
        <input
          type="text"
          placeholder='Busque por suas notas...'
          className="w-full bg-transparent text-3xl font-semibold tracking-tight placeholder:text-slate-500 outline-none"
          onChange={handleSearch}
        />
      </form>

      <div className="h-px bg-slate-700"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map(note => (
          <Notecard key={note.id} note={note} onNoteDelete={onNoteDelete} />
        ))}
      </div>
    </div>
  );
}
