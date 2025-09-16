import { _ as __nuxt_component_0 } from './nuxt-link-D55NkqpS.mjs';
import { useSSRContext, defineComponent, mergeProps, withCtx, createTextVNode, toDisplayString } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "EpisodeLink",
  __ssrInlineRender: true,
  props: ["episode"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: `/episodes/episode-${__props.episode.id}`,
        data: __props.episode,
        class: ""
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.episode.episode)} (id: ${ssrInterpolate(__props.episode.id)}, on air: ${ssrInterpolate(__props.episode.air_date)}) `);
          } else {
            return [
              createTextVNode(toDisplayString(__props.episode.episode) + " (id: " + toDisplayString(__props.episode.id) + ", on air: " + toDisplayString(__props.episode.air_date) + ") ", 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/EpisodeLink.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};

export { _sfc_main as _ };
//# sourceMappingURL=EpisodeLink-DHF1ihjU.mjs.map
