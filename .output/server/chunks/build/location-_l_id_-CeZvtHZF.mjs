import { _ as __nuxt_component_0, a as __nuxt_component_1, b as __nuxt_component_5 } from './IconBox-DdRdT_MU.mjs';
import { _ as __nuxt_component_2, a as __nuxt_component_3, b as __nuxt_component_4, c as __nuxt_component_6, d as __nuxt_component_7, e as __nuxt_component_8, f as __nuxt_component_9, g as __nuxt_component_10 } from './CardFooter-Cyos2gy6.mjs';
import { useSSRContext, defineComponent, withAsyncContext, withCtx, unref, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { e as useLocationsStore, b as useFavoritesStore } from './index-MUHduU45.mjs';
import { _ as _export_sfc, a as useRoute } from './server.mjs';
import 'lodash-es';
import './index-Du58e3vH.mjs';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'consola/core';
import 'node:url';
import '@iconify/utils';
import 'ipx';
import '@floating-ui/vue';
import './nuxt-link-D55NkqpS.mjs';
import './BIcon-D2Gz8lLp.mjs';
import 'pinia';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'shiki';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "location-[l_id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const myStore = useLocationsStore();
    const favStore = useFavoritesStore();
    const { l_id } = useRoute().params;
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
    const getLinkName = (data) => {
      const array = data.split("/");
      return array[array.length - 1];
    };
    const getLink = (data) => {
      const number = getLinkName(data);
      return `/characters/character-${number}`;
    };
    const checkFav = (id) => {
      const inFavorites = findItem(favStore.locations, id);
      return inFavorites ? "pink" : "white";
    };
    const setFav = (item) => {
      const inFavorites = findItem(favStore.locations, l_id);
      if (!inFavorites) {
        favStore.addFavLocation(item);
      } else {
        favStore.removeFavLocation(item);
      }
    };
    const currentItem = ([__temp, __restore] = withAsyncContext(() => myStore.fetchLocationById(l_id)), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Container = __nuxt_component_0;
      const _component_Row = __nuxt_component_1;
      const _component_Col = __nuxt_component_2;
      const _component_Card = __nuxt_component_3;
      const _component_CardHeader = __nuxt_component_4;
      const _component_IconBox = __nuxt_component_5;
      const _component_CardBody = __nuxt_component_6;
      const _component_CardTitle = __nuxt_component_7;
      const _component_CardText = __nuxt_component_8;
      const _component_Anchor = __nuxt_component_9;
      const _component_CardFooter = __nuxt_component_10;
      _push(ssrRenderComponent(_component_Container, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Row, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h4 class="title" data-v-07d41c7c${_scopeId2}>\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u043B\u043E\u043A\u0430\u0446\u0438\u0438</h4>`);
                  _push3(ssrRenderComponent(_component_Col, { col: "sm-12 md-9 lg-6" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_Card, { "background-color": "info-subtle" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_CardHeader, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<div data-v-07d41c7c${_scopeId5}><b data-v-07d41c7c${_scopeId5}>Id</b> from route: ${ssrInterpolate(unref(l_id))}</div>`);
                                    _push6(ssrRenderComponent(_component_IconBox, {
                                      icon: "bi:heart-fill",
                                      size: "lg",
                                      color: checkFav(unref(l_id)),
                                      onClick: ($event) => setFav(unref(currentItem))
                                    }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode("div", null, [
                                        createVNode("b", null, "Id"),
                                        createTextVNode(" from route: " + toDisplayString(unref(l_id)), 1)
                                      ]),
                                      createVNode(_component_IconBox, {
                                        icon: "bi:heart-fill",
                                        size: "lg",
                                        color: checkFav(unref(l_id)),
                                        onClick: ($event) => setFav(unref(currentItem))
                                      }, null, 8, ["color", "onClick"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_CardBody, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_CardTitle, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`${ssrInterpolate(unref(currentItem).name)}`);
                                        } else {
                                          return [
                                            createTextVNode(toDisplayString(unref(currentItem).name), 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_CardText, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`<p data-v-07d41c7c${_scopeId6}><b data-v-07d41c7c${_scopeId6}>Type:</b> ${ssrInterpolate(unref(currentItem).type)}</p><p data-v-07d41c7c${_scopeId6}><b data-v-07d41c7c${_scopeId6}>Dimension:</b> ${ssrInterpolate(unref(currentItem).dimension)}</p>`);
                                          if (unref(currentItem).residents) {
                                            _push7(`<p data-v-07d41c7c${_scopeId6}><b data-v-07d41c7c${_scopeId6}>Characters:</b></p>`);
                                          } else {
                                            _push7(`<!---->`);
                                          }
                                          if (unref(currentItem).residents) {
                                            _push7(`<div data-v-07d41c7c${_scopeId6}><!--[-->`);
                                            ssrRenderList(unref(currentItem).residents, (character) => {
                                              _push7(ssrRenderComponent(_component_Anchor, {
                                                button: "",
                                                size: "sm",
                                                color: "outline-primary",
                                                to: getLink(character)
                                              }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`${ssrInterpolate(getLinkName(character))}`);
                                                  } else {
                                                    return [
                                                      createTextVNode(toDisplayString(getLinkName(character)), 1)
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                            });
                                            _push7(`<!--]--></div>`);
                                          } else {
                                            _push7(`<!---->`);
                                          }
                                        } else {
                                          return [
                                            createVNode("p", null, [
                                              createVNode("b", null, "Type:"),
                                              createTextVNode(" " + toDisplayString(unref(currentItem).type), 1)
                                            ]),
                                            createVNode("p", null, [
                                              createVNode("b", null, "Dimension:"),
                                              createTextVNode(" " + toDisplayString(unref(currentItem).dimension), 1)
                                            ]),
                                            unref(currentItem).residents ? (openBlock(), createBlock("p", { key: 0 }, [
                                              createVNode("b", null, "Characters:")
                                            ])) : createCommentVNode("", true),
                                            unref(currentItem).residents ? (openBlock(), createBlock("div", { key: 1 }, [
                                              (openBlock(true), createBlock(Fragment, null, renderList(unref(currentItem).residents, (character) => {
                                                return openBlock(), createBlock(_component_Anchor, {
                                                  button: "",
                                                  size: "sm",
                                                  color: "outline-primary",
                                                  to: getLink(character)
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(getLinkName(character)), 1)
                                                  ]),
                                                  _: 2
                                                }, 1032, ["to"]);
                                              }), 256))
                                            ])) : createCommentVNode("", true)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_CardTitle, null, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(unref(currentItem).name), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_CardText, null, {
                                        default: withCtx(() => [
                                          createVNode("p", null, [
                                            createVNode("b", null, "Type:"),
                                            createTextVNode(" " + toDisplayString(unref(currentItem).type), 1)
                                          ]),
                                          createVNode("p", null, [
                                            createVNode("b", null, "Dimension:"),
                                            createTextVNode(" " + toDisplayString(unref(currentItem).dimension), 1)
                                          ]),
                                          unref(currentItem).residents ? (openBlock(), createBlock("p", { key: 0 }, [
                                            createVNode("b", null, "Characters:")
                                          ])) : createCommentVNode("", true),
                                          unref(currentItem).residents ? (openBlock(), createBlock("div", { key: 1 }, [
                                            (openBlock(true), createBlock(Fragment, null, renderList(unref(currentItem).residents, (character) => {
                                              return openBlock(), createBlock(_component_Anchor, {
                                                button: "",
                                                size: "sm",
                                                color: "outline-primary",
                                                to: getLink(character)
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(getLinkName(character)), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["to"]);
                                            }), 256))
                                          ])) : createCommentVNode("", true)
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_CardFooter, { "text-color": "body-secondary" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<b data-v-07d41c7c${_scopeId5}>Created:</b> ${ssrInterpolate(unref(currentItem).created)}`);
                                  } else {
                                    return [
                                      createVNode("b", null, "Created:"),
                                      createTextVNode(" " + toDisplayString(unref(currentItem).created), 1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_CardHeader, null, {
                                  default: withCtx(() => [
                                    createVNode("div", null, [
                                      createVNode("b", null, "Id"),
                                      createTextVNode(" from route: " + toDisplayString(unref(l_id)), 1)
                                    ]),
                                    createVNode(_component_IconBox, {
                                      icon: "bi:heart-fill",
                                      size: "lg",
                                      color: checkFav(unref(l_id)),
                                      onClick: ($event) => setFav(unref(currentItem))
                                    }, null, 8, ["color", "onClick"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_CardBody, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_CardTitle, null, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(unref(currentItem).name), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_CardText, null, {
                                      default: withCtx(() => [
                                        createVNode("p", null, [
                                          createVNode("b", null, "Type:"),
                                          createTextVNode(" " + toDisplayString(unref(currentItem).type), 1)
                                        ]),
                                        createVNode("p", null, [
                                          createVNode("b", null, "Dimension:"),
                                          createTextVNode(" " + toDisplayString(unref(currentItem).dimension), 1)
                                        ]),
                                        unref(currentItem).residents ? (openBlock(), createBlock("p", { key: 0 }, [
                                          createVNode("b", null, "Characters:")
                                        ])) : createCommentVNode("", true),
                                        unref(currentItem).residents ? (openBlock(), createBlock("div", { key: 1 }, [
                                          (openBlock(true), createBlock(Fragment, null, renderList(unref(currentItem).residents, (character) => {
                                            return openBlock(), createBlock(_component_Anchor, {
                                              button: "",
                                              size: "sm",
                                              color: "outline-primary",
                                              to: getLink(character)
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(getLinkName(character)), 1)
                                              ]),
                                              _: 2
                                            }, 1032, ["to"]);
                                          }), 256))
                                        ])) : createCommentVNode("", true)
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_CardFooter, { "text-color": "body-secondary" }, {
                                  default: withCtx(() => [
                                    createVNode("b", null, "Created:"),
                                    createTextVNode(" " + toDisplayString(unref(currentItem).created), 1)
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_Card, { "background-color": "info-subtle" }, {
                            default: withCtx(() => [
                              createVNode(_component_CardHeader, null, {
                                default: withCtx(() => [
                                  createVNode("div", null, [
                                    createVNode("b", null, "Id"),
                                    createTextVNode(" from route: " + toDisplayString(unref(l_id)), 1)
                                  ]),
                                  createVNode(_component_IconBox, {
                                    icon: "bi:heart-fill",
                                    size: "lg",
                                    color: checkFav(unref(l_id)),
                                    onClick: ($event) => setFav(unref(currentItem))
                                  }, null, 8, ["color", "onClick"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_CardBody, null, {
                                default: withCtx(() => [
                                  createVNode(_component_CardTitle, null, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(unref(currentItem).name), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_CardText, null, {
                                    default: withCtx(() => [
                                      createVNode("p", null, [
                                        createVNode("b", null, "Type:"),
                                        createTextVNode(" " + toDisplayString(unref(currentItem).type), 1)
                                      ]),
                                      createVNode("p", null, [
                                        createVNode("b", null, "Dimension:"),
                                        createTextVNode(" " + toDisplayString(unref(currentItem).dimension), 1)
                                      ]),
                                      unref(currentItem).residents ? (openBlock(), createBlock("p", { key: 0 }, [
                                        createVNode("b", null, "Characters:")
                                      ])) : createCommentVNode("", true),
                                      unref(currentItem).residents ? (openBlock(), createBlock("div", { key: 1 }, [
                                        (openBlock(true), createBlock(Fragment, null, renderList(unref(currentItem).residents, (character) => {
                                          return openBlock(), createBlock(_component_Anchor, {
                                            button: "",
                                            size: "sm",
                                            color: "outline-primary",
                                            to: getLink(character)
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(getLinkName(character)), 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["to"]);
                                        }), 256))
                                      ])) : createCommentVNode("", true)
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(_component_CardFooter, { "text-color": "body-secondary" }, {
                                default: withCtx(() => [
                                  createVNode("b", null, "Created:"),
                                  createTextVNode(" " + toDisplayString(unref(currentItem).created), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("h4", { class: "title" }, "\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u043B\u043E\u043A\u0430\u0446\u0438\u0438"),
                    createVNode(_component_Col, { col: "sm-12 md-9 lg-6" }, {
                      default: withCtx(() => [
                        createVNode(_component_Card, { "background-color": "info-subtle" }, {
                          default: withCtx(() => [
                            createVNode(_component_CardHeader, null, {
                              default: withCtx(() => [
                                createVNode("div", null, [
                                  createVNode("b", null, "Id"),
                                  createTextVNode(" from route: " + toDisplayString(unref(l_id)), 1)
                                ]),
                                createVNode(_component_IconBox, {
                                  icon: "bi:heart-fill",
                                  size: "lg",
                                  color: checkFav(unref(l_id)),
                                  onClick: ($event) => setFav(unref(currentItem))
                                }, null, 8, ["color", "onClick"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_CardBody, null, {
                              default: withCtx(() => [
                                createVNode(_component_CardTitle, null, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(unref(currentItem).name), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_CardText, null, {
                                  default: withCtx(() => [
                                    createVNode("p", null, [
                                      createVNode("b", null, "Type:"),
                                      createTextVNode(" " + toDisplayString(unref(currentItem).type), 1)
                                    ]),
                                    createVNode("p", null, [
                                      createVNode("b", null, "Dimension:"),
                                      createTextVNode(" " + toDisplayString(unref(currentItem).dimension), 1)
                                    ]),
                                    unref(currentItem).residents ? (openBlock(), createBlock("p", { key: 0 }, [
                                      createVNode("b", null, "Characters:")
                                    ])) : createCommentVNode("", true),
                                    unref(currentItem).residents ? (openBlock(), createBlock("div", { key: 1 }, [
                                      (openBlock(true), createBlock(Fragment, null, renderList(unref(currentItem).residents, (character) => {
                                        return openBlock(), createBlock(_component_Anchor, {
                                          button: "",
                                          size: "sm",
                                          color: "outline-primary",
                                          to: getLink(character)
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(getLinkName(character)), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["to"]);
                                      }), 256))
                                    ])) : createCommentVNode("", true)
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_CardFooter, { "text-color": "body-secondary" }, {
                              default: withCtx(() => [
                                createVNode("b", null, "Created:"),
                                createTextVNode(" " + toDisplayString(unref(currentItem).created), 1)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Row, null, {
                default: withCtx(() => [
                  createVNode("h4", { class: "title" }, "\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u043B\u043E\u043A\u0430\u0446\u0438\u0438"),
                  createVNode(_component_Col, { col: "sm-12 md-9 lg-6" }, {
                    default: withCtx(() => [
                      createVNode(_component_Card, { "background-color": "info-subtle" }, {
                        default: withCtx(() => [
                          createVNode(_component_CardHeader, null, {
                            default: withCtx(() => [
                              createVNode("div", null, [
                                createVNode("b", null, "Id"),
                                createTextVNode(" from route: " + toDisplayString(unref(l_id)), 1)
                              ]),
                              createVNode(_component_IconBox, {
                                icon: "bi:heart-fill",
                                size: "lg",
                                color: checkFav(unref(l_id)),
                                onClick: ($event) => setFav(unref(currentItem))
                              }, null, 8, ["color", "onClick"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_CardBody, null, {
                            default: withCtx(() => [
                              createVNode(_component_CardTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(unref(currentItem).name), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(_component_CardText, null, {
                                default: withCtx(() => [
                                  createVNode("p", null, [
                                    createVNode("b", null, "Type:"),
                                    createTextVNode(" " + toDisplayString(unref(currentItem).type), 1)
                                  ]),
                                  createVNode("p", null, [
                                    createVNode("b", null, "Dimension:"),
                                    createTextVNode(" " + toDisplayString(unref(currentItem).dimension), 1)
                                  ]),
                                  unref(currentItem).residents ? (openBlock(), createBlock("p", { key: 0 }, [
                                    createVNode("b", null, "Characters:")
                                  ])) : createCommentVNode("", true),
                                  unref(currentItem).residents ? (openBlock(), createBlock("div", { key: 1 }, [
                                    (openBlock(true), createBlock(Fragment, null, renderList(unref(currentItem).residents, (character) => {
                                      return openBlock(), createBlock(_component_Anchor, {
                                        button: "",
                                        size: "sm",
                                        color: "outline-primary",
                                        to: getLink(character)
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(getLinkName(character)), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["to"]);
                                    }), 256))
                                  ])) : createCommentVNode("", true)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_CardFooter, { "text-color": "body-secondary" }, {
                            default: withCtx(() => [
                              createVNode("b", null, "Created:"),
                              createTextVNode(" " + toDisplayString(unref(currentItem).created), 1)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/locations/location-[l_id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};
const location__l_id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-07d41c7c"]]);

export { location__l_id_ as default };
//# sourceMappingURL=location-_l_id_-CeZvtHZF.mjs.map
