import { useSSRContext, defineComponent, mergeProps } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { a as useCharactersStore, e as useLocationsStore, c as useEpisodesStore } from './index-MUHduU45.mjs';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Pagination",
  __ssrInlineRender: true,
  props: {
    active: {},
    pages: {},
    next: {},
    prev: {},
    url: {},
    type: {}
  },
  setup(__props) {
    const characterStore = useCharactersStore();
    const locationsStore = useLocationsStore();
    const episodesStore = useEpisodesStore();
    const props = __props;
    characterStore.init();
    locationsStore.init();
    episodesStore.init();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<ul${ssrRenderAttrs(mergeProps({ class: "pagination pagination-sm" }, _attrs))} data-v-dd1dc2bb><li class="page-item" data-v-dd1dc2bb><span class="page-link" data-v-dd1dc2bb> First </span></li><li class="page-item" data-v-dd1dc2bb><span class="${ssrRenderClass(["page-link", { "disabled": props.prev === null }])}" data-v-dd1dc2bb> Previous </span></li><!--[-->`);
      ssrRenderList(props.pages, (item) => {
        _push(`<li class="page-item" data-v-dd1dc2bb><span class="${ssrRenderClass(["page-link", { "active": item === props.active }])}" data-v-dd1dc2bb>${ssrInterpolate(item)}</span></li>`);
      });
      _push(`<!--]--><li class="page-item" data-v-dd1dc2bb><span class="${ssrRenderClass(["page-link", { "disabled": props.next === null }])}" data-v-dd1dc2bb> Next </span></li><li class="page-item" data-v-dd1dc2bb><span class="page-link" data-v-dd1dc2bb> Last </span></li></ul>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Pagination.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};
const __nuxt_component_4 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-dd1dc2bb"]]);

export { __nuxt_component_4 as _ };
//# sourceMappingURL=Pagination-Dt2zeUhF.mjs.map
