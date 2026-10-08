// Gives pages the same search callbacks and the command palette opener the masthead uses, without passing them as props.
import { createContext, useContext } from 'react'
import type { SuggestFn } from '../../../core/types'

export interface SearchApi { onSearch: (q: string) => void; onSuggest: SuggestFn; openPalette: () => void }

export const SearchContext = createContext<SearchApi>({ onSearch: () => {}, onSuggest: async () => ({ articles: [], authors: [], keywords: [] }), openPalette: () => {} })
export const useSearchApi = () => useContext(SearchContext)
