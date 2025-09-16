import { _ as __nuxt_component_0 } from './nuxt-link-D55NkqpS.mjs';
import { _ as __nuxt_component_1 } from './BIcon-D2Gz8lLp.mjs';
import { useSSRContext, defineComponent, ref, withCtx, createVNode, createTextVNode, unref, toDisplayString } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { b as useFavoritesStore } from './index-MUHduU45.mjs';
import { _ as _export_sfc } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'consola/core';
import 'node:url';
import '@iconify/utils';
import 'ipx';
import './index-Du58e3vH.mjs';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import 'pinia';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'shiki';
import 'lodash-es';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const favStore = useFavoritesStore();
    ref("fav-counter");
    const sum = favStore.sum;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_BIcon = __nuxt_component_1;
      _push(`<!--[--><header class="bg-dark" data-v-028225b5><ul class="nav nav-pills nav-fill flex-column flex-sm-row p-3" data-v-028225b5><li class="nav-item" data-v-028225b5>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "nav-link text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_BIcon, {
              icon: "bi:house-door-fill",
              margin: "2"
            }, null, _parent2, _scopeId));
            _push2(` \u0413\u043B\u0430\u0432\u043D\u0430\u044F`);
          } else {
            return [
              createVNode(_component_BIcon, {
                icon: "bi:house-door-fill",
                margin: "2"
              }),
              createTextVNode(" \u0413\u043B\u0430\u0432\u043D\u0430\u044F")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li class="nav-item" data-v-028225b5>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/characters",
        class: "nav-link text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_BIcon, {
              icon: "bi:person-fill",
              margin: "2"
            }, null, _parent2, _scopeId));
            _push2(` \u041F\u0435\u0440\u0441\u043E\u043D\u0430\u0436\u0438 `);
          } else {
            return [
              createVNode(_component_BIcon, {
                icon: "bi:person-fill",
                margin: "2"
              }),
              createTextVNode(" \u041F\u0435\u0440\u0441\u043E\u043D\u0430\u0436\u0438 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li class="nav-item" data-v-028225b5>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/locations",
        class: "nav-link text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_BIcon, {
              icon: "bi:signpost-fill",
              margin: "2"
            }, null, _parent2, _scopeId));
            _push2(` \u041B\u043E\u043A\u0430\u0446\u0438\u0438 `);
          } else {
            return [
              createVNode(_component_BIcon, {
                icon: "bi:signpost-fill",
                margin: "2"
              }),
              createTextVNode(" \u041B\u043E\u043A\u0430\u0446\u0438\u0438 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li class="nav-item" data-v-028225b5>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/episodes",
        class: "nav-link text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_BIcon, {
              icon: "bi:puzzle-fill",
              margin: "2"
            }, null, _parent2, _scopeId));
            _push2(` \u042D\u043F\u0438\u0437\u043E\u0434\u044B`);
          } else {
            return [
              createVNode(_component_BIcon, {
                icon: "bi:puzzle-fill",
                margin: "2"
              }),
              createTextVNode(" \u042D\u043F\u0438\u0437\u043E\u0434\u044B")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li class="nav-item" data-v-028225b5>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/favorite",
        class: "nav-link text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_BIcon, {
              icon: "bi:heart-fill",
              margin: "2"
            }, null, _parent2, _scopeId));
            _push2(` \u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435 <span class="badge bg-info" data-v-028225b5${_scopeId}>${ssrInterpolate(unref(sum))}</span>`);
          } else {
            return [
              createVNode(_component_BIcon, {
                icon: "bi:heart-fill",
                margin: "2"
              }),
              createTextVNode(" \u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435 "),
              createVNode("span", {
                class: "badge bg-info",
                ref: "fav-counter"
              }, toDisplayString(unref(sum)), 513)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></header><main data-v-028225b5>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main><footer class="bg-dark text-white p-3" data-v-028225b5>\xA9 all rights reserved </footer><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-028225b5"]]);

export { _default as default };
//# sourceMappingURL=default-DO4j83HB.mjs.map
