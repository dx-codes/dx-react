import { REACT_FORWARD_REF } from "../createElement"

export const createRef = () => {
  return {
    current: null
  }
}

export const forwardRef = (render) => {
  return {
    $$type: REACT_FORWARD_REF,
    render,
  }
}
