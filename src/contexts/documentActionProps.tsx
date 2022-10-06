import {DocumentActionProps} from 'sanity'
import React, {createContext, ReactNode, useContext} from 'react'

type State = DocumentActionProps

const DocumentActionPropsContext = createContext<State | undefined>(undefined)

function DocumentActionPropsProvider({
  children,
  value,
}: {
  children: ReactNode
  value: DocumentActionProps
}) {
  return (
    <DocumentActionPropsContext.Provider value={value}>
      {children}
    </DocumentActionPropsContext.Provider>
  )
}

function useDocumentActionProps() {
  const context = useContext(DocumentActionPropsContext)
  if (context === undefined) {
    throw new Error('useDocumentActionProps must be used within a DocumentActionPropsProvider')
  }
  return context
}

export {DocumentActionPropsProvider, useDocumentActionProps}
