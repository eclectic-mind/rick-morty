import { n as addClassNames$1, y as hasValue, z as isPropDefined, b as addProp, x as spacing, o as useRuntimeConfig } from './server.mjs';
import { isNumber, isString, startsWith, toString } from 'lodash-es';
import { computed } from 'vue';
import { defineStore } from 'pinia';

function includesPresets(name, value) {
  var _a;
  if (!isString(value)) {
    return false;
  }
  const uboptions = useRuntimeConfig().public.usebootstrap;
  const presets = (_a = uboptions.bootstrap) == null ? undefined : _a.presets;
  if (!presets) {
    return false;
  }
  const params = presets[name];
  if (!params) {
    return false;
  }
  return params == null ? undefined : params.includes(value);
}
const ElementProps = {
  tag: {
    type: String
  }
};
const InlineProps = {
  ...ElementProps,
  fontSize: {
    type: [String, Number]
    // 1～6
  },
  fontWeight: {
    type: String
    // bold,bolder,normal,light,lighter
  },
  fontStyle: {
    type: String
    // italic,normal
  },
  lineHeight: {
    type: String
    // l,sm,base,lg
  },
  fontMonospace: {
    type: Boolean
  },
  fontFamily: {
    type: String
    // https://nuxt.com/modules/fonts
  },
  textReset: {
    type: Boolean
  },
  textDecoration: {
    type: String
    // underline,line-through,none
  },
  textTruncate: {
    type: Boolean
  },
  textOpacity: {
    type: [String, Number]
    //
  },
  textTransform: {
    type: String
    // lowercase,uppercase,capitalize
  },
  textBackground: {
    type: String
    //
  },
  headings: {
    type: [String, Number]
    // 1～6
  },
  displayHeadings: {
    type: [Number, String]
    // 1～6
  },
  lead: {
    type: Boolean
  },
  mark: {
    type: Boolean
  },
  small: {
    type: Boolean
  },
  textColor: {
    type: String
  },
  padding: {
    type: [String, Number, Array]
  },
  margin: {
    type: [String, Number, Array]
  },
  display: {
    type: [String, Array]
    // Flexはflex属性を使用
  },
  gap: {
    type: [String, Number, Array]
  },
  visuallyHidden: {
    type: [Boolean, String]
    // focusable
  },
  verticalAlign: {
    type: String
    // baseline, top, middle, bottom , text-top, text-bottom
  },
  visible: {
    type: Boolean
  },
  invisible: {
    type: Boolean
  },
  userSelect: {
    type: String
    // all, auto, none
  },
  pointerEvents: {
    type: String
    // none, auto
  },
  backgroundColor: {
    type: String
    // as PropType<ThemeColors>,
  },
  backgroundGradient: {
    type: Boolean
  },
  backgroundImage: {
    type: String
  },
  backgroundOpacity: {
    type: [String, Number]
  },
  opacity: {
    type: [String, Number]
  },
  relativeWidth: {
    // w-25 w-50 w-75 w-100 w-auto
    type: [String, Number]
    // 25 50 75 100 auto
  },
  relativeHeight: {
    // h-25 h-50 h-75 h-100 h-auto
    type: [String, Number]
    // 25 50 75 100 auto
  },
  maxWidth: {
    // mw-100
    type: Boolean
  },
  maxHeight: {
    // mh-100
    type: Boolean
  },
  viewportWidth: {
    // vw-100
    type: Boolean
  },
  viewportHeight: {
    // vh-100
    type: Boolean
  },
  minViewportWidth: {
    // min-vw-100
    type: Boolean
  },
  minViewportHeight: {
    // min-vh-100
    type: Boolean
  },
  placeholder: {
    type: [Boolean, String]
    // input tagで競合
  },
  placeholderSize: {
    type: String
    // input tagで競合
  },
  col: {
    type: [Number, String, Array, Boolean]
    // auto
  },
  position: {
    type: String
    // static, relative absolute fixed sticky
  },
  top: {
    type: [Number, String]
  },
  start: {
    type: [Number, String]
  },
  end: {
    type: [Number, String]
  },
  bottom: {
    type: [Number, String]
  },
  translate: {
    type: String
  },
  initialism: {
    type: [Boolean]
  },
  focusRing: {
    type: [Boolean]
  },
  border: {
    type: [Boolean, String, Number]
    // true, top,end,bottom,start,0,top-0,end-0,bottom-0,start-0
  },
  borderColor: {
    type: String
    // as PropType<ThemeColors>,
  },
  borderWidth: {
    type: [String, Number]
    // 1,2,3,4,5
  },
  borderSubtractive: {
    type: [Boolean, String]
  },
  rounded: {
    type: [Boolean, String]
  },
  roundedSize: {
    type: [Number, String]
    // 0 - 5
  },
  linkOpacity: {
    type: [String, Number]
  },
  linkUnderline: {
    type: [String]
  },
  linkOffset: {
    type: [String, Number]
  },
  theme: {
    type: String
  }
  // card: {
  //       type: Boolean,
  // },
  // cardHeader: {
  //       type: Boolean,
  // },
  // cardBody: {
  //       type: Boolean,
  // },
  // cardFooter: {
  //       type: Boolean,
  // },
};
function useInline(props) {
  const bgIncludePreset = computed(() => includesPresets("background-color", props.backgroundColor));
  const textColorIncludePreset = computed(() => includesPresets("text-color", props.textColor));
  const borderColorIncludePreset = computed(() => includesPresets("border-color", props.borderColor));
  const textBgIncludePreset = computed(() => includesPresets("text-bg-color", props.textBackground));
  return {
    class: computed(() => {
      return {
        [`fs-${props.fontSize}`]: props.fontSize,
        [`fw-${props.fontWeight}`]: props.fontWeight,
        [`fst-${props.fontStyle}`]: props.fontStyle,
        [`lh-${props.lineHeight}`]: props.lineHeight,
        "font-monospace": props.fontMonospace,
        "text-reset": props.textReset,
        [`text-decoration-${props.textDecoration}`]: props.textDecoration,
        "text-truncate": props.textTruncate,
        [`text-${props.textTransform}`]: props.textTransform,
        [`text-bg-${props.textBackground}`]: props.textBackground && textBgIncludePreset.value,
        [`h${props.headings}`]: props.headings,
        [`display-${props.displayHeadings}`]: props.displayHeadings,
        "lead": props.lead,
        "mark": props.mark,
        "small": props.small,
        [`text-${props.textColor}`]: props.textColor && textColorIncludePreset.value,
        ...addClassNames$1(props.padding, (n) => spacing(n, "p")),
        ...addClassNames$1(props.margin, (n) => spacing(n, "m")),
        ...addClassNames$1(props.gap, (n) => `gap-${n}`),
        [`visually-hidden${hasValue(props.visuallyHidden) ? `-${props.visuallyHidden}` : ""}`]: props.visuallyHidden,
        [`align-${props.verticalAlign}`]: props.verticalAlign,
        "visible": props.visible,
        "invisible": props.invisible,
        [`user-select-${props.userSelect}`]: props.userSelect,
        [`pe-${props.pointerEvents}`]: props.pointerEvents,
        [`bg-${props.backgroundColor}`]: props.backgroundColor && bgIncludePreset.value,
        [`bg-gradient`]: props.backgroundGradient,
        [`bg-opacity-${props.backgroundOpacity}`]: isString(props.backgroundOpacity),
        [`w-${props.relativeWidth}`]: props.relativeWidth,
        [`h-${props.relativeHeight}`]: props.relativeHeight,
        "mw-100": props.maxWidth,
        "mh-100": props.maxHeight,
        "vw-100": props.viewportWidth,
        "vh-100": props.viewportHeight,
        "min-vw-100": props.minViewportWidth,
        "min-vh-100": props.minViewportHeight,
        ...addClassNames$1(props.display, (n) => `d-${n}`),
        [`opacity-${props.opacity}`]: props.opacity,
        [`placeholder${hasValue(props.placeholder) ? `-${props.placeholder}` : ""}`]: (props.placeholder || props.placeholderSize) && !["input", "textarea"].includes(props.tag || ""),
        [`placeholder-${props.placeholderSize}`]: props.placeholderSize && !["input", "textarea"].includes(props.tag || ""),
        "col": props.col && !hasValue(props.col),
        ...addClassNames$1(hasValue(props.col), (n) => `col-${n}`),
        [`position-${props.position}`]: props.position,
        [`top-${props.top}`]: props.top,
        [`start-${props.start}`]: props.start,
        [`end-${props.end}`]: props.end,
        [`bottom-${props.bottom}`]: props.bottom,
        [`translate-${props.translate}`]: props.translate,
        "initialism": props.initialism,
        "focus-ring": props.focusRing,
        "border": props.border && !hasValue(props.border),
        // && (props.borderColor || props.borderWidth || props.borderSubtractive) && !(props.card || props.cardHeader || props.cardBody || props.cardFooter),
        ...addClassNames$1(hasValue(props.border), (n) => `border-${n}`),
        [`border-${props.borderColor}`]: props.borderColor && borderColorIncludePreset.value,
        [`border-${props.borderWidth}`]: props.borderWidth,
        [`border-${hasValue(props.borderSubtractive) ? `${props.borderSubtractive}-` : ""}0`]: props.borderSubtractive,
        [`rounded${hasValue(props.rounded) ? `-${props.rounded}` : ""}`]: props.rounded,
        [`rounded-${props.roundedSize}`]: props.roundedSize,
        [`link-opacity-${props.linkOpacity}`]: props.linkOpacity,
        [`link-underline`]: props.linkUnderline,
        ...addClassNames$1(hasValue(props.linkUnderline), (n) => `link-underline-opacity-${n}`),
        ...addClassNames$1(hasValue(props.linkOffset), (n) => `link-offset-${n}`)
        // [`card`]: props.card, // for border
        // [`card-header`]: props.cardHeader, // for border
        // [`card-body`]: props.cardBody, // for border
        // [`card-footer`]: props.cardFooter, // for border
      };
    }),
    style: computed(() => {
      return {
        ...addProp(props.backgroundImage, "background-image", `url(${props.backgroundImage})`),
        ...addProp(props.fontFamily, "font-family", props.fontFamily),
        // https://github.com/nuxt/fonts
        ...addProp(isNumber(props.backgroundOpacity), "--bs-bg-opacity", `${props.backgroundOpacity}`),
        ...addProp(props.backgroundColor && !bgIncludePreset.value, "background-color", `var(--bs-${props.backgroundColor})`),
        ...addProp(props.textColor && !textColorIncludePreset.value, "color", `var(--bs-${props.textColor})`),
        ...addProp(props.borderColor && !borderColorIncludePreset.value, "border-color", `var(--bs-${props.borderColor}) !important`),
        // `rgba(from var(--bs-${props.borderColor}) r g b / var(--bs-border-opacity)) !important`),
        ...addProp(!props.backgroundColor && props.textBackground && !textBgIncludePreset.value, "background-color", `var(--bs-${props.textBackground})`),
        ...addProp(!props.textColor && props.textBackground && !textBgIncludePreset.value, "color", `var(--bs-contrast-${props.textBackground})`)
      };
    }),
    attr: computed(() => {
      return {
        ...addProp(props.tag != "input" && props.placeholder, "aria-hidden", "true"),
        ...addProp(props.tag == "input" && props.placeholder && isString(props.placeholder), "placeholder", toString(props.placeholder)),
        ...addProp(props.theme, "data-bs-theme", props.theme)
      };
    })
  };
}
const BlockProps = {
  ...InlineProps,
  overlay: {
    type: Boolean
  },
  shadow: {
    type: [String, Boolean]
    // none, sm , lg
  },
  textAlignment: {
    type: [String, Array]
  },
  textWrap: {
    type: String
    // wrap or nowrap
  },
  textBreak: {
    type: Boolean
    //
  },
  alignSelf: {
    type: String
    // start,end,center,baseline,stretch,{breakPoint}-*,
  },
  alignItems: {
    type: String
  },
  alignContent: {
    type: String
  },
  flex: {
    type: [Boolean, String, Array]
    // inline, {breakPoint}, {breakPoint}-inline
  },
  flexDirection: {
    type: [String, Array]
    // {breakPoint}-{row|column}-{reverse}
  },
  flexFill: {
    type: [Boolean, String]
    // {breakPoint}-fill,
  },
  flexGrow: {
    type: String
    // {grow|shrink}-0,{grow|shrink}-1,{breakPoint}-{grow|shrink}-0
  },
  flexShrink: {
    type: String
    // {grow|shrink}-0,{grow|shrink}-1,{breakPoint}-{grow|shrink}-0
  },
  flexHorizontal: {
    type: String
    // {start|end}
  },
  flexVirtical: {
    type: String
    // {top|bottom}
  },
  flexOrder: {
    type: [Number, String]
    // {number|first|last}, {breakPoint}-{number|first|last},
  },
  flexWrap: {
    type: String
    //
  },
  float: {
    type: String
    // start , end , none
  },
  ratio: {
    type: [Boolean, String, Number]
    // true, 1x1,  4x3, 16x9 , 21x9 , 50
  },
  fixed: {
    type: String
    // top, bottom
  },
  sticky: {
    type: String
    // top, bottom
  },
  clearfix: {
    type: Boolean
    //
  },
  overflow: {
    type: [String, Array]
    // auto , hidden , visible , scroll
  },
  tableResponsive: {
    type: String
  },
  justifyContent: {
    type: String
  },
  vstack: {
    type: Boolean
  },
  hstack: {
    type: Boolean
  },
  align: {
    type: [String]
  },
  order: {
    type: [String, Number]
  },
  offset: {
    type: [String, Number, Array]
  },
  objectFit: {
    type: [String]
  },
  z: {
    type: [String, Number]
  },
  theme: {
    type: [String]
  }
};
function useBlock(props) {
  const inline = useInline(props);
  return {
    class: computed(() => {
      return {
        ...inline.class.value,
        "text-break": props.textBreak,
        ...addClassNames$1(props.textAlignment, (n) => `text-${n}`),
        [`text-${props.textWrap}`]: props.textWrap,
        [`align-self-${props.alignSelf}`]: props.alignSelf,
        [`align-items-${props.alignItems}`]: props.alignItems,
        [`align-content-${props.alignContent}`]: props.alignContent,
        ...addClassNames$1(
          props.flex,
          (n) => `d${hasValue(props.flex) ? `-${n}` : ""}-flex`
        ),
        ...addClassNames$1(props.flexDirection, (n) => `flex-${n}`),
        ...addClassNames$1(
          props.flexFill,
          (n) => `flex${hasValue(props.flexFill) ? `-${n}` : ""}-fill`
        ),
        ...addClassNames$1(
          props.flexGrow,
          (n) => isNumber(n) ? `flex-grow-${n}` : !isString(n) ? "" : startsWith(n, "sm") ? `flex-sm-grow-${n}` : startsWith(n, "md") ? `flex-md-grow-${n}` : startsWith(n, "lg") ? `flex-lg-grow-${n}` : startsWith(n, "xl") ? `flex-xl-grow-${n}` : startsWith(n, "xxl") ? `flex-xxl-grow-${n}` : `flex-grow-${n}`
        ),
        ...addClassNames$1(
          props.flexShrink,
          (n) => isNumber(n) ? `flex-shrink-${n}` : !isString(n) ? "" : startsWith(n, "sm") ? `flex-sm-shrink-${n}` : startsWith(n, "md") ? `flex-md-shrink-${n}` : startsWith(n, "lg") ? `flex-lg-shrink-${n}` : startsWith(n, "xl") ? `flex-xl-shrink-${n}` : startsWith(n, "xxl") ? `flex-xxl-shrink-${n}` : `flex-shrink-${n}`
        ),
        // [`flex-${props.flexGrow}`]: props.flexGrow,
        ...addClassNames$1(props.flexWrap, (n) => `flex-${n}`),
        [`order-${props.flexOrder}`]: props.flexOrder,
        [`float-${props.float}`]: props.float,
        [`shadow${hasValue(props.shadow) ? `-${props.shadow}` : ""}`]: isPropDefined(
          props.shadow
        ),
        "ratio": props.ratio,
        [`ratio-${props.ratio}`]: isString(props.ratio),
        [`fixed-${props.fixed}`]: props.fixed,
        [`sticky-${props.sticky}`]: props.sticky,
        "clearfix": props.clearfix,
        ...addClassNames$1(props.overflow, (n) => `overflow-${n}`),
        [`table-responsive${hasValue(props.tableResponsive) ? `-${props.tableResponsive}` : ""}`]: props.tableResponsive,
        [`justify-content-${props.justifyContent}`]: props.justifyContent,
        "vstack": props.vstack,
        "hstack": props.hstack,
        [`align-${props.align}`]: props.align,
        [`order-${props.order}`]: props.order,
        ...addClassNames$1(props.offset, (n) => `offset-${n}`),
        [`object-fit-${props.objectFit}`]: props.objectFit,
        [`z-${props.z}`]: props.z
      };
    }),
    style: computed(() => {
      return {
        ...inline.style.value,
        ...addProp(isNumber(props.ratio), "--bs-aspect-ratio", `${props.ratio}%`)
      };
    }),
    attr: computed(() => {
      return {
        ...inline.attr.value,
        ...addProp(props.theme, "data-bs-theme", props.theme)
      };
    })
  };
}
const useCharactersStore = defineStore("Characters", {
  state: () => ({
    count: 0,
    pages: 0,
    prev: null,
    next: null,
    currentPage: 1,
    items: []
  }),
  actions: {
    init() {
      this.fetchData();
    },
    fetchData() {
      $fetch(`https://rickandmortyapi.com/api/character/?page=${this.currentPage}`).then((response) => {
        this.items = Object.values(response == null ? undefined : response.results);
        const info = response == null ? undefined : response.info;
        this.count = info.count;
        this.pages = info.pages;
        this.prev = info.prev;
        this.next = info.next;
      }).catch((error) => {
        console.error("Error:", error);
      });
    },
    async fetchCharacterById(id) {
      const currentItem = this.items.find((item) => item.id === id);
      if (currentItem) {
        return currentItem;
      }
      return await $fetch(`https://rickandmortyapi.com/api/character/${id}`);
    },
    setCurrentPage(value) {
      if (this.currentPage !== value) {
        this.currentPage = value;
        this.fetchData();
      }
    }
  }
});
const useLocationsStore = defineStore("Locations", {
  state: () => ({
    count: 0,
    pages: 0,
    prev: null,
    next: null,
    currentPage: 1,
    items: []
  }),
  actions: {
    init() {
      this.fetchData();
    },
    fetchData() {
      $fetch(`https://rickandmortyapi.com/api/location/?page=${this.currentPage}`).then((response) => {
        this.items = Object.values(response == null ? undefined : response.results);
        const info = response == null ? undefined : response.info;
        this.count = info.count;
        this.pages = info.pages;
        this.prev = info.prev;
        this.next = info.next;
      }).catch((error) => {
        console.error("Error:", error);
      });
    },
    async fetchLocationById(id) {
      const currentItem = this.items.find((item) => item.id === id);
      if (currentItem) {
        return currentItem;
      }
      return await $fetch(`https://rickandmortyapi.com/api/location/${id}`);
    },
    setCurrentPage(value) {
      if (this.currentPage !== value) {
        this.currentPage = value;
        this.fetchData();
      }
    }
  }
});
const useEpisodesStore = defineStore("Episodes", {
  state: () => ({
    count: 0,
    pages: 0,
    prev: null,
    next: null,
    currentPage: 1,
    items: []
  }),
  actions: {
    init() {
      this.fetchData();
    },
    fetchData() {
      $fetch(`https://rickandmortyapi.com/api/episode/?page=${this.currentPage}`).then((response) => {
        this.items = Object.values(response == null ? undefined : response.results);
        const info = response == null ? undefined : response.info;
        this.count = info.count;
        this.pages = info.pages;
        this.prev = info.prev;
        this.next = info.next;
      }).catch((error) => {
        console.error("Error:", error);
      });
    },
    async fetchEpisodeById(id) {
      const currentItem = this.items.find((item) => item.id === id);
      if (currentItem) {
        return currentItem;
      }
      return await $fetch(`https://rickandmortyapi.com/api/episode/${id}`);
    },
    setCurrentPage(value) {
      if (this.currentPage !== value) {
        this.currentPage = value;
        this.fetchData();
      }
    }
  }
});
const useFavoritesStore = defineStore("Favorites", {
  state: () => ({
    characters: [],
    locations: [],
    episodes: [],
    sum: 0
  }),
  actions: {
    addFavCharacter(item) {
      this.characters.push(item);
      this.countSum();
    },
    removeFavCharacter(item) {
      this.characters.splice(this.characters.indexOf(item), 1);
      this.countSum();
    },
    addFavEpisode(item) {
      this.episodes.push(item);
      this.countSum();
    },
    removeFavEpisode(item) {
      this.episodes.splice(this.episodes.indexOf(item), 1);
      this.countSum();
    },
    addFavLocation(item) {
      this.locations.push(item);
      this.countSum();
    },
    removeFavLocation(item) {
      this.locations.splice(this.locations.indexOf(item), 1);
      this.countSum();
    },
    countSum() {
      return this.characters.length + this.locations.length + this.episodes.length;
    }
  }
});

export { BlockProps as B, InlineProps as I, useCharactersStore as a, useFavoritesStore as b, useEpisodesStore as c, useInline as d, useLocationsStore as e, includesPresets as i, useBlock as u };
//# sourceMappingURL=index-MUHduU45.mjs.map
