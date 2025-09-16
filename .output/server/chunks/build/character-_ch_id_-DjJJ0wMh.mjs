import { _ as __nuxt_component_0, a as __nuxt_component_1, b as __nuxt_component_5$1 } from './IconBox-DdRdT_MU.mjs';
import { _ as __nuxt_component_2, a as __nuxt_component_3, b as __nuxt_component_4, c as __nuxt_component_6, d as __nuxt_component_7, e as __nuxt_component_8$1, f as __nuxt_component_9, g as __nuxt_component_10 } from './CardFooter-Cyos2gy6.mjs';
import { defineComponent, h, useSSRContext, computed, withAsyncContext, withCtx, unref, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList } from 'vue';
import { B as BlockProps, u as useBlock, a as useCharactersStore, b as useFavoritesStore } from './index-MUHduU45.mjs';
import { h as hProps, _ as _export_sfc, a as useRoute } from './server.mjs';
import { _ as __nuxt_component_8 } from './Badge-CIN0rxEu.mjs';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
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

const ImageProps = {
  fluid: {
    type: Boolean
  },
  thumbnail: {
    type: Boolean
    // top,end,bottom,start,circle,pill
  }
};
function useImg(props) {
  return {
    class: computed(() => {
      return {
        "img-fluid": props.fluid,
        "img-thumbnail": props.thumbnail
      };
    }),
    attr: {
      loading: "lazy"
    }
  };
}
const __nuxt_component_5 = defineComponent({
  name: "CardImgTop",
  props: {
    ...BlockProps,
    ...ImageProps,
    tag: {
      type: String,
      default: "img"
    }
  },
  setup(props, context) {
    const img = useImg(props);
    const block = useBlock(props);
    const current = {
      class: {
        "card-img-top": true
      },
      attr: {
        loading: "lazy"
      }
    };
    return () => h(props.tag, hProps(current, img, block), context.slots);
  }
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "character-[ch_id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { ch_id } = useRoute().params;
    const myStore = useCharactersStore();
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
    const getLinkName = (data) => {
      const array = data.split("/");
      return array[array.length - 1];
    };
    const getLink = (data) => {
      const number = getLinkName(data);
      return `/episodes/episode-${number}`;
    };
    const checkStatus = (status) => {
      return status === "Alive" ? "danger" : status === "Dead" ? "dark" : "secondary";
    };
    const checkFav = (id) => {
      const inFavorites = findItem(favStore.characters, id);
      return inFavorites ? "pink" : "white";
    };
    const setFav = (item) => {
      const inFavorites = findItem(favStore.characters, ch_id);
      if (!inFavorites) {
        favStore.addFavCharacter(item);
      } else {
        favStore.removeFavCharacter(item);
      }
    };
    const currentItem = ([__temp, __restore] = withAsyncContext(() => myStore.fetchCharacterById(ch_id)), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Container = __nuxt_component_0;
      const _component_Row = __nuxt_component_1;
      const _component_Col = __nuxt_component_2;
      const _component_Card = __nuxt_component_3;
      const _component_IconBox = __nuxt_component_5$1;
      const _component_CardImgTop = __nuxt_component_5;
      const _component_CardHeader = __nuxt_component_4;
      const _component_CardBody = __nuxt_component_6;
      const _component_CardTitle = __nuxt_component_7;
      const _component_Badge = __nuxt_component_8;
      const _component_CardText = __nuxt_component_8$1;
      const _component_Anchor = __nuxt_component_9;
      const _component_CardFooter = __nuxt_component_10;
      _push(ssrRenderComponent(_component_Container, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Row, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h4 class="title" data-v-34de0557${_scopeId2}>\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u0436\u0430</h4>`);
                  if (unref(currentItem)) {
                    _push3(ssrRenderComponent(_component_Col, { col: "sm-12 md-9 lg-6" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_Card, { "background-color": "info-subtle" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_IconBox, {
                                  icon: "bi:heart-fill",
                                  size: "lg",
                                  color: checkFav(unref(ch_id)),
                                  onClick: ($event) => setFav(unref(currentItem))
                                }, null, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(_component_CardImgTop, {
                                  src: unref(currentItem).image,
                                  alt: unref(currentItem).name
                                }, null, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(_component_CardHeader, null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<b data-v-34de0557${_scopeId5}>Id</b> from route: ${ssrInterpolate(unref(ch_id))}`);
                                    } else {
                                      return [
                                        createVNode("b", null, "Id"),
                                        createTextVNode(" from route: " + toDisplayString(unref(ch_id)), 1)
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
                                            _push7(`${ssrInterpolate(unref(currentItem).name)} `);
                                            _push7(ssrRenderComponent(_component_Badge, {
                                              color: checkStatus(unref(currentItem).status)
                                            }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`${ssrInterpolate(unref(currentItem).status)}`);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString(unref(currentItem).status), 1)
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createTextVNode(toDisplayString(unref(currentItem).name) + " ", 1),
                                              createVNode(_component_Badge, {
                                                color: checkStatus(unref(currentItem).status)
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(unref(currentItem).status), 1)
                                                ]),
                                                _: 1
                                              }, 8, ["color"])
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_CardText, null, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<p data-v-34de0557${_scopeId6}><b data-v-34de0557${_scopeId6}>Gender:</b> ${ssrInterpolate(unref(currentItem).gender)}</p><p data-v-34de0557${_scopeId6}><b data-v-34de0557${_scopeId6}>Specie:</b> ${ssrInterpolate(unref(currentItem).species)}</p><p data-v-34de0557${_scopeId6}><b data-v-34de0557${_scopeId6}>Origin:</b> ${ssrInterpolate(unref(currentItem).origin["name"])}</p><p data-v-34de0557${_scopeId6}><b data-v-34de0557${_scopeId6}>Location:</b> ${ssrInterpolate(unref(currentItem).location["name"])}</p>`);
                                            if (unref(currentItem).episode) {
                                              _push7(`<p data-v-34de0557${_scopeId6}><b data-v-34de0557${_scopeId6}>In episodes:</b></p>`);
                                            } else {
                                              _push7(`<!---->`);
                                            }
                                            if (unref(currentItem).episode) {
                                              _push7(`<div data-v-34de0557${_scopeId6}><!--[-->`);
                                              ssrRenderList(unref(currentItem).episode, (episode) => {
                                                _push7(ssrRenderComponent(_component_Anchor, {
                                                  button: "",
                                                  size: "sm",
                                                  color: "outline-primary",
                                                  to: getLink(episode)
                                                }, {
                                                  default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                    if (_push8) {
                                                      _push8(`${ssrInterpolate(getLinkName(episode))}`);
                                                    } else {
                                                      return [
                                                        createTextVNode(toDisplayString(getLinkName(episode)), 1)
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
                                                createVNode("b", null, "Gender:"),
                                                createTextVNode(" " + toDisplayString(unref(currentItem).gender), 1)
                                              ]),
                                              createVNode("p", null, [
                                                createVNode("b", null, "Specie:"),
                                                createTextVNode(" " + toDisplayString(unref(currentItem).species), 1)
                                              ]),
                                              createVNode("p", null, [
                                                createVNode("b", null, "Origin:"),
                                                createTextVNode(" " + toDisplayString(unref(currentItem).origin["name"]), 1)
                                              ]),
                                              createVNode("p", null, [
                                                createVNode("b", null, "Location:"),
                                                createTextVNode(" " + toDisplayString(unref(currentItem).location["name"]), 1)
                                              ]),
                                              unref(currentItem).episode ? (openBlock(), createBlock("p", { key: 0 }, [
                                                createVNode("b", null, "In episodes:")
                                              ])) : createCommentVNode("", true),
                                              unref(currentItem).episode ? (openBlock(), createBlock("div", { key: 1 }, [
                                                (openBlock(true), createBlock(Fragment, null, renderList(unref(currentItem).episode, (episode) => {
                                                  return openBlock(), createBlock(_component_Anchor, {
                                                    button: "",
                                                    size: "sm",
                                                    color: "outline-primary",
                                                    to: getLink(episode)
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(getLinkName(episode)), 1)
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
                                            createTextVNode(toDisplayString(unref(currentItem).name) + " ", 1),
                                            createVNode(_component_Badge, {
                                              color: checkStatus(unref(currentItem).status)
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(unref(currentItem).status), 1)
                                              ]),
                                              _: 1
                                            }, 8, ["color"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_CardText, null, {
                                          default: withCtx(() => [
                                            createVNode("p", null, [
                                              createVNode("b", null, "Gender:"),
                                              createTextVNode(" " + toDisplayString(unref(currentItem).gender), 1)
                                            ]),
                                            createVNode("p", null, [
                                              createVNode("b", null, "Specie:"),
                                              createTextVNode(" " + toDisplayString(unref(currentItem).species), 1)
                                            ]),
                                            createVNode("p", null, [
                                              createVNode("b", null, "Origin:"),
                                              createTextVNode(" " + toDisplayString(unref(currentItem).origin["name"]), 1)
                                            ]),
                                            createVNode("p", null, [
                                              createVNode("b", null, "Location:"),
                                              createTextVNode(" " + toDisplayString(unref(currentItem).location["name"]), 1)
                                            ]),
                                            unref(currentItem).episode ? (openBlock(), createBlock("p", { key: 0 }, [
                                              createVNode("b", null, "In episodes:")
                                            ])) : createCommentVNode("", true),
                                            unref(currentItem).episode ? (openBlock(), createBlock("div", { key: 1 }, [
                                              (openBlock(true), createBlock(Fragment, null, renderList(unref(currentItem).episode, (episode) => {
                                                return openBlock(), createBlock(_component_Anchor, {
                                                  button: "",
                                                  size: "sm",
                                                  color: "outline-primary",
                                                  to: getLink(episode)
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(getLinkName(episode)), 1)
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
                                      _push6(`<b data-v-34de0557${_scopeId5}>Created:</b> ${ssrInterpolate(unref(currentItem).created)}`);
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
                                  createVNode(_component_IconBox, {
                                    icon: "bi:heart-fill",
                                    size: "lg",
                                    color: checkFav(unref(ch_id)),
                                    onClick: ($event) => setFav(unref(currentItem))
                                  }, null, 8, ["color", "onClick"]),
                                  createVNode(_component_CardImgTop, {
                                    src: unref(currentItem).image,
                                    alt: unref(currentItem).name
                                  }, null, 8, ["src", "alt"]),
                                  createVNode(_component_CardHeader, null, {
                                    default: withCtx(() => [
                                      createVNode("b", null, "Id"),
                                      createTextVNode(" from route: " + toDisplayString(unref(ch_id)), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_CardBody, null, {
                                    default: withCtx(() => [
                                      createVNode(_component_CardTitle, null, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(unref(currentItem).name) + " ", 1),
                                          createVNode(_component_Badge, {
                                            color: checkStatus(unref(currentItem).status)
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(unref(currentItem).status), 1)
                                            ]),
                                            _: 1
                                          }, 8, ["color"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_CardText, null, {
                                        default: withCtx(() => [
                                          createVNode("p", null, [
                                            createVNode("b", null, "Gender:"),
                                            createTextVNode(" " + toDisplayString(unref(currentItem).gender), 1)
                                          ]),
                                          createVNode("p", null, [
                                            createVNode("b", null, "Specie:"),
                                            createTextVNode(" " + toDisplayString(unref(currentItem).species), 1)
                                          ]),
                                          createVNode("p", null, [
                                            createVNode("b", null, "Origin:"),
                                            createTextVNode(" " + toDisplayString(unref(currentItem).origin["name"]), 1)
                                          ]),
                                          createVNode("p", null, [
                                            createVNode("b", null, "Location:"),
                                            createTextVNode(" " + toDisplayString(unref(currentItem).location["name"]), 1)
                                          ]),
                                          unref(currentItem).episode ? (openBlock(), createBlock("p", { key: 0 }, [
                                            createVNode("b", null, "In episodes:")
                                          ])) : createCommentVNode("", true),
                                          unref(currentItem).episode ? (openBlock(), createBlock("div", { key: 1 }, [
                                            (openBlock(true), createBlock(Fragment, null, renderList(unref(currentItem).episode, (episode) => {
                                              return openBlock(), createBlock(_component_Anchor, {
                                                button: "",
                                                size: "sm",
                                                color: "outline-primary",
                                                to: getLink(episode)
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(getLinkName(episode)), 1)
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
                                createVNode(_component_IconBox, {
                                  icon: "bi:heart-fill",
                                  size: "lg",
                                  color: checkFav(unref(ch_id)),
                                  onClick: ($event) => setFav(unref(currentItem))
                                }, null, 8, ["color", "onClick"]),
                                createVNode(_component_CardImgTop, {
                                  src: unref(currentItem).image,
                                  alt: unref(currentItem).name
                                }, null, 8, ["src", "alt"]),
                                createVNode(_component_CardHeader, null, {
                                  default: withCtx(() => [
                                    createVNode("b", null, "Id"),
                                    createTextVNode(" from route: " + toDisplayString(unref(ch_id)), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_CardBody, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_CardTitle, null, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(unref(currentItem).name) + " ", 1),
                                        createVNode(_component_Badge, {
                                          color: checkStatus(unref(currentItem).status)
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(unref(currentItem).status), 1)
                                          ]),
                                          _: 1
                                        }, 8, ["color"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_CardText, null, {
                                      default: withCtx(() => [
                                        createVNode("p", null, [
                                          createVNode("b", null, "Gender:"),
                                          createTextVNode(" " + toDisplayString(unref(currentItem).gender), 1)
                                        ]),
                                        createVNode("p", null, [
                                          createVNode("b", null, "Specie:"),
                                          createTextVNode(" " + toDisplayString(unref(currentItem).species), 1)
                                        ]),
                                        createVNode("p", null, [
                                          createVNode("b", null, "Origin:"),
                                          createTextVNode(" " + toDisplayString(unref(currentItem).origin["name"]), 1)
                                        ]),
                                        createVNode("p", null, [
                                          createVNode("b", null, "Location:"),
                                          createTextVNode(" " + toDisplayString(unref(currentItem).location["name"]), 1)
                                        ]),
                                        unref(currentItem).episode ? (openBlock(), createBlock("p", { key: 0 }, [
                                          createVNode("b", null, "In episodes:")
                                        ])) : createCommentVNode("", true),
                                        unref(currentItem).episode ? (openBlock(), createBlock("div", { key: 1 }, [
                                          (openBlock(true), createBlock(Fragment, null, renderList(unref(currentItem).episode, (episode) => {
                                            return openBlock(), createBlock(_component_Anchor, {
                                              button: "",
                                              size: "sm",
                                              color: "outline-primary",
                                              to: getLink(episode)
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(getLinkName(episode)), 1)
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
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    createVNode("h4", { class: "title" }, "\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u0436\u0430"),
                    unref(currentItem) ? (openBlock(), createBlock(_component_Col, {
                      key: 0,
                      col: "sm-12 md-9 lg-6"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_Card, { "background-color": "info-subtle" }, {
                          default: withCtx(() => [
                            createVNode(_component_IconBox, {
                              icon: "bi:heart-fill",
                              size: "lg",
                              color: checkFav(unref(ch_id)),
                              onClick: ($event) => setFav(unref(currentItem))
                            }, null, 8, ["color", "onClick"]),
                            createVNode(_component_CardImgTop, {
                              src: unref(currentItem).image,
                              alt: unref(currentItem).name
                            }, null, 8, ["src", "alt"]),
                            createVNode(_component_CardHeader, null, {
                              default: withCtx(() => [
                                createVNode("b", null, "Id"),
                                createTextVNode(" from route: " + toDisplayString(unref(ch_id)), 1)
                              ]),
                              _: 1
                            }),
                            createVNode(_component_CardBody, null, {
                              default: withCtx(() => [
                                createVNode(_component_CardTitle, null, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(unref(currentItem).name) + " ", 1),
                                    createVNode(_component_Badge, {
                                      color: checkStatus(unref(currentItem).status)
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(unref(currentItem).status), 1)
                                      ]),
                                      _: 1
                                    }, 8, ["color"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_CardText, null, {
                                  default: withCtx(() => [
                                    createVNode("p", null, [
                                      createVNode("b", null, "Gender:"),
                                      createTextVNode(" " + toDisplayString(unref(currentItem).gender), 1)
                                    ]),
                                    createVNode("p", null, [
                                      createVNode("b", null, "Specie:"),
                                      createTextVNode(" " + toDisplayString(unref(currentItem).species), 1)
                                    ]),
                                    createVNode("p", null, [
                                      createVNode("b", null, "Origin:"),
                                      createTextVNode(" " + toDisplayString(unref(currentItem).origin["name"]), 1)
                                    ]),
                                    createVNode("p", null, [
                                      createVNode("b", null, "Location:"),
                                      createTextVNode(" " + toDisplayString(unref(currentItem).location["name"]), 1)
                                    ]),
                                    unref(currentItem).episode ? (openBlock(), createBlock("p", { key: 0 }, [
                                      createVNode("b", null, "In episodes:")
                                    ])) : createCommentVNode("", true),
                                    unref(currentItem).episode ? (openBlock(), createBlock("div", { key: 1 }, [
                                      (openBlock(true), createBlock(Fragment, null, renderList(unref(currentItem).episode, (episode) => {
                                        return openBlock(), createBlock(_component_Anchor, {
                                          button: "",
                                          size: "sm",
                                          color: "outline-primary",
                                          to: getLink(episode)
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(getLinkName(episode)), 1)
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
                    })) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Row, null, {
                default: withCtx(() => [
                  createVNode("h4", { class: "title" }, "\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u0436\u0430"),
                  unref(currentItem) ? (openBlock(), createBlock(_component_Col, {
                    key: 0,
                    col: "sm-12 md-9 lg-6"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_Card, { "background-color": "info-subtle" }, {
                        default: withCtx(() => [
                          createVNode(_component_IconBox, {
                            icon: "bi:heart-fill",
                            size: "lg",
                            color: checkFav(unref(ch_id)),
                            onClick: ($event) => setFav(unref(currentItem))
                          }, null, 8, ["color", "onClick"]),
                          createVNode(_component_CardImgTop, {
                            src: unref(currentItem).image,
                            alt: unref(currentItem).name
                          }, null, 8, ["src", "alt"]),
                          createVNode(_component_CardHeader, null, {
                            default: withCtx(() => [
                              createVNode("b", null, "Id"),
                              createTextVNode(" from route: " + toDisplayString(unref(ch_id)), 1)
                            ]),
                            _: 1
                          }),
                          createVNode(_component_CardBody, null, {
                            default: withCtx(() => [
                              createVNode(_component_CardTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(unref(currentItem).name) + " ", 1),
                                  createVNode(_component_Badge, {
                                    color: checkStatus(unref(currentItem).status)
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(unref(currentItem).status), 1)
                                    ]),
                                    _: 1
                                  }, 8, ["color"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_CardText, null, {
                                default: withCtx(() => [
                                  createVNode("p", null, [
                                    createVNode("b", null, "Gender:"),
                                    createTextVNode(" " + toDisplayString(unref(currentItem).gender), 1)
                                  ]),
                                  createVNode("p", null, [
                                    createVNode("b", null, "Specie:"),
                                    createTextVNode(" " + toDisplayString(unref(currentItem).species), 1)
                                  ]),
                                  createVNode("p", null, [
                                    createVNode("b", null, "Origin:"),
                                    createTextVNode(" " + toDisplayString(unref(currentItem).origin["name"]), 1)
                                  ]),
                                  createVNode("p", null, [
                                    createVNode("b", null, "Location:"),
                                    createTextVNode(" " + toDisplayString(unref(currentItem).location["name"]), 1)
                                  ]),
                                  unref(currentItem).episode ? (openBlock(), createBlock("p", { key: 0 }, [
                                    createVNode("b", null, "In episodes:")
                                  ])) : createCommentVNode("", true),
                                  unref(currentItem).episode ? (openBlock(), createBlock("div", { key: 1 }, [
                                    (openBlock(true), createBlock(Fragment, null, renderList(unref(currentItem).episode, (episode) => {
                                      return openBlock(), createBlock(_component_Anchor, {
                                        button: "",
                                        size: "sm",
                                        color: "outline-primary",
                                        to: getLink(episode)
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(getLinkName(episode)), 1)
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
                  })) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/characters/character-[ch_id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};
const character__ch_id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-34de0557"]]);

export { character__ch_id_ as default };
//# sourceMappingURL=character-_ch_id_-DjJJ0wMh.mjs.map
