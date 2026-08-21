/** Dedicated static prototype mode used by the customer-demo build. */
export const isPrototypeDemo = () =>
  import.meta.env.REACT_APP_PROTOTYPE_DEMO === 'true';
