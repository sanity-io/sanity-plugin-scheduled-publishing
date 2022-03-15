import {ComponentProps} from 'react'
import {FormBuilderInput} from '@sanity/form-builder/lib/FormBuilderInput'

type FormInputProps = ComponentProps<typeof FormBuilderInput>

export interface SanityProps<T> extends FormInputProps {
  value: T | undefined
}
