import { _ as __nuxt_component_0 } from './nuxt-link-D55NkqpS.mjs';
import { useSSRContext, defineComponent, mergeProps, withCtx, createTextVNode, toDisplayString } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CharacterLink",
  __ssrInlineRender: true,
  props: ["character"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: `/characters/character-${__props.character.id}`,
        data: __props.character,
        color: "info"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.character.name)} (id: ${ssrInterpolate(__props.character.id)}) `);
          } else {
            return [
              createTextVNode(toDisplayString(__props.character.name) + " (id: " + toDisplayString(__props.character.id) + ") ", 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CharacterLink.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-680c8df4"]]);

export { __nuxt_component_2 as _ };
//# sourceMappingURL=CharacterLink-CFakXbCd.mjs.map
