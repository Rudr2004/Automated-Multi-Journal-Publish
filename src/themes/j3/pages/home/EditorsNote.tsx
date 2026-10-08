// Editors' note: a short letter from the Editor-in-Chief about the issue.
import { AppLink } from '../../../../core/router'
import type { EditorProfile } from '../../../../core/types'
import { Container, Kicker } from '../../components/primitives'

type Note = { tag: string; title: string; text: string; to: string }

export function EditorsNote({ note, editor }: { note: Note; editor?: EditorProfile }) {
  return (
    <section aria-labelledby="note-title" className="pb-16 sm:pb-24">
      <Container>
        <div className="grid gap-8 rounded-sheet bg-iris-50 p-8 sm:p-14 lg:grid-cols-[1fr_2fr] lg:items-center">
          <div className="flex items-center gap-4 lg:flex-col lg:items-start">
            {editor?.photo && <img src={editor.photo} alt="" width={112} height={112} className="h-24 w-24 rounded-full object-cover ring-4 ring-white lg:h-28 lg:w-28" />}
            {editor && <p className="font-jakarta text-base font-bold text-night-900">{editor.name}<span className="block text-sm font-medium text-mauve-700">{editor.role}, {editor.institution}</span></p>}
          </div>
          <div>
            <Kicker className="text-iris-700">{note.tag}</Kicker>
            <h2 id="note-title" className="mt-3 font-jakarta text-[1.75rem] font-extrabold leading-tight tracking-tight text-night-900 sm:text-[1.875rem]">{note.title}</h2>
            <p className="mt-4 text-lg text-mauve-800">{note.text}</p>
            <AppLink to={note.to} className="mt-5 inline-block font-jakarta text-sm font-bold text-iris-700 hover:underline">Read this issue →</AppLink>
          </div>
        </div>
      </Container>
    </section>
  )
}
