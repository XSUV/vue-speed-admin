import Vue, { VNode } from 'vue';

declare module '*.tsx' {
  import Vue from 'compatible-vue';

  export default Vue;
}

declare global {
  namespace JSX {
    type Element = VNode;
    type ElementClass = Vue;
    interface ElementAttributesProperty {
      $props: any;
    }
    interface IntrinsicElements {
      [elem: string]: any;
    }
    interface IntrinsicAttributes {
      [elem: string]: any;
    }
  }
}
