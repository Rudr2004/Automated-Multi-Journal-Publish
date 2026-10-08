// Gives pages (e.g. the home hero) the same search callbacks the header uses, without each page needing them as props.
import { createContext, useContext } from 'react'
import type { SuggestFn } from '../../../core/types'

export interface SearchApi { onSearch: (q: string) => void; onSuggest: SuggestFn }

export const SearchContext = createContext<SearchApi>({ onSearch: () => {}, onSuggest: async () => ({ articles: [], authors: [], keywords: [] }) })
export const useSearchApi = () => useContext(SearchContext)
