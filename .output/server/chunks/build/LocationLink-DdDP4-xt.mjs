import { _ as __nuxt_component_0 } from './nuxt-link-D55NkqpS.mjs';
import { useSSRContext, defineComponent, mergeProps, withCtx, createTextVNode, toDisplayString } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LocationLink",
  __ssrInlineRender: true,
  props: ["location"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: `/locations/location-${__props.location.id}`,
        data: __props.location,
        class: ""
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.location.name)} (id: ${ssrInterpolate(__props.location.id)}, type: ${ssrInterpolate(__props.location.type)}) `);
          } else {
            return [
              createTextVNode(toDisplayString(__props.location.name) + " (id: " + toDisplayString(__props.location.id) + ", type: " + toDisplayString(__props.location.type) + ") ", 1)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LocationLink.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};

export { _sfc_main as _ };
//# sourceMappingURL=LocationLink-DdDP4-xt.mjs.map
