// Gives pages the same search callbacks the layout has, without passing them as props.
import { createContext, useContext } from 'react'
import type { SuggestFn } from '../../../core/types'

export interface SearchApi { onSearch: (q: string) => void; onSuggest: SuggestFn }

export const SearchContext = createContext<SearchApi>({ onSearch: () => {}, onSuggest: async () => ({ articles: [], authors: [], keywords: [] }) })
export const useSearchApi = () => useContext(SearchContext)
