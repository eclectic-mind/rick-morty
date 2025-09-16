import { _ as __nuxt_component_0, a as __nuxt_component_1, b as __nuxt_component_5 } from './IconBox-DdRdT_MU.mjs';
import { _ as __nuxt_component_2 } from './CharacterLink-CFakXbCd.mjs';
import { _ as _sfc_main$1 } from './LocationLink-DdDP4-xt.mjs';
import { _ as _sfc_main$2 } from './EpisodeLink-DHF1ihjU.mjs';
import { useSSRContext, defineComponent, withCtx, unref, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { b as useFavoritesStore } from './index-MUHduU45.mjs';
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
  __name: "favorite",
  __ssrInlineRender: true,
  setup(__props) {
    const favoritesStore = useFavoritesStore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Container = __nuxt_component_0;
      const _component_Row = __nuxt_component_1;
      const _component_CharacterLink = __nuxt_component_2;
      const _component_IconBox = __nuxt_component_5;
      const _component_LocationLink = _sfc_main$1;
      const _component_EpisodeLink = _sfc_main$2;
      _push(ssrRenderComponent(_component_Container, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Row, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h5 class="title" data-v-2e8808df${_scopeId2}>\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u044B\u0435 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u0436\u0438</h5><p class="text-secondary" data-v-2e8808df${_scopeId2}>\u0412\u0441\u0435\u0433\u043E: ${ssrInterpolate(unref(favoritesStore).characters.length)}</p><ul data-v-2e8808df${_scopeId2}><!--[-->`);
                  ssrRenderList(unref(favoritesStore).characters, (elem) => {
                    _push3(`<li data-v-2e8808df${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_CharacterLink, { character: elem }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_IconBox, {
                      icon: "bi:hand-thumbs-down-fill",
                      size: "sm",
                      onClick: ($event) => unref(favoritesStore).removeFavCharacter(elem)
                    }, null, _parent3, _scopeId2));
                    _push3(`</li>`);
                  });
                  _push3(`<!--]--></ul>`);
                } else {
                  return [
                    createVNode("h5", { class: "title" }, "\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u044B\u0435 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u0436\u0438"),
                    createVNode("p", { class: "text-secondary" }, "\u0412\u0441\u0435\u0433\u043E: " + toDisplayString(unref(favoritesStore).characters.length), 1),
                    createVNode("ul", null, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(favoritesStore).characters, (elem) => {
                        return openBlock(), createBlock("li", {
                          key: elem.id
                        }, [
                          createVNode(_component_CharacterLink, { character: elem }, null, 8, ["character"]),
                          createVNode(_component_IconBox, {
                            icon: "bi:hand-thumbs-down-fill",
                            size: "sm",
                            onClick: ($event) => unref(favoritesStore).removeFavCharacter(elem)
                          }, null, 8, ["onClick"])
                        ]);
                      }), 128))
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Row, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h5 class="title" data-v-2e8808df${_scopeId2}>\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u044B\u0435 \u043B\u043E\u043A\u0430\u0446\u0438\u0438</h5><p class="text-secondary" data-v-2e8808df${_scopeId2}>\u0412\u0441\u0435\u0433\u043E: ${ssrInterpolate(unref(favoritesStore).locations.length)}</p><ul data-v-2e8808df${_scopeId2}><!--[-->`);
                  ssrRenderList(unref(favoritesStore).locations, (elem) => {
                    _push3(`<li data-v-2e8808df${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_LocationLink, { location: elem }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_IconBox, {
                      icon: "bi:hand-thumbs-down-fill",
                      size: "sm",
                      onClick: ($event) => unref(favoritesStore).removeFavLocation(elem)
                    }, null, _parent3, _scopeId2));
                    _push3(`</li>`);
                  });
                  _push3(`<!--]--></ul>`);
                } else {
                  return [
                    createVNode("h5", { class: "title" }, "\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u044B\u0435 \u043B\u043E\u043A\u0430\u0446\u0438\u0438"),
                    createVNode("p", { class: "text-secondary" }, "\u0412\u0441\u0435\u0433\u043E: " + toDisplayString(unref(favoritesStore).locations.length), 1),
                    createVNode("ul", null, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(favoritesStore).locations, (elem) => {
                        return openBlock(), createBlock("li", {
                          key: elem.id
                        }, [
                          createVNode(_component_LocationLink, { location: elem }, null, 8, ["location"]),
                          createVNode(_component_IconBox, {
                            icon: "bi:hand-thumbs-down-fill",
                            size: "sm",
                            onClick: ($event) => unref(favoritesStore).removeFavLocation(elem)
                          }, null, 8, ["onClick"])
                        ]);
                      }), 128))
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Row, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h5 class="title" data-v-2e8808df${_scopeId2}>\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u044B\u0435 \u044D\u043F\u0438\u0437\u043E\u0434\u044B</h5><p class="text-secondary" data-v-2e8808df${_scopeId2}>\u0412\u0441\u0435\u0433\u043E: ${ssrInterpolate(unref(favoritesStore).episodes.length)}</p><ul data-v-2e8808df${_scopeId2}><!--[-->`);
                  ssrRenderList(unref(favoritesStore).episodes, (elem) => {
                    _push3(`<li data-v-2e8808df${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_EpisodeLink, { episode: elem }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_IconBox, {
                      icon: "bi:hand-thumbs-down-fill",
                      size: "sm",
                      onClick: ($event) => unref(favoritesStore).removeFavEpisode(elem)
                    }, null, _parent3, _scopeId2));
                    _push3(`</li>`);
                  });
                  _push3(`<!--]--></ul>`);
                } else {
                  return [
                    createVNode("h5", { class: "title" }, "\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u044B\u0435 \u044D\u043F\u0438\u0437\u043E\u0434\u044B"),
                    createVNode("p", { class: "text-secondary" }, "\u0412\u0441\u0435\u0433\u043E: " + toDisplayString(unref(favoritesStore).episodes.length), 1),
                    createVNode("ul", null, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(favoritesStore).episodes, (elem) => {
                        return openBlock(), createBlock("li", {
                          key: elem.id
                        }, [
                          createVNode(_component_EpisodeLink, { episode: elem }, null, 8, ["episode"]),
                          createVNode(_component_IconBox, {
                            icon: "bi:hand-thumbs-down-fill",
                            size: "sm",
                            onClick: ($event) => unref(favoritesStore).removeFavEpisode(elem)
                          }, null, 8, ["onClick"])
                        ]);
                      }), 128))
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
                  createVNode("h5", { class: "title" }, "\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u044B\u0435 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u0436\u0438"),
                  createVNode("p", { class: "text-secondary" }, "\u0412\u0441\u0435\u0433\u043E: " + toDisplayString(unref(favoritesStore).characters.length), 1),
                  createVNode("ul", null, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(favoritesStore).characters, (elem) => {
                      return openBlock(), createBlock("li", {
                        key: elem.id
                      }, [
                        createVNode(_component_CharacterLink, { character: elem }, null, 8, ["character"]),
                        createVNode(_component_IconBox, {
                          icon: "bi:hand-thumbs-down-fill",
                          size: "sm",
                          onClick: ($event) => unref(favoritesStore).removeFavCharacter(elem)
                        }, null, 8, ["onClick"])
                      ]);
                    }), 128))
                  ])
                ]),
                _: 1
              }),
              createVNode(_component_Row, null, {
                default: withCtx(() => [
                  createVNode("h5", { class: "title" }, "\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u044B\u0435 \u043B\u043E\u043A\u0430\u0446\u0438\u0438"),
                  createVNode("p", { class: "text-secondary" }, "\u0412\u0441\u0435\u0433\u043E: " + toDisplayString(unref(favoritesStore).locations.length), 1),
                  createVNode("ul", null, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(favoritesStore).locations, (elem) => {
                      return openBlock(), createBlock("li", {
                        key: elem.id
                      }, [
                        createVNode(_component_LocationLink, { location: elem }, null, 8, ["location"]),
                        createVNode(_component_IconBox, {
                          icon: "bi:hand-thumbs-down-fill",
                          size: "sm",
                          onClick: ($event) => unref(favoritesStore).removeFavLocation(elem)
                        }, null, 8, ["onClick"])
                      ]);
                    }), 128))
                  ])
                ]),
                _: 1
              }),
              createVNode(_component_Row, null, {
                default: withCtx(() => [
                  createVNode("h5", { class: "title" }, "\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u044B\u0435 \u044D\u043F\u0438\u0437\u043E\u0434\u044B"),
                  createVNode("p", { class: "text-secondary" }, "\u0412\u0441\u0435\u0433\u043E: " + toDisplayString(unref(favoritesStore).episodes.length), 1),
                  createVNode("ul", null, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(favoritesStore).episodes, (elem) => {
                      return openBlock(), createBlock("li", {
                        key: elem.id
                      }, [
                        createVNode(_component_EpisodeLink, { episode: elem }, null, 8, ["episode"]),
                        createVNode(_component_IconBox, {
                          icon: "bi:hand-thumbs-down-fill",
                          size: "sm",
                          onClick: ($event) => unref(favoritesStore).removeFavEpisode(elem)
                        }, null, 8, ["onClick"])
                      ]);
                    }), 128))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/favorite.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};
const favorite = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2e8808df"]]);

export { favorite as default };
//# sourceMappingURL=favorite-DdxlmBon.mjs.map
