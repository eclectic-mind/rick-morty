import { _ as __nuxt_component_0, a as __nuxt_component_1, b as __nuxt_component_5 } from './IconBox-DdRdT_MU.mjs';
import { _ as _sfc_main$1 } from './LocationLink-DdDP4-xt.mjs';
import { _ as __nuxt_component_4 } from './Pagination-Dt2zeUhF.mjs';
import { useSSRContext, defineComponent, withCtx, unref, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { e as useLocationsStore, b as useFavoritesStore } from './index-MUHduU45.mjs';
import { _ as _export_sfc } from './server.mjs';
import 'lodash-es';
import './index-Du58e3vH.mjs';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import './nuxt-link-D55NkqpS.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'consola/core';
import 'node:url';
import '@iconify/utils';
import 'ipx';
import 'pinia';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'shiki';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const myStore = useLocationsStore();
    const favStore = useFavoritesStore();
    myStore.init();
    const findItem = (array, id) => {
      let result = null;
      array.forEach((item) => {
        if (Number(item.id) === Number(id)) {
          result = item;
        }
      });
      return result;
    };
    const checkFav = (id) => {
      const inFavorites = findItem(favStore.locations, id);
      return inFavorites ? "pink" : "white";
    };
    const setFav = (item) => {
      const inFavorites = findItem(favStore.locations, item.id);
      if (!inFavorites) {
        favStore.addFavLocation(item);
      } else {
        favStore.removeFavLocation(item);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Container = __nuxt_component_0;
      const _component_Row = __nuxt_component_1;
      const _component_LocationLink = _sfc_main$1;
      const _component_IconBox = __nuxt_component_5;
      const _component_Pagination = __nuxt_component_4;
      _push(ssrRenderComponent(_component_Container, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Row, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h4 class="title" data-v-120e83d6${_scopeId2}>\u041B\u043E\u043A\u0430\u0446\u0438\u0438</h4><p class="text-secondary" data-v-120e83d6${_scopeId2}>\u0412\u0441\u0435\u0433\u043E: ${ssrInterpolate(unref(myStore).count)}</p><ul data-v-120e83d6${_scopeId2}><!--[-->`);
                  ssrRenderList(unref(myStore).items, (elem) => {
                    _push3(`<li data-v-120e83d6${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_LocationLink, { location: elem }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_IconBox, {
                      icon: "bi:heart-fill",
                      size: "sm",
                      color: checkFav(elem.id),
                      onClick: ($event) => setFav(elem)
                    }, null, _parent3, _scopeId2));
                    _push3(`</li>`);
                  });
                  _push3(`<!--]--></ul><nav aria-label="pagination" data-v-120e83d6${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Pagination, {
                    active: unref(myStore).currentPage,
                    pages: unref(myStore).pages,
                    next: unref(myStore).next,
                    prev: unref(myStore).prev,
                    url: "/locations",
                    type: "locations"
                  }, null, _parent3, _scopeId2));
                  _push3(`</nav>`);
                } else {
                  return [
                    createVNode("h4", { class: "title" }, "\u041B\u043E\u043A\u0430\u0446\u0438\u0438"),
                    createVNode("p", { class: "text-secondary" }, "\u0412\u0441\u0435\u0433\u043E: " + toDisplayString(unref(myStore).count), 1),
                    createVNode("ul", null, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(myStore).items, (elem) => {
                        return openBlock(), createBlock("li", {
                          key: elem.id
                        }, [
                          createVNode(_component_LocationLink, { location: elem }, null, 8, ["location"]),
                          createVNode(_component_IconBox, {
                            icon: "bi:heart-fill",
                            size: "sm",
                            color: checkFav(elem.id),
                            onClick: ($event) => setFav(elem)
                          }, null, 8, ["color", "onClick"])
                        ]);
                      }), 128))
                    ]),
                    createVNode("nav", { "aria-label": "pagination" }, [
                      createVNode(_component_Pagination, {
                        active: unref(myStore).currentPage,
                        pages: unref(myStore).pages,
                        next: unref(myStore).next,
                        prev: unref(myStore).prev,
                        url: "/locations",
                        type: "locations"
                      }, null, 8, ["active", "pages", "next", "prev"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Row, null, {
                default: withCtx(() => [
                  createVNode("h4", { class: "title" }, "\u041B\u043E\u043A\u0430\u0446\u0438\u0438"),
                  createVNode("p", { class: "text-secondary" }, "\u0412\u0441\u0435\u0433\u043E: " + toDisplayString(unref(myStore).count), 1),
                  createVNode("ul", null, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(myStore).items, (elem) => {
                      return openBlock(), createBlock("li", {
                        key: elem.id
                      }, [
                        createVNode(_component_LocationLink, { location: elem }, null, 8, ["location"]),
                        createVNode(_component_IconBox, {
                          icon: "bi:heart-fill",
                          size: "sm",
                          color: checkFav(elem.id),
                          onClick: ($event) => setFav(elem)
                        }, null, 8, ["color", "onClick"])
                      ]);
                    }), 128))
                  ]),
                  createVNode("nav", { "aria-label": "pagination" }, [
                    createVNode(_component_Pagination, {
                      active: unref(myStore).currentPage,
                      pages: unref(myStore).pages,
                      next: unref(myStore).next,
                      prev: unref(myStore).prev,
                      url: "/locations",
                      type: "locations"
                    }, null, 8, ["active", "pages", "next", "prev"])
                  ])
                ]),
                _: 1
              })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/locations/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-120e83d6"]]);

export { index as default };
//# sourceMappingURL=index-zSjIPhj6.mjs.map
