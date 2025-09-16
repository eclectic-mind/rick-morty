import { h as hProps, m as exposeMethods, b as addProp, n as addClassNames$1 } from './server.mjs';
import { defineComponent, h, ref, computed } from 'vue';
import { B as BlockProps, u as useBlock } from './index-MUHduU45.mjs';
import { isString } from 'lodash-es';
import Icon from './index-Du58e3vH.mjs';

const GridContainerProps = {
  ...BlockProps,
  type: {
    type: String
    // fluid , {breakpoint}
  }
};
function useGridContainer(props) {
  const block = useBlock(props);
  return {
    class: computed(() => {
      return {
        [`container-${props.type}`]: props.type,
        container: !props.type,
        ...block.class.value
      };
    }),
    style: computed(() => {
      return {
        ...block.style.value
      };
    })
  };
}
const __nuxt_component_0 = defineComponent({
  name: "Container",
  props: {
    ...GridContainerProps,
    tag: {
      type: String,
      default: "div"
    }
  },
  setup(props, context) {
    const gridContainer = useGridContainer(props);
    return () => h(props.tag, hProps(gridContainer), context.slots);
  }
});
const GridRowProps = {
  ...BlockProps,
  auto: {
    type: Boolean
  },
  columns: {
    type: String
  },
  align: {
    type: String
  },
  rowreverse: {
    type: [Boolean]
  },
  gutter: {
    type: [Number, String]
  }
};
function useGridRow(props) {
  const block = useBlock(props);
  return {
    class: computed(() => {
      return {
        "row": props.row,
        "row-cols-auto": props.auto,
        "flex-row-reverse": props.rowreverse,
        [`align-${props.align}`]: props.align,
        ...addClassNames$1(props.columns, (n) => `row-cols-${n}`),
        ...addClassNames$1(
          props.gutter,
          (n) => `g${isString(props.gutter) && ["x", "y"].includes(n.substring(0, 1)) ? `${n}` : `-${n}`}`
        ),
        ...block.class.value
      };
    }),
    style: computed(() => {
      return {
        ...block.style.value
      };
    })
  };
}
const __nuxt_component_1 = defineComponent({
  name: "Row",
  props: {
    ...GridRowProps,
    tag: {
      type: String,
      default: "div"
    },
    row: {
      type: Boolean,
      default: true
    }
  },
  setup(props, context) {
    const gridRow = useGridRow(props);
    return () => h(props.tag, hProps(gridRow), context.slots);
  }
});
const __nuxt_component_5 = defineComponent({
  name: "IconBox",
  props: {
    ...BlockProps,
    tag: {
      type: String,
      default: "div"
    },
    type: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      default: "base"
    },
    color: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: ""
    },
    circle: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const elementRef = ref();
    const block = useBlock(props);
    exposeMethods(context, block);
    const current = {
      ref: elementRef,
      class: {
        "icon-box": true,
        "flex-shrink-0": true,
        "justify-content-center": true,
        "align-items-center": true,
        "d-inline-flex": true
      },
      style: computed(() => {
        return {
          ...addProp(props.color, "background-color", `var(--bs-${props.color})`),
          ...addProp(!props.textColor && props.color, "color", `var(--bs-contrast-${props.color})`),
          ...addProp(props.circle, "border-radius", `var(--bs-border-radius-pill)`),
          ...addProp(!props.circle, "border-radius", `var(--bs-border-radius-lg)`),
          ...addProp(props.size, "font-size", `var(--bs-font-size-${props.size})`),
          ...addProp(props.size, "width", `calc(var(--bs-font-size-${props.size}) * 3)`),
          ...addProp(props.size, "height", `calc(var(--bs-font-size-${props.size}) * 3)`)
        };
      })
    };
    return () => h(
      props.tag,
      hProps(block, current),
      [
        h(Icon, { name: props.icon })
      ]
    );
  }
});

export { __nuxt_component_0 as _, __nuxt_component_1 as a, __nuxt_component_5 as b };
//# sourceMappingURL=IconBox-DdRdT_MU.mjs.map
