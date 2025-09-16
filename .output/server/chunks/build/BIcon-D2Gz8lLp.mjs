import { b as addProp, h as hProps } from './server.mjs';
import { B as BlockProps, u as useBlock } from './index-MUHduU45.mjs';
import { defineComponent, ref, h } from 'vue';
import Icon from './index-Du58e3vH.mjs';

const __nuxt_component_1 = defineComponent({
  name: "BIcon",
  props: {
    ...BlockProps,
    icon: {
      type: String,
      default: undefined
    },
    color: {
      type: String,
      default: undefined
    }
  },
  setup(props) {
    const elementRef = ref();
    const block = useBlock(props);
    const current = {
      attr: {
        name: props.icon
      },
      style: {
        "vertical-align": "-.125em",
        // https://icons.getbootstrap.com/
        ...addProp(props.color, "color", `var(--bs-${props.color})`)
      },
      ref: elementRef
    };
    if (props.icon === undefined) {
      return;
    }
    return () => h(
      Icon,
      hProps(current, block),
      undefined
    );
  }
});

export { __nuxt_component_1 as _ };
//# sourceMappingURL=BIcon-D2Gz8lLp.mjs.map
