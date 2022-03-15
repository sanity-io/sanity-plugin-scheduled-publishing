import {ElementQuery} from '@sanity/ui'
import styled from 'styled-components'

const DateWithTooltipElementQuery = styled(ElementQuery)`
  .date-small {
    display: block;
  }
  .date-medium {
    display: none;
  }
  .date-large {
    display: none;
  }

  &[data-eq-min~='1'] {
    .date-small {
      display: none;
    }
    .date-medium {
      display: block;
    }
    .date-large {
      display: none;
    }
  }

  &[data-eq-min~='2'] {
    .date-small {
      display: none;
    }
    .date-medium {
      display: none;
    }
    .date-large {
      display: block;
    }
  }
`

export default DateWithTooltipElementQuery
