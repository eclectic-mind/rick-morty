import { I as InlineProps, d as useInline, i as includesPresets } from './index-MUHduU45.mjs';
import { h as hProps, c as hSlots, b as addProp } from './server.mjs';
import { defineComponent, h, computed } from 'vue';

const VisuallyHiddenContentProps = {
  label: {
    type: String
  }
};
function useVisuallyHiddenContent(props) {
  return {
    render: () => {
      if (props.label) {
        return h("span", { class: { "visually-hidden": true } }, props.label);
      } else {
        return undefined;
      }
    }
  };
}
const BadgeProps = {
  ...VisuallyHiddenContentProps,
  rounded: {
    type: String
    // pill , circle
  },
  color: {
    type: String
    //
  }
};
function useBadge(props) {
  const visuallyHidden = useVisuallyHiddenContent(props);
  const textBgIncludePreset = computed(() => includesPresets("text-bg-color", props.color));
  return {
    class: computed(() => {
      return {
        badge: true,
        [`rounded-${props.rounded}`]: props.rounded,
        [`text-bg-${props.color}`]: props.color && textBgIncludePreset.value
      };
    }),
    style: computed(() => {
      return {
        ...addProp(props.color && !textBgIncludePreset.value, "background-color", `var(--bs-${props.color})`),
        ...addProp(props.color && !textBgIncludePreset.value, "--bs-badge-color", `var(--bs-contrast-${props.color})`)
      };
    }),
    render: visuallyHidden.render
  };
}
const __nuxt_component_8 = defineComponent({
  name: "Badge",
  props: {
    ...InlineProps,
    ...BadgeProps,
    tag: {
      type: String,
      default: "span"
    },
    color: {
      type: String,
      default: "primary"
    }
  },
  setup(props, context) {
    const inline = useInline(props);
    const badge = useBadge(props);
    return () => h(
      props.tag,
      hProps(badge, inline),
      hSlots(context.slots.default, badge.render)
    );
  }
});

export { __nuxt_component_8 as _ };
//# sourceMappingURL=Badge-CIN0rxEu.mjs.map
