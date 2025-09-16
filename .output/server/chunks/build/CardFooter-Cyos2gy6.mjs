import { h as hProps, b as addProp, m as exposeMethods, c as hSlots, i as isPropUndefined, t as toArray, f as useElementHover$1, g as useElementVisibility$1, k as unrefElement$1, l as useIntersectionObserver$1, j as useModuleOptions, a as useRoute, e as useEventBus, d as defaultDocument } from './server.mjs';
import { B as BlockProps, u as useBlock, i as includesPresets, I as InlineProps, d as useInline } from './index-MUHduU45.mjs';
import { defineComponent, h, computed, ref, provide, useId, inject, watch, nextTick } from 'vue';
import { n as defu } from '../nitro/nitro.mjs';
import { useFloating, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/vue';
import { forOwn } from 'lodash-es';
import { d as defineNuxtLink } from './nuxt-link-D55NkqpS.mjs';
import { _ as __nuxt_component_1 } from './BIcon-D2Gz8lLp.mjs';

const __nuxt_component_2 = defineComponent({
  name: "Col",
  props: {
    ...BlockProps,
    tag: {
      type: String,
      default: "div"
    },
    col: {
      type: [Boolean, String, Number],
      default: true
    }
  },
  setup(props, context) {
    const block = useBlock(props);
    return () => h(props.tag, hProps(block), context.slots);
  }
});
const __nuxt_component_3 = defineComponent({
  name: "Card",
  props: {
    ...BlockProps,
    tag: {
      type: String,
      default: "div"
    },
    color: {
      type: String,
      default: undefined
    }
  },
  setup(props, context) {
    const block = useBlock(props);
    const textBgIncludePreset = computed(() => includesPresets("text-bg-color", props.color));
    const current = {
      class: {
        card: true,
        [`text-bg-${props.color}`]: props.color && textBgIncludePreset.value
      },
      style: computed(() => {
        return {
          ...addProp(props.color && !textBgIncludePreset.value, "--bs-card-bg", `var(--bs-${props.color})`),
          ...addProp(props.color && !textBgIncludePreset.value, "--bs-card-cap-bg", `var(--bs-${props.color})`),
          ...addProp(props.color && !textBgIncludePreset.value, "--bs-card-border-color", `var(--bs-active-${props.color})`),
          ...addProp(!props.textColor && props.color && !textBgIncludePreset.value, "--bs-card-color", `var(--bs-contrast-${props.color})`),
          ...addProp(!props.textColor && props.color && !textBgIncludePreset.value, "--bs-card-title-color", `var(--bs-contrast-${props.color})`),
          ...addProp(!props.textColor && props.color && !textBgIncludePreset.value, "--bs-card-subtitle-color", `var(--bs-contrast-${props.color})`),
          ...addProp(!props.textColor && props.color && !textBgIncludePreset.value, "--bs-card-cap-color", `var(--bs-contrast-${props.color})`)
        };
      })
    };
    return () => h(props.tag, hProps(current, block), context.slots);
  }
});
const __nuxt_component_4 = defineComponent({
  name: "CardHeader",
  props: {
    ...BlockProps,
    tag: {
      type: String,
      default: "div"
    }
  },
  setup(props, context) {
    const block = useBlock(props);
    const current = {
      class: {
        "card-header": true
      }
    };
    return () => h(props.tag, hProps(current, block), context.slots);
  }
});
const __nuxt_component_6 = defineComponent({
  name: "CardBody",
  props: {
    ...BlockProps,
    tag: {
      type: String,
      default: "div"
    }
  },
  setup(props, context) {
    const block = useBlock(props);
    const current = {
      class: {
        "card-body": true
      }
    };
    return () => h(props.tag, hProps(current, block), context.slots);
  }
});
const HeadingsProps = {
  level: {
    type: [Number, String],
    default: 1
  },
  displayHeadings: {
    type: [Number, String]
    // 1～6
  }
};
function useHeadings(props) {
  const opt = {
    level: 3,
    ...props
  };
  return {
    class: computed(() => {
      return {
        [`display-${opt.displayHeadings}`]: opt.displayHeadings
      };
    }),
    tag: props.tag ? props.tag : `h${opt.level}`
  };
}
const __nuxt_component_7 = defineComponent({
  name: "CardTitle",
  props: {
    ...InlineProps,
    ...HeadingsProps,
    level: {
      type: [Number, String],
      default: 5
    }
  },
  setup(props, context) {
    const inline = useInline(props);
    const headings = useHeadings(props);
    const current = {
      class: {
        "card-title": true
      }
    };
    return () => h(headings.tag, hProps(current, headings, inline), context.slots);
  }
});
const __nuxt_component_8 = defineComponent({
  name: "CardText",
  props: {
    ...BlockProps,
    tag: {
      type: String,
      default: "p"
    }
  },
  setup(props, context) {
    const block = useBlock(props);
    const current = {
      class: {
        "card-text": true
      }
    };
    return () => h(props.tag, hProps(current, block), context.slots);
  }
});
const IDProps = {
  id: {
    type: String,
    default: undefined
  }
};
function useID(props, name = "component") {
  const id = props.id || uniqueId();
  provide(`id.${name}`, id);
  return {
    attr: computed(() => {
      return {
        id
      };
    })
  };
}
function useIDRef(props, elementRef) {
  const id = ref(props.id);
  return id;
}
function uniqueId() {
  return useId().replace("$", "");
}
function findOneSelectorRef(selector, options = {}) {
  const elementRef = ref();
  return elementRef;
}
function querySelectorToID(selector, options = {}) {
  const { element = defaultDocument } = options;
  if (!selector || selector == "#") {
    return [];
  }
  const list = element == null ? undefined : element.querySelectorAll(selector);
  if (list) {
    return Array.from(list).map((value) => {
      return value.id;
    });
  } else {
    return [];
  }
}
function toFn(fnArray) {
  return () => {
    fnArray.forEach((value) => value);
  };
}
function useEventHandler(selector, prefix = "") {
  function selectEventBus() {
    const list = querySelectorToID(selector);
    const eventBuses = list.map((value) => {
      return useEventBus(`${prefix}${value}`);
    });
    return eventBuses;
  }
  const on = (lisner) => {
    const eventBus = selectEventBus();
    const offs = eventBus.map((value) => {
      return value.on(lisner);
    });
    return toFn(offs);
  };
  const once = (lisner) => {
    const eventBus = selectEventBus();
    const offs = eventBus.map((value) => {
      return value.once(lisner);
    });
    return toFn(offs);
  };
  const emit = (event) => {
    const eventBus = selectEventBus();
    eventBus.forEach((value) => {
      value.emit(event);
    });
  };
  const off = (lisner) => {
    const eventBus = selectEventBus();
    eventBus.forEach((value) => {
      value.off(lisner);
    });
  };
  const reset = () => {
    const eventBus = selectEventBus();
    eventBus.forEach((value) => {
      value.reset();
    });
  };
  return { on, once, emit, off, reset };
}
const EventEmitProps = {
  target: {
    type: String
  },
  href: {
    type: String
  }
};
function useEventEmitter(props, event, eventSuffix, elementRef) {
  const injectEvent = inject(`${event}.${eventSuffix}`, undefined);
  const eid = useIDRef(props);
  return (payload) => {
    if (props.target || props.href) {
      const { emit } = useEventHandler(
        props.target || props.href || "",
        "expose_"
      );
      emit(event, payload);
    } else {
      if (injectEvent) {
        injectEvent(payload);
      }
      if (eid.value) {
        const { emit } = useEventHandler(`#${eid.value}`, "expose_");
        emit(event, payload);
      }
    }
  };
}
const ToggleProps = {
  toggle: {
    type: String
  },
  active: {
    type: Boolean
  },
  split: {
    type: Boolean
  },
  ...EventEmitProps
};
function useToggle(props, elementRef) {
  if (isPropUndefined(props.toggle)) {
    return {};
  }
  const toggles = toArray(props.toggle);
  useIDRef(props);
  const emitters = toggles.map((toggle2) => {
    return useEventEmitter(props, "toggle", toggle2 || "");
  });
  const toggleEmitter = () => emitters.forEach((emitter) => {
    return emitter();
  });
  toggles.forEach((toggle2) => {
    inject(
      `buttonID.${toggle2}`,
      undefined
    );
  });
  const toggle = async () => {
    await toggleEmitter();
  };
  return {
    class: computed(() => {
      return {
        "dropdown-toggle": toggles.includes("dropdown"),
        "dropdown-toggle-split": props.split
      };
    }),
    method: {
      toggle
    },
    event: {
      onClick: toggle
    }
  };
}
const TooltipProps = {
  title: {
    type: [String],
    default: ""
  },
  placement: {
    type: String,
    default: "top"
  },
  template: {
    type: String
  }
};
function useTooltip(props, elementRef) {
  if (!props.toggle || props.toggle != "tooltip") {
    return {};
  }
  const isHovered = useElementHover$1(elementRef);
  const isShow = ref(false);
  const tooltipRef = ref();
  const tooltipArrowRef = ref();
  const tooltiPlacement = ref(props.placement);
  const { floatingStyles, placement, middlewareData } = useFloating(elementRef, tooltipRef, {
    placement: tooltiPlacement,
    whileElementsMounted: autoUpdate,
    middleware: [
      // autoPlacement(),
      flip(),
      shift(),
      offset(5),
      arrow({ element: tooltipArrowRef })
    ]
  });
  watch(isHovered, () => {
    isShow.value = isHovered.value;
  });
  return {
    attr: computed(() => {
      return {};
    }),
    render: () => {
      var _a, _b, _c, _d;
      if (isShow.value) {
        return h(
          "span",
          {
            to: "body"
          },
          h(
            "div",
            {
              "class": {
                "tooltip": true,
                "bs-tooltip-auto": true,
                "show": isShow.value
              },
              "style": floatingStyles.value,
              "data-popper-placement": placement.value,
              "ref": tooltipRef
            },
            [
              h(
                "div",
                {
                  class: {
                    "tooltip-arrow": true
                  },
                  style: {
                    ...addProp((_a = middlewareData.value.arrow) == null ? undefined : _a.x, "left", `${(_b = middlewareData.value.arrow) == null ? undefined : _b.x}px`),
                    ...addProp((_c = middlewareData.value.arrow) == null ? undefined : _c.y, "top", `${(_d = middlewareData.value.arrow) == null ? undefined : _d.y}px`),
                    position: "absolute"
                  },
                  ref: tooltipArrowRef
                }
              ),
              h(
                "div",
                {
                  class: {
                    "tooltip-inner": true
                  }
                },
                props.title
              )
            ]
          )
        );
      } else {
        return undefined;
      }
    }
  };
}
const PopoverProps = {
  title: {
    type: [String],
    default: ""
  },
  content: {
    type: [String],
    default: ""
  },
  placement: {
    type: [String],
    default: "right"
  },
  template: {
    type: String
  }
};
function usePopover(props, elementRef) {
  if (!props.toggle || props.toggle != "popover") {
    return {};
  }
  const popoverRef = ref();
  const arrowRef = ref();
  const isShow = ref(false);
  const targetIsVisible = useElementVisibility$1(elementRef);
  const { floatingStyles, placement, middlewareData } = useFloating(elementRef, popoverRef, {
    placement: props.placement,
    middleware: [
      // autoPlacement(),
      flip(),
      shift(),
      offset(9),
      arrow({ element: arrowRef })
    ]
  });
  const toggle = async () => {
    isShow.value = !isShow.value;
  };
  watch(
    targetIsVisible,
    () => {
      if (targetIsVisible.value == false) {
        isShow.value = false;
      }
    }
  );
  return {
    attr: computed(() => {
      return {};
    }),
    event: {
      onClick: toggle
    },
    render: () => {
      var _a, _b, _c, _d;
      if (isShow.value) {
        return h(
          "span",
          {
            to: "body"
          },
          h(
            "div",
            {
              "class": {
                "popover": true,
                "bs-popover-auto": true,
                "fade": true,
                "show": true
              },
              "style": floatingStyles.value,
              "data-popper-placement": placement.value,
              "ref": popoverRef
            },
            [
              h(
                "div",
                {
                  class: {
                    "popover-arrow": true
                  },
                  style: {
                    ...addProp((_a = middlewareData.value.arrow) == null ? undefined : _a.x, "left", `${(_b = middlewareData.value.arrow) == null ? undefined : _b.x}px`),
                    ...addProp((_c = middlewareData.value.arrow) == null ? undefined : _c.y, "top", `${(_d = middlewareData.value.arrow) == null ? undefined : _d.y}px`),
                    position: "absolute"
                  },
                  ref: arrowRef
                }
              ),
              h(
                "div",
                {
                  class: {
                    "popover-header": true
                  }
                },
                props.title
              ),
              h(
                "div",
                {
                  class: {
                    "popover-body": true
                  }
                },
                props.content
              )
            ]
          )
        );
      } else {
        return undefined;
      }
    }
  };
}
function useDynamicRoute(path) {
  const options = useModuleOptions();
  const route = useRoute();
  return computed(() => {
    const params = defu(route.params, options == null ? undefined : options.defaults);
    const regex = /\[(\w+)\]/g;
    let result;
    let res = path;
    while ((result = regex.exec(path)) !== null) {
      res = res.replace(result[0], params[result[1]]);
    }
    return res;
  });
}
const AnchorProps = {
  ...EventEmitProps,
  button: {
    type: Boolean,
    default: undefined
  },
  size: {
    type: String,
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: undefined
  },
  stretched: {
    type: Boolean,
    default: undefined
  },
  color: {
    type: String,
    default: undefined
  },
  to: {
    type: String,
    default: undefined
  },
  activeBackgroundColor: {
    type: String,
    default: undefined
  },
  activeBorderColor: {
    type: String,
    default: undefined
  },
  activeColor: {
    type: String,
    default: undefined
  },
  dynamicRoute: {
    type: Boolean,
    default: undefined
  },
  external: {
    type: Boolean,
    default: undefined
  }
};
function useAnchor(props) {
  const colorIncludePreset = computed(() => includesPresets(props.button ? "button-color" : "link-color", props.color));
  return {
    class: computed(() => {
      return {
        "stretched-link": props.stretched,
        "disabled": props.disabled,
        [`link-${props.color}`]: props.color && !props.button && colorIncludePreset.value,
        "btn": props.button,
        [`btn-${props.color}`]: props.color && props.button && colorIncludePreset.value,
        [`btn-${props.size}`]: props.size && props.button
      };
    }),
    style: computed(() => {
      return {
        ...addProp(props.color && !colorIncludePreset.value, "--bs-btn-bg", `var(--bs-${props.color})`),
        ...addProp(props.color && !colorIncludePreset.value, "--bs-btn-color", `var(--bs-contrast-${props.color})`),
        ...addProp(props.color && !colorIncludePreset.value, "--bs-btn-border-color", `var(--bs-${props.color})`),
        ...addProp(props.color && !colorIncludePreset.value, "--bs-btn-hover-color", `var(--bs-contrast-${props.color})`),
        ...addProp(props.color && !colorIncludePreset.value, "--bs-btn-hover-bg", `var(--bs-active-${props.color})`),
        ...addProp(props.color && !colorIncludePreset.value, "--bs-btn-hover-border-color", `var(--bs-${props.color})`),
        ...addProp(props.color && !colorIncludePreset.value, "--bs-btn-active-color", `var(--bs-contrast-${props.color})`),
        ...addProp(props.color && !colorIncludePreset.value, "--bs-btn-active-bg", `var(--bs-active-${props.color})`),
        ...addProp(props.color && !colorIncludePreset.value, "--bs-btn-active-border-color", `var(--bs-active-${props.color})`),
        ...addProp(props.activeBackgroundColor, "--bs-btn-active-bg", `var(--bs-${props.activeBackgroundColor})`),
        ...addProp(props.activeBackgroundColor, "--bs-btn-active-color", `var(--bs-contrast-${props.activeBackgroundColor})`),
        ...addProp(props.activeBorderColor, "--bs-btn-active-border-color", `var(--bs-${props.activeBorderColor})`)
      };
    }),
    attr: computed(() => {
      return {
        ...addProp(props.button, "role", "button"),
        ...addProp(props.disabled, "aria-disabled", "true"),
        ...addProp(props.href, "href", props.href),
        ...addProp(props.target, "target", props.target),
        ...addProp(!props.target && props.external, "target", "_blank"),
        ...addProp(props.external, "rel", "noopener"),
        ...addProp(props.to, "to", props.dynamicRoute ? useDynamicRoute(props.to || "").value : props.to)
      };
    })
  };
}
function useScrollSpyItem(props, elementRef) {
  const spy = inject("spy.spy", undefined);
  if (!spy) {
    return {};
  }
  if (!props.target && !props.href) {
    return {};
  }
  const targetIsVisible = ref(false);
  const target = findOneSelectorRef(props.target || props.href);
  const refresh = inject("refresh.spy", () => {
  });
  const registerSpyItem = inject("registerItem.spy", (id) => {
    return id;
  });
  watch(elementRef, () => {
    const element = unrefElement$1(elementRef);
    if (!element) {
      return;
    }
    registerSpyItem(element.id);
  });
  useIntersectionObserver$1(target, async ([{ isIntersecting }]) => {
    targetIsVisible.value = isIntersecting;
    await nextTick();
    refresh();
  });
  const spyElem = findOneSelectorRef(spy.value);
  const onClick = (event) => {
    var _a;
    if (spyElem.value && target.value) {
      event.preventDefault();
      const top = ((_a = target.value) == null ? undefined : _a.offsetTop) - spyElem.value.offsetTop;
      spyElem.value.scrollTo({ top, behavior: "smooth" });
      return false;
    }
  };
  return {
    event: {
      onClick
    },
    attr: computed(() => {
      return {
        "data-bv-spy-visible": targetIsVisible.value
      };
    })
  };
}
const CloseButtonProps = {
  ...EventEmitProps,
  dismiss: {
    type: String
  }
};
function useCloseButton(props, elementRef) {
  if (!props.dismiss) {
    return {};
  }
  const dismissEmitter = useEventEmitter(props, "dismiss", props.dismiss || "");
  const dismiss = () => {
    dismissEmitter();
  };
  return {
    method: {
      dismiss
    },
    event: {
      onClick: dismiss
    }
  };
}
function useEvent(props, elementRef, eventSuffix) {
  const eid = useIDRef(props);
  computed(
    () => useEventBus(`expose_${eid.value}`)
  );
  const emitEventBus = computed(
    () => useEventBus(`emit_${eid.value}`)
  );
  function expose(exposed) {
    forOwn(exposed, (value, key) => {
      provide(`${key}.${eventSuffix}`, value);
    });
    return exposed;
  }
  function emit(context, event, payload) {
    context.emit(event, payload);
    emitEventBus.value.emit(event, payload);
  }
  function exposeState(state) {
    forOwn(state, (value, key) => {
      provide(`${key}.${eventSuffix}`, value);
    });
  }
  return {
    emit,
    expose,
    exposeState
  };
}
const ActiveProps = {
  active: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
};
function useActive(props, eventSuffix, elementRef) {
  const current = inject(
    `current.${eventSuffix}`,
    undefined
  );
  const parent = inject(
    `parent.${eventSuffix}`,
    undefined
  );
  const eid = useIDRef(props);
  const active = ref(eid.value && (current == null ? undefined : current.value) == eid.value || props.active || false);
  const { expose, exposeState } = useEvent(props, elementRef, eventSuffix);
  if (current && !props.to) {
    if (active.value && eid.value) {
      current.value = eid.value;
    }
    watch(current, async (next) => {
      if (next == eid.value) {
        active.value = true;
      } else {
        active.value = false;
      }
      const element = unrefElement$1(elementRef);
      if (!element) {
        return;
      }
      await nextTick();
      if (active.value) {
        if (!element.classList.contains("active")) {
          element.classList.add("active");
          await nextTick();
        }
      } else {
        if (element.classList.contains("active")) {
          element.classList.remove("active");
          await nextTick();
        }
      }
    });
  }
  const show = () => {
    if (props.disabled) {
      return;
    }
    if (current && parent && parent.value && eid.value) {
      current.value = eid.value;
    } else {
      active.value = true;
    }
  };
  const hide = () => {
    if (current && parent && parent.value) {
      current.value = "";
    } else {
      active.value = false;
    }
  };
  const toggle = () => {
    if (active.value) {
      hide();
    } else {
      show();
    }
  };
  const method = expose({ show, hide, toggle, dissmiss: hide });
  exposeState({ active });
  return {
    class: computed(() => {
      return {
        active: active.value,
        disabled: props.disabled
      };
    }),
    attr: computed(() => {
      return {
        ...addProp(active.value, "aria-current", "page"),
        ...addProp(props.disabled, "aria-disabled", "true")
      };
    }),
    method
  };
}
const BsActiveLink = defineNuxtLink({
  componentName: "BsNuxtActiveLink",
  externalRelAttribute: "",
  activeClass: "",
  exactActiveClass: "active",
  prefetchedClass: "",
  trailingSlash: "remove"
});
const __nuxt_component_9 = defineComponent(
  {
    name: "Anchor",
    props: {
      ...BlockProps,
      ...AnchorProps,
      ...IDProps,
      ...ToggleProps,
      ...TooltipProps,
      ...PopoverProps,
      ...ActiveProps,
      ...CloseButtonProps,
      icon: {
        type: String,
        default: undefined
      },
      iconEnd: {
        type: Boolean,
        default: false
      },
      iconColor: {
        type: String,
        default: undefined
      },
      iconHover: {
        type: Boolean,
        default: undefined
      },
      nav: {
        type: Boolean,
        default: undefined
      },
      alert: {
        type: Boolean,
        default: undefined
      },
      card: {
        type: Boolean,
        default: undefined
      },
      externalIcon: {
        type: String,
        default: "bi:box-arrow-up-right"
      }
    },
    setup(props, context) {
      const elementRef = ref();
      const Block = useBlock(props);
      const id = useID(props, "a");
      const toggle = useToggle(props);
      const tooltip = useTooltip(props, elementRef);
      const popover = usePopover(props, elementRef);
      const Anchor = useAnchor(props);
      const active = useActive(props, "button", elementRef);
      const spyItem = useScrollSpyItem(props, elementRef);
      const spyActive = useActive(props, "list", elementRef);
      const close = useCloseButton(props);
      const current = {
        class: {
          "icon-link": props.icon,
          "icon-link-hover": props.iconHover,
          "nav-link": props.nav,
          "alert-link": props.alert,
          "card-link": props.card
        },
        // attr: {
        //  activeClass: '',
        //  exactActiveClass: ''
        // },
        ref: elementRef
      };
      exposeMethods(context);
      return () => h(
        BsActiveLink,
        hProps(
          Anchor,
          active,
          toggle,
          tooltip,
          popover,
          Block,
          spyItem,
          spyActive,
          close,
          id,
          current
        ),
        () => [
          !props.iconEnd && props.icon ? h(__nuxt_component_1, { icon: props.icon, color: props.iconColor, margin: "e-1", class: { bi: true } }) : undefined,
          ...hSlots(context.slots.default, tooltip.render, popover.render),
          props.iconEnd && props.icon ? h(__nuxt_component_1, { icon: props.icon, color: props.iconColor, margin: "s-1", class: { bi: true } }) : undefined,
          props.external ? h(__nuxt_component_1, { icon: props.externalIcon, color: props.iconColor, margin: "s-1", class: { bi: true } }) : undefined
        ]
      );
    }
  }
);
const __nuxt_component_10 = defineComponent({
  name: "BsCardFooter",
  props: {
    ...BlockProps,
    tag: {
      type: String,
      default: "div"
    }
  },
  setup(props, context) {
    const block = useBlock(props);
    const current = {
      class: {
        "card-footer": true
      }
    };
    return () => h(props.tag, hProps(current, block), context.slots);
  }
});

export { __nuxt_component_2 as _, __nuxt_component_3 as a, __nuxt_component_4 as b, __nuxt_component_6 as c, __nuxt_component_7 as d, __nuxt_component_8 as e, __nuxt_component_9 as f, __nuxt_component_10 as g };
//# sourceMappingURL=CardFooter-Cyos2gy6.mjs.map
