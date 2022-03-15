import React from 'react'
import {FormBuilderInput} from '@sanity/form-builder/lib/FormBuilderInput'

export class NestedFormBuilder extends FormBuilderInput {
  // eslint-disable-next-line class-methods-use-this
  componentDidMount() {
    // do nothing - prevent focus-bug when nesting FormBuilderInput
  }

  // eslint-disable-next-line camelcase,class-methods-use-this
  UNSAFE_componentWillReceiveProps() {
    // do nothing - prevent focus-bug when nesting FormBuilderInput
  }

  // eslint-disable-next-line class-methods-use-this
  componentDidUpdate() {
    // do nothing - prevent focus-bug when nesting FormBuilderInput
  }

  // eslint-disable-next-line no-undef
  render(): JSX.Element {
    const {type} = this.props
    const InputComponent = this.resolveInputComponent(type)
    return <InputComponent {...this.props} ref={this.setInput} />
  }
}
